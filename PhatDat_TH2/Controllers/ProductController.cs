using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhatDat_TH2.Data;
using PhatDat_TH2.Model;
using PhatDat_TH2.Model.Request;

namespace PhatDat_TH2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public ProductController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var products = _context.Products
                                   .Include(p => p.Category) // Bao gồm thông tin danh mục
                                   .Select(p => new
                                   {
                                       p.Id,
                                       p.Name,
                                       p.Description,
                                       p.Price,
                                       p.Avatar, // Đường dẫn hình ảnh
                                       p.Discount,
                                       p.CategoryId,
                                       CategoryName = p.Category.Name
                                   })
                                   .ToList();

            return Ok(products);
        }



        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var product = _context.Products
                                  .Include(p => p.Category) // Bao gồm thông tin danh mục
                                  .Where(p => p.Id == id)
                                  .Select(p => new
                                  {
                                      p.Id,
                                      p.Name,
                                      p.Description,
                                      p.Price,
                                      p.Avatar, // Đường dẫn hình ảnh
                                      p.Discount,
                                      p.CategoryId,
                                      CategoryName = p.Category.Name // Thêm tên danh mục vào kết quả
                                  })
                                  .FirstOrDefault();

            if (product == null) return NotFound();

            return Ok(product);
        }


        [HttpPost]
        public async Task<IActionResult> Create([FromForm] ProductRequest request, IFormFile? image)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == request.CategoryId);
            if (category == null)
            {
                return BadRequest("Danh mục không tồn tại.");
            }

            string? avatarPath = null;
            if (image != null)
            {
                avatarPath = await SaveImage(image);
            }

            var product = new Product
            {
                Name = request.Name,
                Description = request.Description,
                Price = request.Price,
                Discount = request.Discount,
                Avatar = avatarPath,
                CategoryId = request.CategoryId,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "admin"
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] ProductRequest request, IFormFile? image)
        {
            // Tìm sản phẩm theo id
            var existingProduct = await _context.Products.FindAsync(id);
            if (existingProduct == null)
            {
                return NotFound();
            }

            // Kiểm tra nếu danh mục tồn tại
            var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == request.CategoryId);
            if (category == null)
            {
                return BadRequest("Danh mục không tồn tại.");
            }

            // Cập nhật thông tin sản phẩm từ ProductRequest
            existingProduct.Name = request.Name;
            existingProduct.Description = request.Description;
            existingProduct.Price = request.Price;
            existingProduct.Discount = request.Discount;
            existingProduct.CategoryId = request.CategoryId;
            existingProduct.UpdatedAt = DateTime.UtcNow;
            existingProduct.UpdatedBy = "admin";  // Bạn có thể thay đổi theo người dùng thực hiện cập nhật

            // Xử lý hình ảnh nếu có
            if (image != null)
            {
                string avatarPath = await SaveImage(image); // Lưu hình ảnh
                existingProduct.Avatar = avatarPath;  // Cập nhật đường dẫn hình ảnh
            }

            // Lưu thay đổi vào cơ sở dữ liệu
            await _context.SaveChangesAsync();

            // Trả về thông tin sản phẩm đã được cập nhật
            return Ok(existingProduct);
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private async Task<string> SaveImage(IFormFile image)
        {
            var fileName = Guid.NewGuid() + Path.GetExtension(image.FileName);
            var folderPath = Path.Combine(_env.WebRootPath, "images");

            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            var filePath = Path.Combine(folderPath, fileName);
            using var stream = new FileStream(filePath, FileMode.Create);
            await image.CopyToAsync(stream);

            return fileName;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadImage(IFormFile image)
        {
            if (image == null || image.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            var fileName = Path.GetFileName(image.FileName);  // Giữ tên gốc của file
            var folderPath = Path.Combine(_env.WebRootPath, "images");

            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath); // Tạo thư mục nếu không tồn tại
            }

            var filePath = Path.Combine(folderPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(stream); // Lưu file vào thư mục
            }

            // Trả về đường dẫn tương đối để frontend có thể sử dụng
            return Ok(new { url = "/images/" + fileName });
        }

        [HttpGet("image/{filename}")]
        public IActionResult GetImage(string filename)
        {
            // Loại bỏ /images/ nếu filename từ DB có thêm
            if (filename.StartsWith("/images/"))
                filename = filename["/images/".Length..];

            var folderPath = Path.Combine(_env.WebRootPath, "images");
            var filePath = Path.Combine(folderPath, filename);

            if (!System.IO.File.Exists(filePath))
                return NotFound("Không tìm thấy ảnh.");

            var imageBytes = System.IO.File.ReadAllBytes(filePath);
            var contentType = GetContentType(filePath);

            return File(imageBytes, contentType);
        }


        private string GetContentType(string path)
        {
            var extension = Path.GetExtension(path).ToLowerInvariant();
            return extension switch
            {
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".gif" => "image/gif",
                ".bmp" => "image/bmp",
                _ => "application/octet-stream"
            };
        }
        // Get new products (products created recently)
        [HttpGet("new")]
        public IActionResult GetNewProducts()
        {
            var newProducts = _context.Products
                                       .OrderByDescending(p => p.CreatedAt) // Sắp xếp theo ngày tạo
                                       .Take(5) // Lấy 5 sản phẩm mới nhất
                                       .Include(p => p.Category)
                                       .Select(p => new
                                       {
                                           p.Id,
                                           p.Name,
                                           p.Description,
                                           p.Price,
                                           p.Avatar,
                                           p.Discount,
                                           p.CategoryId,
                                           CategoryName = p.Category.Name
                                       })
                                       .ToList();

            return Ok(newProducts);
        }
        // Get top-selling products (products with highest sales)
        [HttpGet("top-selling")]
        public IActionResult GetTopSellingProducts()
        {
            // Ví dụ giả định có bảng OrderItem để theo dõi doanh thu, bạn cần điều chỉnh theo thực tế của dự án.
            var topSellingProducts = _context.OrderDetails
                                             .GroupBy(oi => oi.ProductId)
                                             .Select(group => new
                                             {
                                                 ProductId = group.Key,
                                                 TotalSales = group.Sum(oi => oi.Quantity)
                                             })
                                             .OrderByDescending(p => p.TotalSales)
                                             .Take(5)
                                             .Join(_context.Products,
                                                   p => p.ProductId,
                                                   product => product.Id,
                                                   (p, product) => new
                                                   {
                                                       product.Id,
                                                       product.Name,
                                                       product.Description,
                                                       product.Price,
                                                       product.Avatar,
                                                       product.Discount,
                                                       product.CategoryId,
                                                       CategoryName = product.Category.Name,
                                                       TotalSales = p.TotalSales
                                                   })
                                             .ToList();

            return Ok(topSellingProducts);
        }
        [HttpGet("search")]
        public IActionResult SearchProducts([FromQuery(Name = "query")] string query)
        {
            if (string.IsNullOrEmpty(query))
            {
                return BadRequest("Từ khóa tìm kiếm không hợp lệ.");
            }

            var products = _context.Products
                .Where(p => p.Name.Contains(query) || p.Description.Contains(query))
                .ToList();

            return Ok(products);
        }

        [HttpGet("related")]
        public async Task<ActionResult<IEnumerable<Product>>> GetRelatedProducts(int productId)
        {
            var product = await _context.Products.FindAsync(productId);
            if (product == null) return NotFound("Không tìm thấy sản phẩm.");

            var related = await _context.Products
                .Where(p => p.CategoryId == product.CategoryId && p.Id != productId)
                .Take(4)
                .ToListAsync();

            return Ok(related);
        }

    }
}
