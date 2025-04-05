namespace PhatDat_TH2.Model
{
    public class Order : BaseEntity
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; }
        public string CustomerName { get; set; }
        public string Status { get; set; }
    }
}
