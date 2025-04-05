namespace PhatDat_TH2.Model
{
    public class OrderDetail : BaseEntity
    {
        public int Id { get; set; }
        public int OrderId { get; set; }  // Khóa ngoại
        public int ProductId { get; set; } // Khóa ngoại
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}
