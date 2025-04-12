namespace PhatDat_TH2.Model
{
    public class OrderUpdateDTO
    {
        public string CustomerName { get; set; }
        public string Status { get; set; }
        public List<OrderItemRequest> Items { get; set; }
    }
}
