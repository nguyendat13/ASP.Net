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
            var products = _context.Products.ToList();
            return Ok(products);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var product = _context.Products.FirstOrDefault(p => p.Id == id);
            if (product == null) return NotFound();
            return Ok(product);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] Product product, IFormFile? image)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            // Lấy danh mục theo CategoryId
            var category = await _context.Categories.Include(c => c.Products).FirstOrDefaultAsync(c => c.Id == product.CategoryId);
            if (category == null)
            {
                return BadRequest("Danh mục không tồn tại.");
            }
            if (image != null)
            {
                string avatarPath = await SaveImage(image);
                product.Avatar = avatarPath;
            }

            product.CreatedAt = DateTime.UtcNow;
            product.CreatedBy = "admin";

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] Product product, IFormFile? image)
        {
            var existing = await _context.Products.FindAsync(id);
            if (existing == null) return NotFound();

            existing.Name = product.Name;
            existing.Description = product.Description;
            existing.Price = product.Price;
            existing.CategoryId = product.CategoryId;
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
    }
}
