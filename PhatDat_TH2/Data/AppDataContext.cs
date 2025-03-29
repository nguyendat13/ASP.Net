using PhatDat_TH2.Model;
using Microsoft.EntityFrameworkCore;

namespace PhatDat_TH2.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }

    }
}
