using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace PhatDat_TH2.Model
{
    public class OrderDetail
    {
        [Key]
        public int Id { get; set; }

        public int OrderId { get; set; }

        [JsonIgnore]
        public Order Order { get; set; }

        public int ProductId { get; set; }
        public Product Product { get; set; }
        public string ProductName { get; set; }  // Tên sản phẩm

        public int Quantity { get; set; } // Số lượng sản phẩm

        public decimal Price { get; set; } // Giá gốc của sản phẩm

        public decimal Discount { get; set; } // Giảm giá trên sản phẩm

        public decimal PriceSale { get; set; } // Giá sau giảm giá

        [NotMapped]
        public decimal TotalPrice => PriceSale * Quantity; // Tổng giá cho sản phẩm này
    }
}
