using PhatDat_TH2.Model;
using PhatDat_TH2.Data;  // Giả sử AppDbContext là nơi bạn lưu trữ dữ liệu
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace PhatDat_TH2.Services
{
    public class ChatService
    {
        private readonly AppDbContext _context;

        public ChatService(AppDbContext context)
        {
            _context = context;
        }

        // Lưu tin nhắn
        public async Task SaveMessageAsync(int senderId, int receiverId, string messageContent)
        {
            var message = new ChatMessage
            {
                SenderId = senderId,
                ReceiverId = receiverId,
                Message = messageContent,
                SentAt = DateTime.Now
            };

            _context.ChatMessages.Add(message);
            await _context.SaveChangesAsync();
        }

        // Lấy tin nhắn giữa User và Admin
        public async Task<List<ChatMessage>> GetMessagesAsync(int userId)
        {
            // Giả sử admin có ID = 1
            int adminId = 1;

            return await _context.ChatMessages
                                 .Where(m => (m.SenderId == userId && m.ReceiverId == adminId) ||
                                             (m.SenderId == adminId && m.ReceiverId == userId))
                                 .OrderBy(m => m.SentAt)
                                 .ToListAsync();
        }


        public async Task<List<ChatMessage>> GetMessages(int senderId, int receiverId)
        {
            // Logic lấy tin nhắn giữa senderId và receiverId
            return await _context.ChatMessages
                                   .Where(m => (m.SenderId == senderId && m.ReceiverId == receiverId) ||
                                               (m.SenderId == receiverId && m.ReceiverId == senderId))
                                   .ToListAsync();
        }
    }
}
