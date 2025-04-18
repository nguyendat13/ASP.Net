using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PhatDat_TH2.Model
{
    public class Cart :BaseEntity
    {
        [Key]
        public int CartId { get; set; }

        [Required]
        public int UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public User User { get; set; }

        public ICollection<CartItem> CartItems { get; set; }

    }
}
