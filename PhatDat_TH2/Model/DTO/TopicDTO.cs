namespace PhatDat_TH2.Model.DTO
{
    public class TopicDTO
    {
        public int Id { get; set; }

        public string Title { get; set; }
        public string Description { get; set; }
        public ICollection<PostDTO>? Posts { get; set; } // Cho phép null

    }
}
