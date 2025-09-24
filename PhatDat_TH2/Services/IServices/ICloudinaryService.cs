using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace PhatDat_TH2.Services.IServices
{
    public interface ICloudinaryService
    {
        Task<string> UploadImageAsync(IFormFile file);
    }
}
