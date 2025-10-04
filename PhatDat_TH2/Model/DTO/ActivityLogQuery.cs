namespace PhatDat_TH2.Model.DTO
{
    public class ActivityLogQuery
    {
        public int? UserId { get; set; }
        public string? EntityType { get; set; }
        public string? Action { get; set; }
        public DateTime? From { get; set; }
        public DateTime? To { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 25;
    }
}
