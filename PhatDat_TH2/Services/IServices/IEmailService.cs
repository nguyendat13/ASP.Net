using PhatDat_TH2.Model;

namespace PhatDat_TH2.Services.IServices
{
    public interface IEmailService
    {
        Task SendOrderConfirmationEmail(User user, Order order);
    }
}
