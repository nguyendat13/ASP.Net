namespace PhatDat_TH2.Model.DTO
{
    public class PostDTO
    {
     
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime PublishedDate { get; set; }
        public int TopicId { get; set; }
        public string TopicName { get; set; }  // Cung cấp tên Topic thay vì chỉ ID
    }
}
