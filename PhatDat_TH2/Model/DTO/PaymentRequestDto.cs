namespace PhatDat_TH2.Model.DTO
{
    public class PaymentRequestDto
    {
        public decimal Amount { get; set; }
        public int MethodId { get; set; }
        public int UserId { get; set; }
    }
}
