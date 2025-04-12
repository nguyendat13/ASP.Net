using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace PhatDat_TH2.Model
{
    public class Product : BaseEntity
    {
        [Key]
        public int Id { get; set; }

        [Required, StringLength(255)]
        public string Name { get; set; }

        public string? Description { get; set; }

        [Range(0, double.MaxValue)]
        public decimal Price { get; set; }

        public string? Avatar { get; set; }

        // Mối quan hệ với Category
        public int CategoryId { get; set; }

        // Thêm trường Discount
        [Range(0, double.MaxValue)]
        public decimal Discount { get; set; }
    }
}
