using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhatDat_TH2.Data;
using PhatDat_TH2.Model;
using PhatDat_TH2.Model.DTO;

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
            var categories = _context.Categories
                .Select(c => new CategoryListDTO
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description
                })
                .ToList();

            return Ok(categories);
        }


        [HttpGet("{id}")]
        public IActionResult GetCategory(int id)
        {
            var category = _context.Categories
                .Include(c => c.Products)
                .Where(c => c.Id == id)
                .Select(c => new CategoryDetailDTO
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description,
                    Products = c.Products.Select(p => new ProductListDTO
                    {
                        Id = p.Id,
                        Name = p.Name,
                        Description = p.Description,
                        Price = p.Price,
                        Avatar = p.Avatar,
                        Discount = p.Discount
                    }).ToList()
                })
                .FirstOrDefault();

            if (category == null) return NotFound();

            return Ok(category);
        }


        [HttpPost]
        public IActionResult Create([FromBody] Category category)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(errors); // Trả về chi tiết lỗi
            }


            // Kiểm tra xem tên danh mục đã tồn tại trong cơ sở dữ liệu chưa
            var existingCategory = _context.Categories.FirstOrDefault(c => c.Name == category.Name);
            if (existingCategory != null)
            {
                return BadRequest("Danh mục với tên này đã tồn tại.");
            }

            // Chỉ thêm thông tin cơ bản, bỏ qua nếu phía client gửi kèm product
            var newCategory = new Category
            {
                Name = category.Name,
                Description = category.Description,
                CreatedAt = DateTime.Now,
                CreatedBy = "admin"
            };

            _context.Categories.Add(newCategory);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetCategory), new { id = newCategory.Id }, newCategory);
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
