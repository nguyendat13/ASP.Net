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
                    Discount = p.Discount,
                    CategoryName=p.Category.Name
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
            try
            {
                // ✅ Kiểm tra danh mục tồn tại
                var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == request.CategoryId);
                if (category == null)
                    throw new Exception("Danh mục không tồn tại.");

                // ✅ Kiểm tra trùng tên sản phẩm (không phân biệt hoa/thường)
                var isDuplicate = await _context.Products
                    .AnyAsync(p => p.Name.ToLower().Trim() == request.Name.ToLower().Trim());
                if (isDuplicate)
                    throw new Exception("Tên sản phẩm đã tồn tại! Vui lòng thử tên khác...");

                // ✅ Upload ảnh (nếu có)
                string? avatarPath = null;
                if (image != null)
                {
                    avatarPath = useCloudinary
                        ? await _cloudinaryService.UploadImageAsync(image)
                        : await SaveImage(image);
                }

                // ✅ Tạo sản phẩm mới
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

                // ✅ Trả DTO sau khi tạo
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
            catch (Exception ex)
            {
                // ✅ Ném lại exception có message gốc để controller bắt và trả BadRequest
                throw new Exception(ex.Message);
            }
        }

        public async Task<ProductDetailDTO?> UpdateAsync(int id, ProductRequest request, IFormFile? image, bool useCloudinary)
        {
            try { 
            var product = await _context.Products.FindAsync(id);
            if (product == null) return null;
            var proName = await _context.Products.AnyAsync(p => p.Name.ToLower() == request.Name.ToLower() && p.Id != id);
            if (proName) throw new Exception("Tên sản phẩm đã tồn tại! Vui lòng thử tên khác...");
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
            catch (Exception ex)
            {
                // ✅ Ném lại exception có message gốc để controller bắt và trả BadRequest
                throw new Exception(ex.Message);
            }
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

        public IEnumerable<ProductListDTO> GetFilteredProducts(ProductFilterRequest filter)
        {
            var query = _context.Products
                .Include(p => p.Category)
                .AsQueryable();

            // 🔍 Lọc theo danh mục
            if (filter.CategoryId.HasValue)
            {
                query = query.Where(p => p.CategoryId == filter.CategoryId);
            }

            // 💰 Lọc theo khoảng giá
            if (filter.MinPrice.HasValue)
            {
                query = query.Where(p => p.Price >= filter.MinPrice.Value);
            }
            if (filter.MaxPrice.HasValue)
            {
                query = query.Where(p => p.Price <= filter.MaxPrice.Value);
            }

            // 🔎 Tìm kiếm theo tên hoặc mô tả
            if (!string.IsNullOrEmpty(filter.Search))
            {
                query = query.Where(p =>
                    p.Name.ToLower().Contains(filter.Search.ToLower()) ||
                    (p.Description != null && p.Description.ToLower().Contains(filter.Search.ToLower()))
                );
            }

            // 📊 Sắp xếp
            switch (filter.SortBy?.ToLower())
            {
                case "price_asc":
                    query = query.OrderBy(p => p.Price);
                    break;
                case "price_desc":
                    query = query.OrderByDescending(p => p.Price);
                    break;
                case "name_asc":
                    query = query.OrderBy(p => p.Name);
                    break;
                case "name_desc":
                    query = query.OrderByDescending(p => p.Name);
                    break;
                default:
                    query = query.OrderByDescending(p => p.CreatedAt); // mặc định mới nhất
                    break;
            }

            return query.Select(p => new ProductListDTO
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                Avatar = p.Avatar,
                Discount = p.Discount
            }).ToList();
        }

    }
}
