using Microsoft.EntityFrameworkCore;
using PhatDat_TH2.Data;
using PhatDat_TH2.Model;
using PhatDat_TH2.Model.DTO;
using PhatDat_TH2.Model.Request;
using PhatDat_TH2.Services.IServices;

namespace PhatDat_TH2.Services
{
    public class ProductService : IProductService
    {
        private readonly AppDbContext _context;
        private readonly ICloudinaryService _cloudinaryService;
        private readonly IWebHostEnvironment _env;

        public ProductService(AppDbContext context, ICloudinaryService cloudinaryService, IWebHostEnvironment env)
        {
            _context = context;
            _cloudinaryService = cloudinaryService;
            _env = env;
        }

        public IEnumerable<ProductListDTO> GetAll()
        {
            return _context.Products
                .Include(p => p.Category)
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

        public ProductDetailDTO? GetById(int id)
        {
            return _context.Products
                .Include(p => p.Category)
                .Include(p => p.ProductImages)
                .Where(p => p.Id == id)
                .Select(p => new ProductDetailDTO
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    Avatar = p.Avatar,
                    Discount = p.Discount,
                    CategoryId = p.CategoryId,
                    CategoryName = p.Category.Name,
                    Images = p.ProductImages.Select(i => i.ImageUrl).ToList()
                })
                .FirstOrDefault();
        }

        public async Task<ProductDetailDTO> CreateAsync(ProductRequest request, IFormFile? image, bool useCloudinary)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == request.CategoryId);
            if (category == null) throw new Exception("Danh mục không tồn tại.");

            string? avatarPath = null;
            if (image != null)
            {
                avatarPath = useCloudinary
                    ? await _cloudinaryService.UploadImageAsync(image)
                    : await SaveImage(image);
            }

            var product = new Product
            {
                Name = request.Name,
                Description = request.Description,
                Price = request.Price,
                Discount = request.Discount,
                Avatar = avatarPath,
                CategoryId = request.CategoryId,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "admin"
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return new ProductDetailDTO
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Avatar = product.Avatar,
                Discount = product.Discount,
                CategoryId = product.CategoryId,
                CategoryName = category.Name
            };
        }

        public async Task<ProductDetailDTO?> UpdateAsync(int id, ProductRequest request, IFormFile? image, bool useCloudinary)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return null;

            var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == request.CategoryId);
            if (category == null) throw new Exception("Danh mục không tồn tại.");

            product.Name = request.Name;
            product.Description = request.Description;
            product.Price = request.Price;
            product.Discount = request.Discount;
            product.CategoryId = request.CategoryId;
            product.UpdatedAt = DateTime.UtcNow;
            product.UpdatedBy = "admin";

            if (image != null)
            {
                product.Avatar = useCloudinary
                    ? await _cloudinaryService.UploadImageAsync(image)
                    : await SaveImage(image);
            }

            await _context.SaveChangesAsync();

            return new ProductDetailDTO
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Avatar = product.Avatar,
                Discount = product.Discount,
                CategoryId = product.CategoryId,
                CategoryName = category.Name
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return false;

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return true;
        }

        public IEnumerable<ProductListDTO> GetNewProducts()
        {
            return _context.Products
                .OrderByDescending(p => p.CreatedAt)
                .Take(5)
                .Include(p => p.Category)
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

        public IEnumerable<TopSellingProductDTO> GetTopSellingProducts()
        {
            return _context.OrderDetails
                .GroupBy(oi => oi.ProductId)
                .Select(g => new { ProductId = g.Key, TotalSales = g.Sum(x => x.Quantity) })
                .OrderByDescending(x => x.TotalSales)
                .Take(5)
                .Join(_context.Products.Include(p => p.Category),
                      g => g.ProductId,
                      p => p.Id,
                      (g, p) => new TopSellingProductDTO
                      {
                          Id = p.Id,
                          Name = p.Name,
                          Price = p.Price,
                          Avatar = p.Avatar,
                          Discount = p.Discount,
                          CategoryId = p.CategoryId,
                          CategoryName = p.Category.Name,
                          TotalSales = g.TotalSales
                      })
                .ToList();
        }

        public IEnumerable<ProductListDTO> SearchProducts(string query)
        {
            return _context.Products
                .Where(p => p.Name.Contains(query) || (p.Description != null && p.Description.Contains(query)))
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

        public async Task<IEnumerable<ProductListDTO>> GetRelatedProducts(int productId)
        {
            var product = await _context.Products.FindAsync(productId);
            if (product == null) return Enumerable.Empty<ProductListDTO>();

            return _context.Products
                .Where(p => p.CategoryId == product.CategoryId && p.Id != productId)
                .Take(4)
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

        private async Task<string> SaveImage(IFormFile image)
        {
            var fileName = Guid.NewGuid() + Path.GetExtension(image.FileName);
            var folderPath = Path.Combine(_env.WebRootPath, "images");

            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            var filePath = Path.Combine(folderPath, fileName);
            using var stream = new FileStream(filePath, FileMode.Create);
            await image.CopyToAsync(stream);

            return fileName;
        }
    }
}
