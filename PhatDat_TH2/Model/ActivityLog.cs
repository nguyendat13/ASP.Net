namespace PhatDat_TH2.Model
{
    public class ActivityLog
    {
        public int Id { get; set; }

        // có thể null nếu hành động hệ thống (cron, service)
        public int? UserId { get; set; }

        // Ví dụ: "CREATE_ORDER", "UPDATE_ORDER_STATUS", "UPDATE_PRODUCT"
        public string Action { get; set; }

        // Ví dụ: "Order", "Product", "User"
        public string EntityType { get; set; }

        // Id của entity nếu có
        public int? EntityId { get; set; }

        // JSON chi tiết (old/new values, request body, note...)
        public string Details { get; set; }

        public string IpAddress { get; set; }
        public string UserAgent { get; set; }

        public DateTimeOffset CreatedAt { get; set; } // ✅
    }
}
