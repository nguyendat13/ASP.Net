using PhatDat_TH2.Model;

namespace PhatDat_TH2.Repositories
{
    public interface IUserRepository
    {
        Task<User> GetByIdAsync(string userId);
        Task UpdateAsync(User user);


    }
}
