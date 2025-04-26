using PhatDat_TH2.Model;

public class Payment
{
    public int Id { get; set; }
    public string TransactionId { get; set; }      // Mã giao dịch từ VNPay
    public decimal Amount { get; set; }
    public string OrderInfo { get; set; }
    public string Status { get; set; }             // Success, Failed, Pending
    public DateTime PayDate { get; set; }            // yyyyMMddHHmmss
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public int MethodId { get; set; }
    public Method Method { get; set; }

    public int? OrderId { get; set; }
    public Order Order { get; set; }

    public int UserId { get; set; }
    public User User { get; set; }
}
