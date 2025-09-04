namespace PhatDat_TH2.Model
{
    public class PaymentInformationModel
    {
        public string OrderId { get; set; }
        public string OrderType { get; set; }
        public double Amount { get; set; }
        public string OrderDescription { get; set; }
        public string Name { get; set; }
        public int UserId { get; set; }
        public string Address { get; set; }      // Địa chỉ giao hàng
        public string Email { get; set; }
        public string Phone { get; set; }
        public int MethodId { get; set; }
          public List<PaymentItemModel> Items { get; set; }
}
    }
