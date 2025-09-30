namespace PhatDat_TH2.Model.DTO
{
    public class PostCreateDTO
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime PublishedDate { get; set; }
        public string? ImageUrl { get; set; }
        public int TopicId { get; set; }
    }
}
