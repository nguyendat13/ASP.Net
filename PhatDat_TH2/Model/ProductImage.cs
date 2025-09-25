using System.Text.Json.Serialization;

namespace PhatDat_TH2.Model
{
    public class ProductImage :BaseEntity
    {
        public int Id { get; set; }
        public string ImageUrl { get; set; }

        // Khóa ngoại
        public int ProductId { get; set; }

        [JsonIgnore]
        public Product Product { get; set; }
    }
}
