using Microsoft.AspNetCore.Mvc;
using PhatDat_TH2.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq;

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
}
