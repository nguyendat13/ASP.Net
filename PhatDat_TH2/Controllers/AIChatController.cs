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

            // Chào hỏi
            if (question.Contains("xin chào") || question.Contains("chào") ||
                question.Contains("hello") || question.Contains("hi"))
            {
                return Ok(new
                {
                    Answer = "Xin chào, tôi có thể giúp gì cho bạn?",
                    Products = (object?)null
                });
            }

            // Hỏi sản phẩm mới
            if (question.Contains("sản phẩm mới") || question.Contains("hàng mới"))
            {
                var products = _productService.GetNewProducts().Take(5);
                if (products.Any())
                {
                    return Ok(new
                    {
                        Answer = "Đây là những sản phẩm mới nhất:",
                        Products = products.Select(p => new { p.Id, p.Name, p.Price, p.Avatar })
                    });
                }
                else
                {
                    return Ok(new
                    {
                        Answer = "Chưa có sản phẩm mới.",
                        Products = (object?)null
                    });
                }
            }


            // ✅ Hỏi sản phẩm bán chạy
            if (question.Contains("sản phẩm bán chạy") || question.Contains("bán chạy nhất"))
            {
                var products = _productService.GetTopSellingProducts().Take(5);
                if (products.Any())
                {
                    return Ok(new
                    {
                        Answer = "Top sản phẩm bán chạy hiện nay:",
                        Products = products.Select(p => new { p.Id, p.Name, p.Price, p.Avatar })
                    });
                }
                return Ok(new { Answer = "Chưa có dữ liệu sản phẩm bán chạy.", Products = (object?)null });
            }

            // ✅ Hỏi sản phẩm liên quan
            if (question.Contains("liên quan"))
            {
                var allProducts = _productService.GetAll();
                var matched = allProducts.FirstOrDefault(p => question.Contains(p.Name.ToLower()));

                if (matched != null)
                {
                    var related = await _productService.GetRelatedProducts(matched.Id);
                    if (related.Any())
                    {
                        return Ok(new
                        {
                            Answer = $"Sản phẩm liên quan đến {matched.Name}:",
                            Products = related.Select(p => new { p.Id, p.Name, p.Price, p.Avatar })
                        });
                    }
                    return Ok(new { Answer = "Không có sản phẩm phù hợp.", Products = (object?)null });
                }
            }
            // Hỏi sản phẩm chung chung
            if (question.Contains("sản phẩm"))
            {
                var products = _productService.GetNewProducts().Take(3);
                if (products.Any())
                {
                    return Ok(new
                    {
                        Answer = "Đây là một số sản phẩm gợi ý cho bạn:",
                        Products = products.Select(p => new { p.Id, p.Name, p.Price, p.Avatar })
                    });
                }
                else
                {
                    return Ok(new
                    {
                        Answer = "Chưa có sản phẩm nào để gợi ý.",
                        Products = (object?)null
                    });
                }
            }

            // Hỏi chi tiết 1 sản phẩm cụ thể
            var allProds = _productService.GetAll();
            var prod = allProds.FirstOrDefault(p => question.Contains(p.Name.ToLower()));
            if (prod != null)
            {
                return Ok(new
                {
                    Answer = $"Sản phẩm {prod.Name} có giá {prod.Price:N0}₫, mô tả: {prod.Description}",
                    Products = (object?)null
                });
            }

            // Nếu không khớp điều kiện nào → fallback gọi Gemini
            var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={GEMINI_KEY}";

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

                if (error.Contains("RESOURCE_EXHAUSTED") || error.Contains("quota"))
                {
                    return Ok(new
                    {
                        Answer = "API Gemini đã hết quota, vui lòng thử lại sau.",
                        Products = (object?)null
                    });
                }

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
