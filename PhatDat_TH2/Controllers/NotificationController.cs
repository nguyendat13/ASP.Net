using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PhatDat_TH2.Model;
using PhatDat_TH2.Services;
using PhatDat_TH2.Services.IServices;
using System.Threading.Tasks;

namespace PhatDat_TH2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserNotifications(int userId)
        {
            var notifications = await _notificationService.GetUserNotificationsAsync(userId);
            return Ok(notifications);
        }

        [HttpPut("read/{id}")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var notification = await _notificationService.MarkAsReadAsync(id);
            if (notification == null) return NotFound();
            return Ok(notification);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNoti(int id)
        {
            var delNoti = await _notificationService.DeleteNotificationAsync(id);
            if (!delNoti)
                return NotFound(new { message = "Không tìm thấy thông báo." });

            return Ok(new { message = "Đã xóa thông báo." });
        }
    }
}
