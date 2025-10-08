namespace PhatDat_TH2.Model.Request
{
    public class RemoveMultipleCartItemsRequest
    {
        public int UserId { get; set; }
        public List<int> ProductIds { get; set; } = new List<int>();
    }
}
