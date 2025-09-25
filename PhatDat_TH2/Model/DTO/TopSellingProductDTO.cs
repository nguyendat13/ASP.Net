namespace PhatDat_TH2.Model.DTO
{
    public class TopSellingProductDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public string? Avatar { get; set; }
        public decimal Discount { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;

        // Tổng số lượng bán (theo kiểu Quantity trong OrderDetails)
        public int TotalSales { get; set; }
    }
}
