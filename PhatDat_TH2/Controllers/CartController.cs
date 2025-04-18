    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using PhatDat_TH2.Data;
    using PhatDat_TH2.Model;
    using PhatDat_TH2.Model.DTO;
    using PhatDat_TH2.Model.Request;

    namespace PhatDat_TH2.Controllers
    {
        [Route("api/[controller]")]
        [ApiController]
        public class CartController : ControllerBase
        {
            private readonly AppDbContext _context;

            public CartController(AppDbContext context)
            {
                _context = context;
            }

            // Lấy cart theo userId, nếu chưa có thì tạo mới
            [HttpGet("{userId}")]
            public async Task<IActionResult> GetCartByUser(int userId)
            {
                var user = await _context.Users.FindAsync(userId);
                if (user == null) return NotFound("❌ User không tồn tại");

                var cart = await _context.Carts
                    .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.Product)
                    .FirstOrDefaultAsync(c => c.UserId == userId);

                if (cart == null)
                {
                    cart = new Cart { UserId = userId };
                    _context.Carts.Add(cart);
                    await _context.SaveChangesAsync();
                }

                return Ok(cart);
            }

            // Tạo cart cho tất cả user chưa có (dùng 1 lần nếu user đã tạo trước)
            [HttpPost("init-carts")]
            public async Task<IActionResult> CreateCartsForAllUsers()
            {
                var userIdsWithCart = await _context.Carts.Select(c => c.UserId).ToListAsync();
                var usersWithoutCart = await _context.Users
                    .Where(u => !userIdsWithCart.Contains(u.Id))
                    .ToListAsync();

                foreach (var user in usersWithoutCart)
                {
                    _context.Carts.Add(new Cart { UserId = user.Id });
                }

                await _context.SaveChangesAsync();

                return Ok(new { message = "✅ Đã tạo cart cho tất cả user chưa có." });
            }

            [HttpGet("user/{userId}")]
            public async Task<IActionResult> GetCart(int userId)
            {
                var cart = await _context.Carts
                    .Include(c => c.CartItems)
                        .ThenInclude(ci => ci.Product)
                    .FirstOrDefaultAsync(c => c.UserId == userId);

                if (cart == null)
                {
                    return NotFound("❌ Không tìm thấy giỏ hàng cho user này");
                }

                // Dữ liệu DTO trả về
                var cartDTO = new CartDTO
                {
                    Id = cart.CartId,
                    UserId = cart.UserId,
                    Items = cart.CartItems.Select(ci => new CartItemDTO
                    {
                        ProductId = ci.ProductId,
                        ProductName = ci.Product.Name,
                        Quantity = ci.Quantity,
                        Price = ci.Product.Price,
                        Discount = ci.Product.Discount,
                        Avatar = ci.Product.Avatar,
                        Subtotal = (double)(ci.Quantity * ci.Product.Price)
                    }).ToList(),
                    Total = cart.CartItems.Sum(ci => (double)(ci.Quantity * ci.Product.Price))
                };

                return Ok(cartDTO);
            }


        [HttpPost("add-item")]
        public async Task<IActionResult> AddToCart([FromBody] AddToCartRequest request)
        {
            // Kiểm tra user tồn tại
            var user = await _context.Users.FindAsync(request.UserId);
            if (user == null) return NotFound("❌ User không tồn tại");

            // Kiểm tra sản phẩm tồn tại
            var product = await _context.Products.FindAsync(request.ProductId);
            if (product == null) return NotFound("❌ Sản phẩm không tồn tại");

            // Lấy giỏ hàng của user hoặc tạo mới nếu chưa có
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.UserId == request.UserId);

            if (cart == null)
            {
                cart = new Cart { UserId = request.UserId };
                _context.Carts.Add(cart);
                await _context.SaveChangesAsync(); // Lưu giỏ hàng mới
            }

            // Nếu CartItems là null, khởi tạo nó
            if (cart.CartItems == null)
            {
                cart.CartItems = new List<CartItem>();
            }

            // Kiểm tra sản phẩm đã có trong giỏ chưa
            var cartItem = cart.CartItems.FirstOrDefault(ci => ci.ProductId == request.ProductId);
            if (cartItem != null)
            {
                // Tăng số lượng nếu sản phẩm đã có trong giỏ hàng
                cartItem.Quantity += request.Quantity;
            }
            else
            {
                // Thêm sản phẩm mới vào giỏ hàng
                cartItem = new CartItem
                {
                    CartId = cart.CartId,
                    ProductId = request.ProductId,
                    Quantity = request.Quantity
                };
                _context.CartItems.Add(cartItem); // Để EF tự động gán CartItemId
            }

            await _context.SaveChangesAsync();

            // Tạo DTO để trả về dữ liệu giỏ hàng
            var cartDTO = new CartDTO
            {
                Id = cart.CartId,
                UserId = cart.UserId,
                Items = cart.CartItems?.Where(ci => ci.Product != null) // Kiểm tra Product không null
                                  .Select(ci => new CartItemDTO
                                  {
                                      ProductId = ci.ProductId,
                                      ProductName = ci.Product.Name,
                                      Quantity = ci.Quantity,
                                      Price = ci.Product.Price, // Giữ kiểu decimal
                                      Discount = ci.Product.Discount,
                                      Avatar = ci.Product.Avatar,
                                      Subtotal = (double)(ci.Quantity * ci.Product.Price) // Tính subtotal theo decimal
                                  }).ToList() ?? new List<CartItemDTO>(), // Đảm bảo không trả về null nếu CartItems là null
                Total = cart.CartItems?.Where(ci => ci.Product != null) // Kiểm tra Product không null
                           .Sum(ci => (double)(ci.Quantity * ci.Product.Price)) ?? 0 // Tính tổng cộng sau khi chuyển đổi sang double
            };

            return Ok(new { message = "✅ Đã thêm sản phẩm vào giỏ hàng", cartDTO });
        }


        [HttpPut("update-item")]
            public async Task<IActionResult> UpdateCartItem([FromBody] UpdateCartItemRequest request)
            {
                var cart = await _context.Carts
                    .Include(c => c.CartItems)
                    .FirstOrDefaultAsync(c => c.UserId == request.UserId);

                if (cart == null) return NotFound("❌ Giỏ hàng không tồn tại");

                var item = cart.CartItems.FirstOrDefault(ci => ci.ProductId == request.ProductId);
                if (item == null) return NotFound("❌ Sản phẩm không có trong giỏ hàng");

                if (request.Quantity <= 0)
                {
                    _context.CartItems.Remove(item);
                }
                else
                {
                    item.Quantity = request.Quantity;
                }

                await _context.SaveChangesAsync();
                return Ok(new { message = "✅ Đã cập nhật sản phẩm trong giỏ hàng" });
            }
            [HttpDelete("remove-item")]
      
        
            public async Task<IActionResult> RemoveItem([FromBody] RemoveCartItemRequest request)
            {
                var cart = await _context.Carts
                    .Include(c => c.CartItems)
                    .FirstOrDefaultAsync(c => c.UserId == request.UserId);

                if (cart == null) return NotFound("❌ Giỏ hàng không tồn tại");

                var item = cart.CartItems.FirstOrDefault(ci => ci.ProductId == request.ProductId);
                if (item == null) return NotFound("❌ Sản phẩm không có trong giỏ hàng");

                _context.CartItems.Remove(item);
                await _context.SaveChangesAsync();

                return Ok(new { message = "✅ Đã xóa sản phẩm khỏi giỏ hàng" });
            }
      
        
            [HttpDelete("clear/{userId}")]
            public async Task<IActionResult> ClearCart(int userId)
            {
                var cart = await _context.Carts
                    .Include(c => c.CartItems)
                    .FirstOrDefaultAsync(c => c.UserId == userId);

                if (cart == null) return NotFound("❌ Giỏ hàng không tồn tại");

                _context.CartItems.RemoveRange(cart.CartItems);
                await _context.SaveChangesAsync();

                return Ok(new { message = "🧹 Giỏ hàng đã được làm trống" });
            }

        }
    }
