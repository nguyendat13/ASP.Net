using System.ComponentModel.DataAnnotations;

namespace PhatDat_TH2.Model
{
    public class ProductRequest
    {
        [Key]
        public int Id { get; set; }


        [Required, StringLength(255)]
        public string Name { get; set; }

        public string? Description { get; set; }

        [Range(0, double.MaxValue)]
        public decimal Price { get; set; }

        public string? Avatar { get; set; }

        [Range(0, double.MaxValue)]
        public decimal Discount { get; set; }

        [Required]
        public int CategoryId { get; set; }
    }

}
