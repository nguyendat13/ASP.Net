namespace PhatDat_TH2.Model
{
    public class BaseEntity
    {
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }

        public string CreatedBy { get; set; } = "System";
        public string? UpdatedBy { get; set; }
        public string? DeletedBy { get; set; }
    }
}
