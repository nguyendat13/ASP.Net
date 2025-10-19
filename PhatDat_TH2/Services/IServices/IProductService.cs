using PhatDat_TH2.Model.DTO;
using PhatDat_TH2.Model.Request;

namespace PhatDat_TH2.Services.IServices
{
    public interface IProductService
    {
        IEnumerable<ProductListDTO> GetAll();
        ProductDetailDTO? GetById(int id);
        Task<ProductDetailDTO> CreateAsync(ProductRequest request, IFormFile? image, bool useCloudinary);
        Task<ProductDetailDTO?> UpdateAsync(int id, ProductRequest request, IFormFile? image, bool useCloudinary);
        Task<bool> DeleteAsync(int id);

        IEnumerable<ProductListDTO> GetNewProducts();
        IEnumerable<TopSellingProductDTO> GetTopSellingProducts();
        IEnumerable<ProductListDTO> SearchProducts(string query);
        Task<IEnumerable<ProductListDTO>> GetRelatedProducts(int productId);

        IEnumerable<ProductListDTO> GetFilteredProducts(ProductFilterRequest filter);
    }
}
