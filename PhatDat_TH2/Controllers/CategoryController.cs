using Microsoft.AspNetCore.Mvc;
using PhatDat_TH2.Data;
using PhatDat_TH2.Model;

namespace PhatDat_TH2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoryController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetCategories()
        {
            var categories = _context.Categories.ToList();
            return Ok(categories);
        }

        [HttpGet("{id}")]
        public IActionResult GetCategory(int id)
        {
            var category = _context.Categories.Find(id);
            if (category == null) return NotFound();

            return Ok(category);
        }

        [HttpPost]
        public IActionResult Create(Category category)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            category.CreatedAt = DateTime.Now;
            category.CreatedBy = "admin";

            _context.Categories.Add(category);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, category);
        }

        [HttpPut("{id}")]
        public IActionResult Edit(int id, Category category)
        {
            var existing = _context.Categories.Find(id);
            if (existing == null) return NotFound();

            existing.Name = category.Name;
            existing.Description = category.Description;
            _context.SaveChanges();

            return Ok(existing);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var category = _context.Categories.Find(id);
            if (category == null) return NotFound();

            _context.Categories.Remove(category);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
