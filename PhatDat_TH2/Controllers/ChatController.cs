using Microsoft.AspNetCore.Mvc;
using PhatDat_TH2.Services;

namespace PhatDat_TH2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly ChatService _chatService;
        private readonly IUserService _userService;

        public ChatController(ChatService chatService, IUserService userService)
        {
            _chatService = chatService;
            _userService = userService;  // Khởi tạo _userService qua constructor

        }

        // Gửi tin nhắn
        [HttpPost("sendMessage")]
        public async Task<IActionResult> SendMessage([FromBody] SendMessageRequest request)
        {
            if (request == null || request.SenderId <= 0 || request.ReceiverId <= 0 || string.IsNullOrEmpty(request.Message))
            {
                return BadRequest("Invalid message parameters.");
            }

            try
            {
                // Lưu tin nhắn vào cơ sở dữ liệu
                await _chatService.SaveMessageAsync(request.SenderId, request.ReceiverId, request.Message);
                return Ok("Message sent successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while sending the message: " + ex.Message);
            }
        }

        // Lấy tất cả tin nhắn giữa User và Admin
        [HttpGet("getMessages/{userId}")]
        public async Task<IActionResult> GetMessages(int userId)
        {
            try
            {
                var messages = await _chatService.GetMessagesAsync(userId);
                return Ok(messages);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while fetching messages: " + ex.Message);
            }
        }

        // Đảm bảo bạn có phương thức GET với route chính xác
        [HttpGet("getMessages/{senderId}/{receiverId}")]
        public async Task<IActionResult> GetMessages(int senderId, int receiverId)
        {
            var messages = await _chatService.GetMessages(senderId, receiverId);
            if (messages == null)
            {
                return NotFound();
            }
            return Ok(messages);
        }

        // API để lấy tên người dùng từ senderId và receiverId
        [HttpGet("getUserNames/{senderId},{receiverId}")]
        public async Task<ActionResult<Dictionary<long, string>>> GetUserNames(long senderId, long receiverId)
        {
            var userNames = new Dictionary<long, string>
        {
            { senderId, await _userService.GetUserNameById(senderId) },
            { receiverId, await _userService.GetUserNameById(receiverId) }
        };

            return Ok(userNames);
        }
    }

    public class SendMessageRequest
    {
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }
        public string Message { get; set; }
    }
}
