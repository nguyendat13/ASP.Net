namespace PhatDat_TH2.Model.DTO
{
    public class PaymentRequestDto
    {
        public decimal Amount { get; set; }          // Tổng tiền
        public int MethodId { get; set; }            // Phương thức thanh toán (VNPAY, COD...)
        public int UserId { get; set; }              // Người dùng đặt
        public string CustomerName { get; set; }     // Tên khách hàng
        public string Email { get; set; }            // Email (bắt buộc nếu cột Email không cho phép null)
        public string Phone { get; set; }            // Số điện thoại (hay dùng khi thanh toán)
        public string Address { get; set; }          // Địa chỉ giao hàng
        public int StatusOrderId { get; set; } = 1;  // Trạng thái đơn (mặc định Pending = 1)
    }
}
