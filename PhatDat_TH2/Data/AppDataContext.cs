using PhatDat_TH2.Model;
using Microsoft.EntityFrameworkCore;

namespace PhatDat_TH2.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<Product> Products { get; set; }
        //public DbSet<ProductImage> ProductImages { get; set; }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<StatusOrder> StatusOrders { get; set; } // Thêm DbSet cho StatusOrder

        public DbSet<OrderDetail> OrderDetails { get; set; }
        public DbSet<User> Users { get; set; }

        public DbSet<Contact> Contacts { get; set; }
        public DbSet<Topic> Topics { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<Menu> Menus { get; set; }
        public DbSet<Banner> Banners { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<Method> Methods { get; set; }
        public DbSet<Payment> Payments { get; set; } // KHÔNG phải Payment (sai cú pháp)
        public DbSet<ChatMessage> ChatMessages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<Payment>()
    .HasOne(p => p.Method)
    .WithMany()
    .HasForeignKey(p => p.MethodId);

            modelBuilder.Entity<Cart>()
        .HasIndex(c => c.UserId)
        .IsUnique(); // Đảm bảo mỗi User chỉ có 1 Cart

            modelBuilder.Entity<Order>()
    .HasMany(o => o.OrderDetails)
    .WithOne()
    .HasForeignKey(d => d.OrderId)
    .OnDelete(DeleteBehavior.Cascade); // Hoặc Restrict nếu không muốn xóa tự động

            modelBuilder.Entity<OrderDetail>()
       .HasOne(od => od.Order)
       .WithMany(o => o.OrderDetails)
       .HasForeignKey(od => od.OrderId)
       .OnDelete(DeleteBehavior.Restrict); // hoặc .Cascade nếu bạn muốn xoá Order sẽ xoá luôn OrderDetail

            modelBuilder.Entity<OrderDetail>()
    .HasOne(od => od.Product)
    .WithMany()
    .HasForeignKey(od => od.ProductId)
    .OnDelete(DeleteBehavior.Restrict); // hoặc .SetNull, .Cascade tùy ý

            base.OnModelCreating(modelBuilder);
            // Ràng buộc unique cho username và email
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<ChatMessage>()
       .HasOne(c => c.Sender)
       .WithMany()
       .HasForeignKey(c => c.SenderId)
       .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ChatMessage>()
                .HasOne(c => c.Receiver)
                .WithMany()
                .HasForeignKey(c => c.ReceiverId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<StatusOrder>().HasData(
    new StatusOrder { Id = 1, Name = "Đang xử lý" },
    new StatusOrder { Id = 2, Name = "Đang giao" },
    new StatusOrder { Id = 3, Name = "Đã giao" },
    new StatusOrder { Id = 4, Name = "Đã hủy" },
    new StatusOrder { Id = 5, Name = "Chờ xác nhận" },
    new StatusOrder { Id = 6, Name = "Hoàn trả" },
    new StatusOrder { Id = 7, Name = "Giao thất bại" }
);
            modelBuilder.Entity<Method>().HasData(
    new Method { Id = 1, Name = "Thanh toán khi nhận hàng" },
    new Method { Id = 2, Name = "Chuyển khoản ngân hàng" },
    new Method { Id = 3, Name = "Thanh toán ví điện tử" }
);

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
