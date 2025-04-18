using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PhatDat_TH2.Model
{
    public class CartItem :BaseEntity
    {
        [Key]
        public int CartItemId { get; set; }

        [Required]
        public int CartId { get; set; }

        public Cart Cart { get; set; }

        [Required]
        public int ProductId { get; set; }

        public Product Product { get; set; }

        public int Quantity { get; set; }
        public decimal PriceAtTime { get; set; }
    }
}
