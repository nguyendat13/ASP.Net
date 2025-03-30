namespace PhatDat_TH2.Model
{
    public class Post
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime PublishedDate { get; set; } = DateTime.Now;
        public int TopicId { get; set; }
        public Topic Topic { get; set; }
    }
}
