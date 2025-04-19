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

        // 🛒 Lấy giỏ hàng theo userId (nếu chưa có thì tạo mới)
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetOrCreateCart(int userId)
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

        // 🛠 Tạo giỏ hàng cho các user chưa có
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

        // 🔍 Lấy giỏ hàng + thông tin sản phẩm (trả về DTO)
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetCartWithItems(int userId)
        {
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .ThenInclude(ci => ci.Product)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
                return NotFound("❌ Không tìm thấy giỏ hàng cho user này");

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

        // ➕ Thêm sản phẩm vào giỏ hàng
        [HttpPost("add-item")]
        public async Task<IActionResult> AddToCart([FromBody] AddToCartRequest request)
        {
            var user = await _context.Users.FindAsync(request.UserId);
            if (user == null) return NotFound("❌ User không tồn tại");

            var product = await _context.Products.FindAsync(request.ProductId);
            if (product == null) return NotFound("❌ Sản phẩm không tồn tại");

            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .ThenInclude(ci => ci.Product)
                .FirstOrDefaultAsync(c => c.UserId == request.UserId);

            if (cart == null)
            {
                cart = new Cart { UserId = request.UserId };
                _context.Carts.Add(cart);
                await _context.SaveChangesAsync();
            }

            if (cart.CartItems == null) cart.CartItems = new List<CartItem>();

            var cartItem = cart.CartItems.FirstOrDefault(ci => ci.ProductId == request.ProductId);
            if (cartItem != null)
            {
                cartItem.Quantity += request.Quantity;
            }
            else
            {
                cartItem = new CartItem
                {
                    CartId = cart.CartId,
                    ProductId = request.ProductId,
                    Quantity = request.Quantity
                };
                _context.CartItems.Add(cartItem);
            }

            await _context.SaveChangesAsync();

            // Làm mới lại để lấy thông tin Product cho DTO
            await _context.Entry(cartItem).Reference(ci => ci.Product).LoadAsync();

            var cartDTO = new CartDTO
            {
                Id = cart.CartId,
                UserId = cart.UserId,
                Items = cart.CartItems.Select(ci => new CartItemDTO
                {
                    ProductId = ci.ProductId,
                    ProductName = ci.Product?.Name,
                    Quantity = ci.Quantity,
                    Price = ci.Product?.Price ?? 0,
                    Discount = ci.Product?.Discount ?? 0,
                    Avatar = ci.Product?.Avatar,
                    Subtotal = (double)(ci.Quantity * (ci.Product?.Price ?? 0))
                }).ToList(),
                Total = cart.CartItems.Sum(ci => (double)(ci.Quantity * (ci.Product?.Price ?? 0)))
            };

            return Ok(new { message = "✅ Đã thêm sản phẩm vào giỏ hàng", cartDTO });
        }

        // 📝 Cập nhật số lượng sản phẩm
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
                _context.CartItems.Remove(item);
            else
                item.Quantity = request.Quantity;

            await _context.SaveChangesAsync();
            return Ok(new { message = "✅ Đã cập nhật sản phẩm trong giỏ hàng" });
        }

        // ❌ Xóa sản phẩm khỏi giỏ
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

        // 🧹 Xóa toàn bộ sản phẩm trong giỏ
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
