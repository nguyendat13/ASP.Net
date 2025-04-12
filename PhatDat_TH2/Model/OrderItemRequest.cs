namespace PhatDat_TH2.Model
{
    public class OrderItemRequest
    {
        public int ProductId { get; set; } // ID của sản phẩm trong đơn hàng
        public int Quantity { get; set; } // Số lượng sản phẩm yêu cầu
    }
}
