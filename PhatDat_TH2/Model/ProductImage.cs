namespace PhatDat_TH2.Model
{
    public class ProductImage :BaseEntity
    {
        public int Id { get; set; }
        public string ImageUrl { get; set; }

        // Khóa ngoại
        public int ProductId { get; set; }
        //public Product Product { get; set; }
    }
}
