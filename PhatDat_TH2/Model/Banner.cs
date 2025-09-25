using System.ComponentModel.DataAnnotations.Schema;

namespace PhatDat_TH2.Model
{
    [Table("Banners")]
    public class Banner : BaseEntity
    {
        public int Id { get; set; }
        public string ImageUrl { get; set; }
        public string Link { get; set; }
    }
}
