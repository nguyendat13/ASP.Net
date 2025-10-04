using Microsoft.AspNetCore.Mvc;

public interface IImageService
{
    FileResult GetImage(string filename);
    string GenerateImageUrl(string filename);
}
