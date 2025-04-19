using Microsoft.AspNetCore.Mvc;
using PhatDat_TH2.Data;
using PhatDat_TH2.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using PhatDat_TH2.Model.DTO;

namespace PhatDat_TH2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

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
            var orders = _context.Orders
                                  .Where(o => o.StatusOrderId != 4) // bỏ đơn hàng có status = 4
                                 .Include(o => o.User)
                                 .Include(o => o.StatusOrder) // Bao gồm thông tin trạng thái đơn hàng
                                 .Include(o => o.OrderDetails) // Bao gồm thông tin chi tiết đơn hàng
                                 .ThenInclude(od => od.Product) // Bao gồm thông tin sản phẩm trong chi tiết đơn hàng
                                 .Select(o => new
                                 {
                                     o.Id,
                                     o.UserId,
                                     CustomerName = o.User.Fullname,
                                     EmailCustomer = o.User.Email,

                                     o.OrderDate,
                                     o.StatusOrderId,
                                        StatusName = o.StatusOrder.Name, // Lấy tên trạng thái đơn hàng
                                     o.TotalPrice,
                                     OrderDetails = o.OrderDetails.Select(od => new
                                     {
                                         od.Id,
                                         ProductName = od.Product.Name,
                                         od.Quantity,
                                         od.Price,
                                         od.TotalPrice
                                     }).ToList() // Lấy thông tin chi tiết đơn hàng
                                 })
                                 .ToList();

            return Ok(orders);
        }




        [HttpGet("{id}")]
        public IActionResult GetOrder(int id)
        {
            var order = _context.Orders
        .Where(o => o.Id == id && o.StatusOrderId != 4) // bỏ nếu status = 4
                 .Include(o => o.User)
                .Include(o => o.StatusOrder)
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .Where(o => o.Id == id)
                .Select(o => new
                {
                    o.Id,
                    o.UserId, CustomerName = o.User.Fullname, EmailCustomer = o.User.Email,
                    o.OrderDate,
                    o.StatusOrderId,
                    StatusName = o.StatusOrder.Name,
                    o.TotalPrice,
                    OrderDetails = o.OrderDetails.Select(od => new
                    {
                        od.Id,
                        ProductName = od.Product.Name,
                        od.Quantity,
                        od.Price,
                        od.Discount,
                        PriceSale = od.Price * (1 - (od.Discount / 100m)),
                        TotalPrice = od.TotalPrice
                    }).ToList()
                })
                .FirstOrDefault();

            if (order == null)
                return NotFound();

            return Ok(order);
        }



        [HttpGet("user/{userId}")]
        public IActionResult GetOrdersByUserId(int userId)
        {
            var orders = _context.Orders
                  .Where(o => o.UserId == userId && o.StatusOrderId != 4) // lọc status
                .Include(o => o.User) // cần để lấy Fullname, Email
                .Include(o => o.StatusOrder)
                .Include(o => o.Method) // nếu bạn có liên kết với phương thức thanh toán
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .Select(o => new
                {
                    o.Id,
                    o.UserId,
                    CustomerName = o.User != null ? o.User.Fullname : "Không rõ",
                    EmailCustomer = o.User != null ? o.User.Email : "Không rõ",
                    o.OrderDate,
                    o.StatusOrderId,
                    StatusName = o.StatusOrder != null ? o.StatusOrder.Name : "Không rõ",
                    o.MethodId,
                    MethodName = o.Method != null ? o.Method.Name : "Không rõ",
                    o.TotalPrice,
                })
                .ToList();

            if (!orders.Any())
            {
                return NotFound($"Không tìm thấy đơn hàng nào cho userId {userId}");
            }

            return Ok(orders);
        }


        [HttpPost("create")]
        public IActionResult CreateOrder([FromBody] OrderRequest orderRequest)
        {
            if (orderRequest == null || orderRequest.Items == null || !orderRequest.Items.Any())
                return BadRequest(new { message = "Không có sản phẩm trong đơn hàng." });

            decimal totalPrice = 0;

            // Lấy thông tin người dùng từ UserId
            var user = _context.Users.FirstOrDefault(u => u.Id == orderRequest.UserId);
            if (user == null)
                return NotFound(new { message = $"Không tìm thấy người dùng với ID {orderRequest.UserId}" });

            string customerFullName = user.Fullname;
            string customerEmail = user.Email;

            var order = new Order
            {
                CustomerName = customerFullName,
                UserId = orderRequest.UserId,
                Email = customerEmail,
                OrderDate = DateTime.Now,
                CreatedAt = DateTime.Now,
                CreatedBy = "System",
                StatusOrderId = 1, // Trạng thái "Đang xử lý"
                MethodId=orderRequest.MethodId,
                OrderDetails = new List<OrderDetail>()
            };

            foreach (var item in orderRequest.Items)
            {
                var product = _context.Products.Find(item.ProductId);
                if (product == null)
                    return NotFound(new { message = $"Sản phẩm với ID {item.ProductId} không tồn tại." });

                var priceSale = product.Price - (product.Price * product.Discount / 100m);
                var itemTotal = priceSale * item.Quantity;

                var orderDetail = new OrderDetail
                {
                    ProductId = product.Id,
                    ProductName = product.Name,
                    Quantity = item.Quantity,
                    Price = product.Price,
                    Discount = product.Discount,
                    PriceSale = priceSale
                };
                order.OrderDetails.Add(orderDetail);

                totalPrice += itemTotal;
            }

            order.TotalPrice = totalPrice;

            _context.Orders.Add(order);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
        }




        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] OrderUpdateDTO dto)
        {
            var order = await _context.Orders
                .Include(o => o.OrderDetails)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
                return NotFound("Không tìm thấy đơn hàng.");

            order.CustomerName = dto.CustomerName;

            var status = await _context.StatusOrders.FindAsync(dto.StatusOrderId);
            if (status == null)
                return BadRequest($"Không tìm thấy trạng thái đơn hàng với id {dto.StatusOrderId}");

            order.StatusOrderId = dto.StatusOrderId;
            order.UpdatedAt = DateTime.Now;
            order.UpdatedBy = "admin";

            if (dto.Items != null && dto.Items.Any())
            {
                _context.OrderDetails.RemoveRange(order.OrderDetails);
                order.OrderDetails = new List<OrderDetail>();
                decimal totalPrice = 0;

                foreach (var item in dto.Items)
                {
                    var product = await _context.Products.FindAsync(item.ProductId);
                    if (product == null)
                        return BadRequest($"Không tìm thấy sản phẩm với id {item.ProductId}");

                    var priceSale = product.Price - (product.Price * product.Discount / 100);
                    var itemTotal = priceSale * item.Quantity;

                    var detail = new OrderDetail
                    {
                        ProductId = product.Id,
                        ProductName = product.Name,
                        Quantity = item.Quantity,
                        Price = product.Price,
                        Discount = product.Discount,
                        PriceSale = priceSale
                    };

                    totalPrice += itemTotal;
                    order.OrderDetails.Add(detail);
                }

                order.TotalPrice = totalPrice;
            }

            await _context.SaveChangesAsync();

            return Ok(order); // ✅ Đảm bảo return luôn xảy ra
        }


        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var order = _context.Orders
                .Include(o => o.OrderDetails) // Load các chi tiết đơn hàng
                .FirstOrDefault(o => o.Id == id);

            if (order == null)
                return NotFound(new { message = "Không tìm thấy đơn hàng." });

            // Chỉ cho phép xóa nếu đơn hàng đã bị hủy (StatusOrderId = 4)
            if (order.StatusOrderId != 4)
                return BadRequest(new { message = "Chỉ có thể xóa vĩnh viễn các đơn hàng đã bị hủy." });

            // Xóa chi tiết đơn hàng trước
            _context.OrderDetails.RemoveRange(order.OrderDetails);

            // Sau đó xóa đơn hàng
            _context.Orders.Remove(order);
            _context.SaveChanges();

            return Ok(new { message = "Đã xóa vĩnh viễn đơn hàng bị hủy." });
        }


        [HttpPut("cancel/{id}")]
        public async Task<IActionResult> CancelOrder(int id)
        {
            var order = await _context.Orders
                .Include(o => o.StatusOrder) // Đảm bảo rằng StatusOrder đã được bao gồm
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
                return NotFound("Không tìm thấy đơn hàng.");

            // Kiểm tra trạng thái hiện tại có phải là "Đang xử lý" (StatusOrderId = 1) không
            if (order.StatusOrderId != 1)
            {
                return BadRequest("Chỉ có đơn hàng đang xử lý mới có thể hủy.");
            }

            // Lấy trạng thái "Đã hủy" từ StatusOrders
            var canceledStatus = await _context.StatusOrders
                .FirstOrDefaultAsync(s => s.Name == "Đã hủy");
            if (canceledStatus == null)
            {
                return BadRequest("Không tìm thấy trạng thái 'Đã hủy'.");
            }

            // Cập nhật trạng thái của đơn hàng
            order.StatusOrderId = canceledStatus.Id;
            order.UpdatedAt = DateTime.Now;
            order.UpdatedBy = "admin"; // Hoặc lấy thông tin người dùng từ session nếu cần

            // Lưu thay đổi
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đơn hàng đã được hủy thành công." });
        }


        [HttpGet("canceled/{userId}")]
        public IActionResult GetCanceledOrders(int userId)
        {
            var canceledOrders = _context.Orders
                .Include(o => o.User)
                .Include(o => o.StatusOrder)
                .Where(o => o.StatusOrderId == 4 && o.UserId == userId)
                .Select(o => new
                {
                    o.Id,
                    o.UserId,
                    CustomerName = o.User.Fullname,
                    EmailCustomer = o.User.Email,
                    o.OrderDate,
                    StatusName = o.StatusOrder.Name,
                    o.TotalPrice,
                })
                .ToList();

            if (!canceledOrders.Any())
            {
                return NotFound(new { message = "Không tìm thấy đơn hàng đã hủy của người dùng này." });
            }

            return Ok(canceledOrders);
        }


    }
}
