using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace PhatDat_TH2.Model
{
    public class Order : BaseEntity
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; }
        public string CustomerName { get; set; }
        // Khóa ngoại đến bảng StatusOrders
        public int StatusOrderId { get; set; }

        // Navigation property
        [ForeignKey("StatusOrderId")]
        public StatusOrder StatusOrder { get; set; }

        public string Email { get; set; }
        public int UserId { get; set; }

        public User User { get; set; }  // Liên kết đến bảng User

        // Mối quan hệ với OrderDetail
        public ICollection<OrderDetail> OrderDetails { get; set; }

        // Tổng giá trị đơn hàng
        public decimal TotalPrice { get; set; }

        // Thêm method
        public int MethodId { get; set; }
        public Method Method { get; set; }
    }


}
