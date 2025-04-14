using System.ComponentModel.DataAnnotations;

namespace PhatDat_TH2.Model
{
    public class LoginModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
