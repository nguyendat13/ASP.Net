using PhatDat_TH2.Model;

namespace PhatDat_TH2.Services.IServices
{
    public interface INotificationService
    {
        Task<List<Notification>> GetUserNotificationsAsync(int userId);
        Task<Notification> MarkAsReadAsync(int id);
        Task<Notification> CreateNotificationAsync(Notification notification);
        Task<bool> DeleteNotificationAsync(int id);
    }
}
