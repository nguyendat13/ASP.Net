using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace PhatDat_TH2.Model
{
    public class Order : BaseEntity
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.Now;
        public string CustomerName { get; set; }
        public int StatusOrderId { get; set; }
        [ForeignKey("StatusOrderId")]
        public StatusOrder StatusOrder { get; set; }

        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public int UserId { get; set; }
        public string? TransactionId { get; set; }
        public User User { get; set; }

        public ICollection<OrderDetail> OrderDetails { get; set; }
        public decimal TotalPrice { get; set; }

        public int MethodId { get; set; }
        public Method Method { get; set; }
    }


}
