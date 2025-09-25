namespace PhatDat_TH2.Model.DTO
{
    public class ProductDetailDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public string? Avatar { get; set; }
        public decimal Discount { get; set; }

        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = "";

        public List<string> Images { get; set; } = new();
    }
}
