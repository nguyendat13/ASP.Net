namespace PhatDat_TH2.Model
{
    public class Topic : BaseEntity
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public ICollection<Post> Posts { get; set; } ;
    }
}
