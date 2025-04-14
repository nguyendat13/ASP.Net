namespace PhatDat_TH2.Model.DTO
{
    public class CategoryDetailDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public List<ProductListDTO> Products { get; set; } = new List<ProductListDTO>(); // Danh sách sản phẩm
    }

}
