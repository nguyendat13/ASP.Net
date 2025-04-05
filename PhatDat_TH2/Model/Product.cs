using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace PhatDat_TH2.Model
{
    public class Product : BaseEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Name { get; set; }
        public int Price { get; set; }
        public string Avatar { get; set; }  // Nếu không bắt buộc, có thể thêm [Required] nếu cần
        public string Description { get; set; }  // Nếu không bắt buộc, có thể thêm [Required] nếu cần

        public int CategoryId { get; set; }
        public Category? Category { get; set; }
    }

}
