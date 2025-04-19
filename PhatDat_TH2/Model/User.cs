using System.ComponentModel.DataAnnotations;

namespace PhatDat_TH2.Model
{
    public class User : BaseEntity
    {
        [Key]
        public int Id { get; set; }
        public string Fullname { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public string Phone { get; set; }
        public string Gender { get; set; }
        public bool Status { get; set; } = true;
    }
}
