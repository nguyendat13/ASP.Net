namespace PhatDat_TH2.Model
{
    public class Order : BaseEntity
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; }
        public string CustomerName { get; set; }
        public string Status { get; set; }

        public int UserId { get; set; }
        // Mối quan hệ với OrderDetail
        public ICollection<OrderDetail> OrderDetails { get; set; }

        // Tổng giá trị đơn hàng
        public decimal TotalPrice { get; set; }
    }
}
