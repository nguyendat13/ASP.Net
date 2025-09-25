using PhatDat_TH2.Model;
using PhatDat_TH2.Model.DTO;

namespace PhatDat_TH2.Services.Interfaces
{
    public interface ICategoryService
    {
        IEnumerable<CategoryListDTO> GetAll();
        CategoryDetailDTO? GetById(int id);
        Category Create(CategoryDTO dto);
        Category? Update(int id, CategoryDTO dto);
        bool Delete(int id);
        IEnumerable<ProductListDTO> GetProductsByCategory(int categoryId);
    }
}
