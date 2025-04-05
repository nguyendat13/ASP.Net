using PhatDat_TH2.Model;
using Microsoft.EntityFrameworkCore;
using PhatDat_TH2.Models;

namespace PhatDat_TH2.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }

        public DbSet<Brand> Brands { get; set; }
        public DbSet<Contact> Contacts { get; set; }
        public DbSet<Topic> Topics { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<Menu> Menus { get; set; }
        public DbSet<Banner> Banners { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Duyệt qua tất cả các entity và cấu hình các thuộc tính decimal
            foreach (var entity in modelBuilder.Model.GetEntityTypes())
            {
                foreach (var property in entity.GetProperties())
                {
                    // Kiểm tra nếu thuộc tính có kiểu decimal
                    if (property.ClrType == typeof(decimal) || property.ClrType == typeof(decimal?))
                    {
                        // Cấu hình decimal(18, 2) cho tất cả các thuộc tính decimal
                        property.SetColumnType("decimal(18,2)");
                    }
                }
            }
        }

    }


}
