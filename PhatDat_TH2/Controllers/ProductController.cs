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

        public ProductController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var products = _context.Products.Include(p => p.Category).ToList();
            return Ok(products);
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var product = _context.Products.Find(id);
            if (product == null) return NotFound();
            return Ok(product);
        }

        [HttpPost]
        public IActionResult Create(Product product)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            _context.Products.Add(product);
            _context.SaveChanges();

            return CreatedAtAction(nameof(Get), new { id = product.Id }, product);
        }

        [HttpPut("{id}")]
        public IActionResult Edit(int id, Product product)
        {
            var existing = _context.Products.Find(id);
            if (existing == null) return NotFound();

            // Kiểm tra xem CategoryId có tồn tại không
            var category = _context.Categories.Find(product.CategoryId);
            if (category == null)
            {
                return BadRequest("CategoryId không tồn tại trong hệ thống.");
            }

            existing.Name = product.Name;
            existing.Price = product.Price;
            existing.Description = product.Description;
            existing.CategoryId = product.CategoryId;

            _context.SaveChanges();
            return Ok(existing);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var product = _context.Products.Find(id);
            if (product == null) return NotFound();

            _context.Products.Remove(product);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
