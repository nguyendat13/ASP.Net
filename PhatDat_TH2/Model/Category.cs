using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PhatDat_TH2.Model
{
    public class Category : BaseEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        // Mối quan hệ One-to-Many với Product
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
