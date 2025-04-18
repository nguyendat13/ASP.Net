namespace PhatDat_TH2.Model.DTO
{
    public class CartItemDTO
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal Discount { get; set; }

        public string Avatar { get; set; }
        public double Subtotal { get; set; }
    }
}
