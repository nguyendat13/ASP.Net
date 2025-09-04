using Microsoft.AspNetCore.Mvc;
using PhatDat_TH2.Model.Request;
using System.Net.Http;
using System.Text;
using System.Text.Json;

[Route("api/[controller]")]
[ApiController]
public class AIChatController : ControllerBase
{
    private readonly HttpClient _httpClient;
    private const string GEMINI_KEY = "AIzaSyCxzJAo9SHQdLDEu0d_f8Uf2_Eo8gZWUcA";

    public AIChatController(IHttpClientFactory httpClientFactory)
    {
        _httpClient = httpClientFactory.CreateClient();
    }

    [HttpPost("ask")]
    public async Task<IActionResult> Ask([FromBody] AIRequest request)
    {
        if (string.IsNullOrWhiteSpace(request?.Question))
            return BadRequest("Câu hỏi không hợp lệ.");

        try
        {
            // Payload chuẩn Gemini 2.0
            var payload = new
            {
                model = "gemini-2.0-flash",
                temperature = 0.7,
                maxOutputTokens = 500,
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new { text = request.Question }
                        }
                    }
                }
            };

            var json = JsonSerializer.Serialize(payload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("X-Goog-Api-Key", GEMINI_KEY);

            var response = await _httpClient.PostAsync(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
                content);

            if (!response.IsSuccessStatusCode)
                return StatusCode((int)response.StatusCode,
                    $"Lỗi khi gọi Gemini API: {response.ReasonPhrase}");

            var result = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(result);

            string answer = "Xin lỗi, AI không trả về kết quả.";

            if (doc.RootElement.TryGetProperty("candidates", out var candidates) &&
                candidates.ValueKind == JsonValueKind.Array &&
                candidates.GetArrayLength() > 0 &&
                candidates[0].TryGetProperty("content", out var contentElem) &&
                contentElem.TryGetProperty("parts", out var parts) &&
                parts.ValueKind == JsonValueKind.Array &&
                parts.GetArrayLength() > 0)
            {
                answer = parts[0].GetProperty("text").GetString() ?? answer;
            }

            return Ok(new AIResponse { Answer = answer });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Lỗi server: {ex.Message}");
        }
    }
}
