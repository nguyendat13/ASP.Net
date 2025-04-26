using Microsoft.AspNetCore.Mvc;
using PhatDat_TH2.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using PhatDat_TH2.Model.DTO;
using PhatDat_TH2.Model;

[Route("api/[controller]")]
[ApiController]
public class PaymentController : ControllerBase
{
    private readonly AppDbContext _context;

    public PaymentController(AppDbContext context)
    {
        _context = context;
    }

    // Xác nhận thanh toán
    [HttpPost("confirm/{orderId}")]
    public IActionResult ConfirmPayment(int orderId)
    {
        // Lấy đơn hàng từ database
        var order = _context.Orders
            .Include(o => o.StatusOrder) // Bao gồm trạng thái của đơn hàng
            .FirstOrDefault(o => o.Id == orderId);

        // Kiểm tra xem đơn hàng có tồn tại không
        if (order == null)
            return NotFound(new { message = "Đơn hàng không tồn tại." });

        // Kiểm tra xem trạng thái thanh toán của đơn hàng đã là "Đã thanh toán" chưa
        if (order.StatusOrder.Name == "Đã thanh toán")
            return BadRequest(new { message = "Đơn hàng đã được thanh toán." });

        // Lấy trạng thái "Đã thanh toán" từ bảng StatusOrders
        var paidStatus = _context.StatusOrders
            .FirstOrDefault(s => s.Name == "Đã thanh toán");

        if (paidStatus == null)
            return BadRequest(new { message = "Không tìm thấy trạng thái thanh toán." });

        try
        {
            // Cập nhật trạng thái đơn hàng sang "Đã thanh toán"
            order.StatusOrderId = paidStatus.Id;

            // Lưu thay đổi vào cơ sở dữ liệu
            _context.SaveChanges();

            // Trả về thông báo thành công
            return Ok(new { message = "Thanh toán thành công. Đơn hàng đã được hoàn tất.", orderId = order.Id });
        }
        catch (Exception ex)
        {
            // Nếu có lỗi xảy ra, trả về thông báo lỗi
            return StatusCode(500, new { message = "Đã xảy ra lỗi khi cập nhật đơn hàng.", details = ex.Message });
        }
    }



    [HttpPost("create-vnpay-payment")]
    public IActionResult CreateVnPayPayment([FromBody] PaymentRequestDto model)
    {
        var tick = DateTime.Now.Ticks.ToString();
        var vnp_OrderInfo = "Thanh toán đơn hàng #" + tick;
        var vnp_Amount = (model.Amount * 100).ToString(); // VNP yêu cầu * 100
        var vnp_TxnRef = tick;
        var vnp_ReturnUrl = "https://localhost:7177/api/Payment/vnpay-return";
        var vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        var vnp_HashSecret = "YOUR_HASH_SECRET";
        var vnp_TmnCode = "YOUR_TMNCODE";

        var pay = new VnPayLibrary();
        pay.AddRequestData("vnp_Version", "2.1.0");
        pay.AddRequestData("vnp_Command", "pay");
        pay.AddRequestData("vnp_TmnCode", vnp_TmnCode);
        pay.AddRequestData("vnp_Amount", vnp_Amount);
        pay.AddRequestData("vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss"));
        pay.AddRequestData("vnp_CurrCode", "VND");
        pay.AddRequestData("vnp_IpAddr", HttpContext.Connection.RemoteIpAddress?.ToString());
        pay.AddRequestData("vnp_Locale", "vn");
        pay.AddRequestData("vnp_OrderInfo", vnp_OrderInfo);
        pay.AddRequestData("vnp_OrderType", "other");
        pay.AddRequestData("vnp_ReturnUrl", vnp_ReturnUrl);
        pay.AddRequestData("vnp_TxnRef", vnp_TxnRef);

        string paymentUrl = pay.CreateRequestUrl(vnp_Url, vnp_HashSecret);

        // Lưu vào DB nếu cần
        _context.Payments.Add(new Payment
        {
            TransactionId = vnp_TxnRef,
            Amount = model.Amount,
            Status = "Đang xử lý",
            CreatedAt = DateTime.Now,
            MethodId = model.MethodId,
            UserId = model.UserId,
            OrderInfo = vnp_OrderInfo
        });
        _context.SaveChanges();

        return Ok(new { paymentUrl,
            transactionId = vnp_TxnRef // gửi về client để hiển thị
        });
    }

    [HttpGet("vnpay-return")]
    public IActionResult VnPayReturn()
    {
        var vnpayData = Request.Query;
        var vnp_HashSecret = "YOUR_HASH_SECRET";
        var pay = new VnPayLibrary();

        foreach (var (key, value) in vnpayData)
        {
            if (key.StartsWith("vnp_"))
            {
                pay.AddResponseData(key, value);
            }
        }

        var checkSignature = pay.ValidateSignature(vnp_HashSecret);
        if (!checkSignature)
        {
            return BadRequest("Invalid signature");
        }

        var transactionId = pay.GetResponseData("vnp_TxnRef");
        var responseCode = pay.GetResponseData("vnp_ResponseCode");
        var payment = _context.Payments.FirstOrDefault(p => p.TransactionId == transactionId);

        if (payment == null) return NotFound();

        if (responseCode == "00")
        {
            payment.Status = "Hoàn thành";
            payment.PayDate = DateTime.Now;

            // Tạo Order
            var order = new Order
            {
                UserId = payment.UserId,
                TotalPrice = payment.Amount,
                MethodId = payment.MethodId,
                CreatedAt = DateTime.Now
            };
            _context.Orders.Add(order);
            _context.SaveChanges();

            // Cập nhật OrderId trong Payment
            payment.OrderId = order.Id;
            _context.SaveChanges();

            return Redirect("https://yourclient.com/payment-success");
        }
        else
        {
            payment.Status = "Thất bại";
            _context.SaveChanges();

            return Redirect("https://yourclient.com/payment-fail");
        }
    }

}
