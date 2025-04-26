using System.ComponentModel.DataAnnotations;

namespace PhatDat_TH2.Model
{
    public class ChatMessage
    {
        [Key]
        public int Id { get; set; }

        public int SenderId { get; set; }
        public int ReceiverId { get; set; }
        public string Message { get; set; }
        public DateTime SentAt { get; set; } = DateTime.Now;

        public User Sender { get; set; }
        public User Receiver { get; set; }
    }
}
