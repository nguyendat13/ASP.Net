using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhatDat_TH2.Data;
using PhatDat_TH2.Model;

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
            var existing = await _context.Products.FindAsync(id);
            if (existing == null) return NotFound();

            existing.Name = request.Name;
            existing.Description = request.Description;
            existing.Price = request.Price;
            existing.Discount = request.Discount;
            existing.CategoryId = request.CategoryId;
            existing.UpdatedAt = DateTime.UtcNow;
            existing.UpdatedBy = "admin";

            if (image != null)
            {
                string avatarPath = await SaveImage(image);
                existing.Avatar = avatarPath;
            }

            await _context.SaveChangesAsync();
            return Ok(existing);
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

            return "/images/" + fileName;
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

    }
}
