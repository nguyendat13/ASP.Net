using Microsoft.EntityFrameworkCore;
using PhatDat_TH2.Data;
using PhatDat_TH2.Model;
using PhatDat_TH2.Model.DTO;
using PhatDat_TH2.Services.Interfaces;

namespace PhatDat_TH2.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly AppDbContext _context;

        public CategoryService(AppDbContext context)
        {
            _context = context;
        }

        public IEnumerable<CategoryListDTO> GetAll()
        {
            return _context.Categories.Select(c => new CategoryListDTO
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description
            }).ToList();
        }

        public CategoryDetailDTO? GetById(int id)
        {
            return _context.Categories
                .Include(c => c.Products)
                .Where(c => c.Id == id)
                .Select(c => new CategoryDetailDTO
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description,
                    Products = c.Products.Select(p => new ProductListDTO
                    {
                        Id = p.Id,
                        Name = p.Name,
                        Description = p.Description,
                        Price = p.Price,
                        Avatar = p.Avatar,
                        Discount = p.Discount
                    }).ToList()
                })
                .FirstOrDefault();
        }

        public Category Create(CategoryDTO dto)
        {
            var category = new Category
            {
                Name = dto.Name,
                Description = dto.Description,
                CreatedAt = DateTime.Now,
                CreatedBy = "admin"
            };
            _context.Categories.Add(category);
            _context.SaveChanges();
            return category;
        }

        public Category? Update(int id, CategoryDTO dto)
        {
            var existing = _context.Categories.Find(id);
            if (existing == null) return null;

            existing.Name = dto.Name;
            existing.Description = dto.Description;
            _context.SaveChanges();
            return existing;
        }

        public bool Delete(int id)
        {
            var category = _context.Categories.Find(id);
            if (category == null) return false;
            _context.Categories.Remove(category);
            _context.SaveChanges();
            return true;
        }

        public IEnumerable<ProductListDTO> GetProductsByCategory(int categoryId)
        {
            return _context.Products
                .Where(p => p.CategoryId == categoryId)
                .Select(p => new ProductListDTO
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    Avatar = p.Avatar,
                    Discount = p.Discount
                })
                .ToList();
        }
    }
}
