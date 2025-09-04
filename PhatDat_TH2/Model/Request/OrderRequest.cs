namespace PhatDat_TH2.Model.Request
{
    public class OrderRequest
    {
        public string CustomerName { get; set; }
        public int StatusOrderId { get; set; }
        public int MethodId { get; set; }
        public int UserId { get; set; }
        public string Address { get; set; }      // Địa chỉ giao hàng
        public string Phone { get; set; }        // Số điện thoại

        public List<OrderItemRequest> Items { get; set; } // Các sản phẩm trong đơn hàng
    }
}
