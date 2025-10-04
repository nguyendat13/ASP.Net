using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PhatDat_TH2.Model.Request;
using PhatDat_TH2.Services.IServices;
using System.Security.Claims;

namespace PhatDat_TH2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly IActivityLogService _logService;

        public ProductController(IProductService productService, IActivityLogService logService)
        {
            _productService = productService;
            _logService = logService;

        }

        [HttpGet]
        public IActionResult GetAll() => Ok(_productService.GetAll());

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var product = _productService.GetById(id);
            return product == null ? NotFound() : Ok(product);
        }


        [HttpGet("image/{*filename}")]
        public IActionResult GetImage(string filename, [FromServices] IImageService imageService)
        {
            if (filename.StartsWith("http"))
            {
                return Redirect(filename);
            }

            try
            {
                return imageService.GetImage(filename);
            }
            catch (FileNotFoundException)
            {
                return NotFound("Không tìm thấy ảnh.");
            }
        }



        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] ProductRequest request, IFormFile? image, [FromQuery] bool useCloudinary = false)
        {
            var product = await _productService.CreateAsync(request, image, useCloudinary);
            // ✅ Ghi log
            var userId = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            await _logService.LogAsync(
                string.IsNullOrEmpty(userId) ? null : int.Parse(userId),
                "Create",
                "Product",
                product.Id,
                new { product.Name, product.Price },
                HttpContext.Connection.RemoteIpAddress?.ToString(),
                Request.Headers["User-Agent"].ToString()
            );

            return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] ProductRequest request, IFormFile? image, [FromQuery] bool useCloudinary = false)
        {
            var product = await _productService.UpdateAsync(id, request, image, useCloudinary);
            return product == null ? NotFound() : Ok(product);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _productService.DeleteAsync(id);
            return success ? NoContent() : NotFound();
        }

        [HttpGet("new")]
        public IActionResult GetNewProducts() => Ok(_productService.GetNewProducts());

        [HttpGet("top-selling")]
        public IActionResult GetTopSellingProducts() => Ok(_productService.GetTopSellingProducts());

        [HttpGet("search")]
        public IActionResult SearchProducts([FromQuery] string query)
        {
            if (string.IsNullOrEmpty(query)) return BadRequest("Từ khóa tìm kiếm không hợp lệ.");
            return Ok(_productService.SearchProducts(query));
        }

        [HttpGet("related")]
        public async Task<IActionResult> GetRelatedProducts(int productId)
        {
            var related = await _productService.GetRelatedProducts(productId);
            return Ok(related);
        }
    }
}
