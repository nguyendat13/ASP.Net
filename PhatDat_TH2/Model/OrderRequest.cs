namespace PhatDat_TH2.Model
{
    public class OrderRequest
    {
        public string CustomerName { get; set; }
        public string Status { get; set; }
        public int UserId { get; set; }
        public List<OrderItemRequest> Items { get; set; } // Các sản phẩm trong đơn hàng
    }
}
