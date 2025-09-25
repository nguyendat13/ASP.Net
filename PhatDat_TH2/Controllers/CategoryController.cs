using Microsoft.AspNetCore.Mvc;
using PhatDat_TH2.Model.DTO;
using PhatDat_TH2.Services.Interfaces;

namespace PhatDat_TH2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _service;

        public CategoryController(ICategoryService service)
        {
            _service = service;
        }

        [HttpGet]
        public IActionResult GetCategories() => Ok(_service.GetAll());

        [HttpGet("{id}")]
        public IActionResult GetCategory(int id)
        {
            var category = _service.GetById(id);
            if (category == null) return NotFound();
            return Ok(category);
        }

        [HttpPost]
        public IActionResult Create([FromBody] CategoryDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var created = _service.Create(dto);
            return CreatedAtAction(nameof(GetCategory), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public IActionResult Edit(int id, [FromBody] CategoryDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var updated = _service.Update(id, dto);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var deleted = _service.Delete(id);
            if (!deleted) return NotFound();
            return NoContent();
        }

        [HttpGet("products/{categoryId}")]
        public IActionResult GetProductsByCategory(int categoryId)
        {
            var products = _service.GetProductsByCategory(categoryId);
            if (!products.Any()) return NotFound("Không có sản phẩm nào trong danh mục này.");
            return Ok(products);
        }
    }
}
