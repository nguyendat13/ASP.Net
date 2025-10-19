namespace PhatDat_TH2.Model.Request
{
    public class ProductFilterRequest
    {
        public int? CategoryId { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public string? SortBy { get; set; } // name_asc, name_desc, price_asc, price_desc
        public string? Search { get; set; }
    }
}
