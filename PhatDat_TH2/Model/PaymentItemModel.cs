namespace PhatDat_TH2.Model
{
    public class PaymentItemModel
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }   // thêm trường Price
        public decimal PriceAfterDiscount { get; set; } // nếu có giảm giá
    }
}
