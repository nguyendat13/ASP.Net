using Microsoft.AspNetCore.Mvc;

public interface IImageService
{
    FileResult GetImage(string filename);
}
