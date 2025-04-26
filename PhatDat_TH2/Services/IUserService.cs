using PhatDat_TH2.Model;

namespace PhatDat_TH2.Services
{
    public interface IUserService
    {
        Task<User> GetUserByIdAsync(string userId);
        Task UpdateUserStatus(string userId, string status);
        Task<string> GetUserNameById(long userId);

    }
}
