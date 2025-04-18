namespace PhatDat_TH2.Model.Request
{
    public class UpdateCartItemRequest
    {
        public int UserId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }

    }
}
