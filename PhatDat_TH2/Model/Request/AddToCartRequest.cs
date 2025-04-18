namespace PhatDat_TH2.Model.Request
{
    // Model để nhận dữ liệu từ client
    public class AddToCartRequest
    {
        public int UserId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; } = 1;
    }

}
