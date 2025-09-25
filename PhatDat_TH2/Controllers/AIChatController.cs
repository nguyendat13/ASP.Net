using Microsoft.AspNetCore.Mvc;
using PhatDat_TH2.Model.Request;
using PhatDat_TH2.Services.Interfaces;
using PhatDat_TH2.Services.IServices;
using System.Text.Json;

[Route("api/[controller]")]
[ApiController]
public class AIChatController : ControllerBase
{
    private readonly HttpClient _httpClient;
    private readonly IProductService _productService;
    private readonly ICategoryService _categoryService;

    private const string GEMINI_KEY = "AIzaSyCxzJAo9SHQdLDEu0d_f8Uf2_Eo8gZWUcA";

    public AIChatController(
        IHttpClientFactory httpClientFactory,
        IProductService productService,
        ICategoryService categoryService
    )
    {
        _httpClient = httpClientFactory.CreateClient();
        _productService = productService;
        _categoryService = categoryService;
    }

    [HttpPost("ask")]
    public async Task<IActionResult> AskAI([FromBody] AIRequest request)
    {
        if (string.IsNullOrWhiteSpace(request?.Question))
            return BadRequest("Câu hỏi không hợp lệ.");

        try
        {
            string question = request.Question.ToLower();

            // Hỏi danh mục
            if (question.Contains("danh mục"))
            {
                var categories = _categoryService.GetAll();
                var names = string.Join(", ", categories.Select(c => c.Name));
                return Ok(new
                {
                    Answer = $"Hiện có {categories.Count()} danh mục: {names}.",
                    Products = (object?)null
                });
            }

            // Hỏi sản phẩm
            if (question.Contains("sản phẩm"))
            {
                var products = _productService.GetNewProducts().Take(3); // Lấy 3 sản phẩm mới
                return Ok(new
                {
                    Answer = "Đây là một số sản phẩm gợi ý cho bạn:",
                    Products = products.Select(p => new
                    {
                        p.Id,
                        p.Name,
                        p.Price,
                        p.Avatar
                    })
                });
            }

            // Hỏi chi tiết 1 sản phẩm cụ thể
            var allProducts = _productService.GetAll();
            var matched = allProducts.FirstOrDefault(p => question.Contains(p.Name.ToLower()));
            if (matched != null)
            {
                return Ok(new
                {
                    Answer = $"Sản phẩm {matched.Name} có giá {matched.Price}₫, mô tả: {matched.Description}",
                    Products = (object?)null
                });
            }

            // Fallback gọi Gemini nếu không match
            var url =
                $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_KEY}";

            var payload = new
            {
                contents = new[]
                {
                    new
                    {
                        role = "user",
                        parts = new[]
                        {
                            new { text = request.Question }
                        }
                    }
                },
                generationConfig = new
                {
                    temperature = 0.7,
                    maxOutputTokens = 500
                }
            };

            var response = await _httpClient.PostAsJsonAsync(url, payload);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                return BadRequest($"Lỗi khi gọi Gemini API: {error}");
            }

            var result = await response.Content.ReadFromJsonAsync<JsonElement>();
            var answer = result.GetProperty("candidates")[0]
                               .GetProperty("content")
                               .GetProperty("parts")[0]
                               .GetProperty("text")
                               .GetString();

            return Ok(new { Answer = answer, Products = (object?)null });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Lỗi server: {ex.Message}");
        }
    }
}
