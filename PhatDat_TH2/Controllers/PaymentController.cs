using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhatDat_TH2.Data;
using PhatDat_TH2.Model;
using PhatDat_TH2.Services.IServices;
using System.Text.Json;

[Route("api/[controller]")]
[ApiController]
public class PaymentController : Controller
{
    private readonly IVnPayService _vnPayService;
    private readonly AppDbContext _context;

    public PaymentController(IVnPayService vnPayService, AppDbContext context)
    {
        _vnPayService = vnPayService;
        _context = context;
    }

    [HttpPost("create")]
    public IActionResult CreatePayment([FromBody] PaymentInformationModel model)
    {
        try
        {
            var payment = new Payment
            {
                UserId = model.UserId,
                MethodId = model.MethodId,
                CustomerName = model.Name,
                Phone = model.Phone,
                Address = model.Address,
                Amount = (decimal)model.Amount,
                OrderInfo = model.OrderDescription,
                Status = "Pending",
                ItemsJson = JsonSerializer.Serialize(model.Items ?? new List<PaymentItemModel>())
            };

            _context.Payments.Add(payment);
            _context.SaveChanges();

            var url = _vnPayService.CreatePaymentUrl(model, HttpContext);
            return Ok(new { paymentUrl = url });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message, inner = ex.InnerException?.Message });
        }
    }




    [HttpGet("vnpay-return")]
    public IActionResult VnPayReturn()
    {
        var response = _vnPayService.PaymentExecute(Request.Query);

        if (response.Success)
        {
            var payment = _context.Payments.FirstOrDefault(p => p.Id == long.Parse(response.OrderId));
            if (payment != null)
            {
                // Tạo Order thật sau khi thanh toán thành công
                var order = new Order
                {
                    UserId = payment.UserId,
                    CustomerName = payment.CustomerName,
                    Phone = payment.Phone,
                    Address = payment.Address,
                    StatusOrderId = 2, // Thanh toán thành công
                    TotalPrice = payment.Amount,
                    MethodId = payment.MethodId,
                    TransactionId = response.TransactionId,
                    OrderDetails = JsonSerializer.Deserialize<List<PaymentItemModel>>(payment.ItemsJson)
                                   .Select(i => new OrderDetail
                                   {
                                       ProductId = i.ProductId,
                                       Quantity = i.Quantity,
                                       Price = i.Price
                                   }).ToList()
                };

                _context.Orders.Add(order);
                _context.SaveChanges();

                // Cập nhật Payment
                payment.OrderId = order.Id;
                payment.Status = "Success";
                payment.TransactionId = response.TransactionId;
                _context.SaveChanges();
            }

            return Ok(new { success = true, message = "Thanh toán thành công" });
        }

        return Ok(new { success = false, message = "Thanh toán thất bại" });
    }


}
