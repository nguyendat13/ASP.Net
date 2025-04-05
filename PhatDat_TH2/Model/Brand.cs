using PhatDat_TH2.Model;

namespace PhatDat_TH2.Models
{
    public class Brand : BaseEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }
}
