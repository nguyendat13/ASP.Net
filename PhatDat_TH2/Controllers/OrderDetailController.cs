    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using PhatDat_TH2.Data;
    using PhatDat_TH2.Model;
    using PhatDat_TH2.Model.Request;

    namespace PhatDat_TH2.Controllers
    {
        [Route("api/[controller]")]
        [ApiController]
        [Authorize]

        public class OrderDetailController : ControllerBase
        {
            private readonly AppDbContext _context;

            public OrderDetailController(AppDbContext context)
            {
                _context = context;
            }

            [HttpGet]
            public IActionResult GetOrderDetails()
            {
                var orderDetails = _context.OrderDetails
                           .Include(od => od.Product)
                    .ToList();
                return Ok(orderDetails);
            }

            [HttpGet("{id}")]
            public IActionResult GetOrderDetail(int id)
            {
                var detail = _context.OrderDetails
            .Include(od => od.Product)
            .FirstOrDefault(od => od.Id == id);
                if (detail == null) return NotFound();
                return Ok(detail);
            }

            [HttpPost]
            public IActionResult Create([FromBody] OrderDetailRequest dto)
            {
                var product = _context.Products.Find(dto.ProductId);
                if (product == null)
                    return BadRequest($"Không tìm thấy sản phẩm với id {dto.ProductId}");

                var order = _context.Orders.Find(dto.OrderId);
                if (order == null)
                    return BadRequest($"Không tìm thấy đơn hàng với id {dto.OrderId}");

                try
                {
                    var detail = new OrderDetail
                    {
                        OrderId = order.Id,
                        ProductId = product.Id,
                        ProductName = product.Name,
                        Quantity = dto.Quantity,
                        Price = product.Price,
                        Discount = product.Discount,
                        PriceSale = product.Price - product.Discount,
                    };

                    _context.OrderDetails.Add(detail);
                    _context.SaveChanges();

                    return CreatedAtAction(nameof(GetOrderDetail), new { id = detail.Id }, detail);
                }
                catch (DbUpdateException ex)
                {
                    return StatusCode(500, $"Lỗi khi lưu vào database: {ex.InnerException?.Message ?? ex.Message}");
                }
            }


            [HttpPut("{id}")]
            public IActionResult Update(int id, [FromBody] OrderDetailRequest dto)
            {
                var detail = _context.OrderDetails.Find(id);
                if (detail == null) return NotFound();

                var product = _context.Products.Find(dto.ProductId);
                if (product == null)
                    return BadRequest($"Không tìm thấy sản phẩm với id {dto.ProductId}");

                detail.OrderId = dto.OrderId;
                detail.ProductId = product.Id;
                detail.ProductName = product.Name;
                detail.Quantity = dto.Quantity;
                detail.Price = product.Price;
                detail.Discount = product.Discount;
                detail.PriceSale = product.Price - product.Discount;

                _context.SaveChanges();

                return Ok(detail);
            }


            [HttpDelete("{id}")]
            public IActionResult Delete(int id)
            {
                var detail = _context.OrderDetails.Find(id);
                if (detail == null) return NotFound();

                _context.OrderDetails.Remove(detail);
                _context.SaveChanges();

                return NoContent();
            }

        }
    }
