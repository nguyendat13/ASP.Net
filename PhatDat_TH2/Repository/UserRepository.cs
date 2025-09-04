using PhatDat_TH2.Data;
using PhatDat_TH2.Model; // Đảm bảo đúng namespace
using Microsoft.EntityFrameworkCore;
using PhatDat_TH2.Repository.IRepository;

namespace PhatDat_TH2.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<User> GetByIdAsync(string userId)
        {
            // Chuyển đổi userId sang int nếu kiểu Id là int
            int id = int.Parse(userId); // Nếu userId có thể là null, dùng TryParse thay vì Parse để tránh lỗi.

            return await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task UpdateAsync(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }
    }
}
