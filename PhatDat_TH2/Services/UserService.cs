using PhatDat_TH2.Model;
using PhatDat_TH2.Services;  // Đảm bảo rằng đây là namespace chứa IUserService
using PhatDat_TH2.Repositories;  // Đảm bảo rằng đây là namespace chứa IUserRepository
using PhatDat_TH2.Data;  // Giả sử AppDbContext là nơi bạn lưu trữ dữ liệu

namespace PhatDat_TH2.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly AppDbContext _context;

        public UserService(IUserRepository userRepository, AppDbContext context)
        {
            _userRepository = userRepository;
            _context = context;

        }

        // Lấy thông tin người dùng theo ID
        public async Task<User> GetUserByIdAsync(string userId)
        {
            return await _userRepository.GetByIdAsync(userId);
        }

        // Cập nhật trạng thái người dùng
        public async Task UpdateUserStatus(string userId, string status)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user != null)
            {
                user.Status = true;  // Ví dụ: "Has New Message"
                await _userRepository.UpdateAsync(user);
            }
        }

        // Lấy tên người dùng theo userId
        public async Task<string> GetUserNameById(long userId)
        {
            var user = await _context.Users.FindAsync(userId);
            return user?.Fullname ?? "Unknown User"; // Trả về tên người dùng hoặc "Unknown User" nếu không tìm thấy
        }
    }

}
