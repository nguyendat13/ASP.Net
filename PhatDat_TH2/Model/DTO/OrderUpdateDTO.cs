using PhatDat_TH2.Model.Request;

namespace PhatDat_TH2.Model.DTO
{
    public class OrderUpdateDTO
    {
        public string CustomerName { get; set; }
        public int StatusOrderId { get; set; } // sửa từ string Status → int StatusOrderId
        public List<OrderItemRequest> Items { get; set; }
    }
}
