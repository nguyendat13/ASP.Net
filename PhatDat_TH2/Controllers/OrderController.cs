using Microsoft.AspNetCore.Mvc;
using PhatDat_TH2.Data;
using PhatDat_TH2.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace PhatDat_TH2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrderController(AppDbContext context)
        {
            _context = context;
        }
        public class OrderInputItem
        {
            public int ProductId { get; set; }
            public int Quantity { get; set; }
        }

        public class OrderInput
        {
            public string CustomerName { get; set; }
            public string Status { get; set; }
            public List<OrderInputItem> Items { get; set; }
        }

        [HttpGet]
        public IActionResult GetOrders()
        {
            var orders = _context.Orders.Include(o => o.OrderDetails)
                 .ThenInclude(od => od.Product)
                .ToList(); // Include OrderDetails
            return Ok(orders);
        }

        [HttpGet("{id}")]
        public IActionResult GetOrder(int id)
        {
            var order = _context.Orders
                .Include(o => o.OrderDetails) // Lấy chi tiết đơn hàng
                .ThenInclude(od => od.Product)
                .FirstOrDefault(o => o.Id == id);

            if (order == null) return NotFound();
            return Ok(order);
        }

        [HttpGet("user/{userId}")]
        public IActionResult GetOrdersByUserId(int userId)
        {
            var orders = _context.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .ToList();

            if (!orders.Any())
                return NotFound($"Không tìm thấy đơn hàng nào cho userId {userId}");

            return Ok(orders);
        }


        [HttpPost("create")]
        public IActionResult CreateOrder([FromBody] OrderRequest orderRequest)
        {
            if (orderRequest == null || orderRequest.Items == null || !orderRequest.Items.Any())
                return BadRequest(new { message = "Không có sản phẩm trong đơn hàng." });

            // Tạo đơn hàng mới
            var order = new Order
            {
                CustomerName = orderRequest.CustomerName,
                Status = orderRequest.Status,
                UserId = orderRequest.UserId,
                OrderDate = DateTime.Now,
                CreatedAt = DateTime.Now,
                CreatedBy = "System"
            };

            _context.Orders.Add(order);
            _context.SaveChanges(); // Lưu đơn hàng và lấy ID của nó

            // Thêm các sản phẩm vào OrderDetail
            foreach (var item in orderRequest.Items)
            {
                var product = _context.Products.Find(item.ProductId);
                if (product == null)
                {
                    return NotFound(new { message = $"Sản phẩm với ID {item.ProductId} không tồn tại." });
                }

                var orderDetail = new OrderDetail
                {
                    OrderId = order.Id,
                    ProductId = item.ProductId,
                    ProductName = product.Name,
                    Quantity = item.Quantity,
                    Price = product.Price,
                    Discount = product.Discount,
                    PriceSale = product.Price - (product.Price * product.Discount / 100)
                };

                _context.OrderDetails.Add(orderDetail);
            }

            // Lưu các chi tiết đơn hàng
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] OrderUpdateDTO dto)
        {
            var order = await _context.Orders
                .Include(o => o.OrderDetails)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null) return NotFound("Không tìm thấy đơn hàng.");

            order.CustomerName = dto.CustomerName;
            order.Status = dto.Status;
            order.UpdatedAt = DateTime.Now;
            order.UpdatedBy = "admin";

            // Xoá các OrderDetail cũ
            _context.OrderDetails.RemoveRange(order.OrderDetails);

            // Thêm OrderDetail mới
            order.OrderDetails = new List<OrderDetail>();
            foreach (var item in dto.Items)
            {
                var product = await _context.Products.FindAsync(item.ProductId);
                if (product == null) return BadRequest($"Không tìm thấy sản phẩm với id {item.ProductId}");

                var detail = new OrderDetail
                {
                    ProductId = product.Id,
                    ProductName = product.Name,
                    Quantity = item.Quantity,
                    Price = product.Price,
                    Discount = product.Discount,
                    PriceSale = product.Price - product.Discount,
                };

                order.OrderDetails.Add(detail);
            }

            await _context.SaveChangesAsync();

            return Ok(order);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var order = _context.Orders
                .Include(o => o.OrderDetails) // Load các chi tiết đơn hàng
                .FirstOrDefault(o => o.Id == id);

            if (order == null) return NotFound();

            // Xóa chi tiết đơn hàng trước
            _context.OrderDetails.RemoveRange(order.OrderDetails);

            // Sau đó xóa order
            _context.Orders.Remove(order);
            _context.SaveChanges();

            return NoContent();
        }

    }
}
