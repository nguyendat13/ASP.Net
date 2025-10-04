using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

public class ImageService : IImageService
{
    private readonly IWebHostEnvironment _env;
    private readonly string _backendUrl;

    public ImageService(IWebHostEnvironment env, IConfiguration configuration)
    {
        _env = env;
        _backendUrl = configuration["BackendUrl"] ?? "https://localhost:7177";
    }


    public FileResult GetImage(string filename)
    {
        // Nếu filename là URL (Cloudinary, v.v.)
        if (filename.StartsWith("http"))
        {
            // ⚠️ Controller mới có thể Redirect,
            // nên Service chỉ nên return null hoặc throw, để Controller xử lý
            throw new InvalidOperationException("External URL detected, use Redirect in Controller.");
        }

        var folderPath = Path.Combine(_env.WebRootPath, "images");
        var filePath = Path.Combine(folderPath, filename);

        if (!System.IO.File.Exists(filePath))
        {
            throw new FileNotFoundException("Không tìm thấy ảnh", filePath);
        }

        var imageBytes = System.IO.File.ReadAllBytes(filePath);
        var contentType = GetContentType(filePath);

        return new FileContentResult(imageBytes, contentType);
    }
    public string GenerateImageUrl(string filename)
    {
        if (string.IsNullOrEmpty(filename))
            return null;

        // Nếu ảnh đã là URL đầy đủ (VD: Cloudinary hoặc CDN)
        if (filename.StartsWith("http", StringComparison.OrdinalIgnoreCase))
            return filename;

        return $"{_backendUrl}/api/Product/image/{filename}";
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
            "webp"=>"image/webp",
            _ => "application/octet-stream"
        };
    }
}
