using System.ComponentModel.DataAnnotations.Schema;

namespace PhatDat_TH2.Model
{
    public class Notification
    {
        public int Id { get; set; }
        public int UserId { get; set; } // Người nhận
        public int OrderId { get; set; }
        public string Message { get; set; } // Nội dung thông báo
        public bool IsRead { get; set; } = false; // Đã đọc hay chưa
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        [ForeignKey("UserId")]
        public User User { get; set; }
    }
}
