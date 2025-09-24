using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using PhatDat_TH2.Data;
using PhatDat_TH2.Model;
using PhatDat_TH2.Model.DTO;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Mail;
using System.Security.Claims;
using System.Text;

namespace PhatDat_TH2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public UserController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // Đăng nhập - không yêu cầu xác thực
        [AllowAnonymous]
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginModel loginModel)
        {
            if (loginModel == null)
                return BadRequest(new { message = "Request body không hợp lệ" });
            if (loginModel == null || string.IsNullOrWhiteSpace(loginModel.Email) || string.IsNullOrWhiteSpace(loginModel.Password))
                return BadRequest(new { message = "Email và mật khẩu không được để trống." });

            var user = _context.Users.FirstOrDefault(u => u.Email == loginModel.Email && u.Password == loginModel.Password);
            if (user == null)
                return Unauthorized(new { message = "Tài khoản hoặc mật khẩu không đúng." });

            // Tạo claims cho token
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Email),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role.ToLower()) // đảm bảo khớp với role trong [Authorize]
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: creds
            );

            return Ok(new
            {
                userId= user.Id,
                email = user.Email,     // Trả về email
                password = user.Password,  // Trả về mật khẩu (nên xem xét không trả mật khẩu ra frontend vì lý do bảo mật)
                role = user.Role,      // Trả về role
                token = new JwtSecurityTokenHandler().WriteToken(token)
            });
        }

        // Lấy tất cả user (chỉ cần xác thực)
      
        
        [Authorize(Roles = "admin")]
        [HttpGet]
        public IActionResult GetUsers()
        {
            var users = _context.Users.ToList();
            return Ok(users);
        }

        [Authorize]
        [HttpGet("{id}")]
        public IActionResult GetUser(int id)
        {
            // Lấy người dùng từ cơ sở dữ liệu
            var user = _context.Users.Find(id);

            // Kiểm tra nếu người dùng không tồn tại
            if (user == null)
                return NotFound();

            return Ok(user);
        }



        // Tạo user mới (cho phép không xác thực để đăng ký)
        [AllowAnonymous]
        [HttpPost]
        public IActionResult Create([FromBody] User user)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            // Kiểm tra cả Username và Email
            var isUsernameExist = _context.Users.Any(u => u.Username == user.Username);
            var isEmailExist = _context.Users.Any(u => u.Email == user.Email);

            if (isUsernameExist && isEmailExist)
                return Conflict(new { message = "Username và Email đã tồn tại." });

            if (isUsernameExist)
                return Conflict(new { message = "Username đã tồn tại." });

            if (isEmailExist)
                return Conflict(new { message = "Email đã tồn tại." });

            user.CreatedAt = DateTime.Now;
            user.CreatedBy = "admin"; // bạn có thể sửa lại từ token nếu cần

            _context.Users.Add(user);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }

       
        // Cập nhật user (yêu cầu role admin) 
        [Authorize(Roles = "admin")]
        [HttpPut("{id}")]
        public IActionResult Edit(int id, [FromBody] User user)
        {
            var existing = _context.Users.Find(id);
            if (existing == null) return NotFound();

            if (_context.Users.Any(u => u.Username == user.Username && u.Id != id))
                return Conflict(new { message = "Username đã tồn tại." });

            if (_context.Users.Any(u => u.Email == user.Email && u.Id != id))
                return Conflict(new { message = "Email đã tồn tại." });

            // Cập nhật thông tin user
            existing.Fullname = user.Fullname;
            existing.Email = user.Email;
            existing.Username = user.Username;
            existing.Phone = user.Phone;
            existing.Gender = user.Gender;

            existing.Password = user.Password;
            existing.Role = user.Role;
            existing.Status = user.Status;
            existing.UpdatedAt = DateTime.Now;
            existing.UpdatedBy = "admin"; // hoặc lấy từ User.Identity.Name

            _context.SaveChanges();
            return Ok(existing);
        }

        // Xóa user (yêu cầu role admin)
        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound();

            _context.Users.Remove(user);
            _context.SaveChanges();

            return NoContent();
        }

            [AllowAnonymous]
            [HttpPost("register")]
            public IActionResult Register([FromBody] UserRegisterDTO dto)
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var isUsernameExist = _context.Users.Any(u => u.Username == dto.Username);
                var isEmailExist = _context.Users.Any(u => u.Email == dto.Email);

                if (isUsernameExist && isEmailExist)
                    return Conflict(new { message = "Username và Email đã tồn tại." });

                if (isUsernameExist)
                    return Conflict(new { message = "Username đã tồn tại." });

                if (isEmailExist)
                    return Conflict(new { message = "Email đã tồn tại." });

                var user = new User
                {
                    Fullname = dto.Fullname,
                    Username = dto.Username,
                    Email = dto.Email,
                    Password = dto.Password,
                    Phone = dto.Phone,
                    Gender = dto.Gender,
                    Role = "user", // ✅ gán mặc định là user
                    CreatedAt = DateTime.Now,
                    CreatedBy = "system"
                };

                _context.Users.Add(user);
                _context.SaveChanges();

                return Ok(new { message = "Đăng ký thành công!", userId = user.Id });
            }


        // Cập nhật thông tin cá nhân (user tự cập nhật)
        [Authorize]
        [HttpPut("update-profile/{id}")]
        public IActionResult UpdateProfile(int id, [FromBody] UserUpdateDTO dto)
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound();

            // Kiểm tra email trùng với user khác
            if (!string.IsNullOrWhiteSpace(dto.Email) && _context.Users.Any(u => u.Email == dto.Email && u.Id != id))
                return Conflict(new { message = "Email đã tồn tại." });

            // Kiểm tra username trùng với user khác
            if (!string.IsNullOrWhiteSpace(dto.Username) && _context.Users.Any(u => u.Username == dto.Username && u.Id != id))
                return Conflict(new { message = "Username đã tồn tại." });

            // Cập nhật từng trường nếu có dữ liệu mới
            if (!string.IsNullOrWhiteSpace(dto.Fullname)) user.Fullname = dto.Fullname;
            if (!string.IsNullOrWhiteSpace(dto.Email)) user.Email = dto.Email;
            if (!string.IsNullOrWhiteSpace(dto.Phone)) user.Phone = dto.Phone;
            if (!string.IsNullOrWhiteSpace(dto.Gender)) user.Gender = dto.Gender;
            if (!string.IsNullOrWhiteSpace(dto.Username)) user.Username = dto.Username;

            user.UpdatedAt = DateTime.Now;
            user.UpdatedBy = User.Identity?.Name ?? "system";

            _context.SaveChanges();
            return Ok(user);
        }

        // Đổi mật khẩu
        [Authorize]
        [HttpPut("change-password/{id}")]
        public IActionResult ChangePassword(int id, [FromBody] ChangePasswordDTO dto)
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound(new { message = "Không tìm thấy người dùng" });

            var userIdFromToken = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var userRole = User.FindFirst(ClaimTypes.Role).Value;

            if (userIdFromToken != user.Id && userRole != "admin")
                return Forbid();

            if (user.Password != dto.OldPassword)
                return BadRequest(new { message = "Mật khẩu cũ không chính xác." });

            user.Password = dto.NewPassword;
            user.UpdatedAt = DateTime.Now;
            user.UpdatedBy = User.Identity.Name ?? "system";

            _context.SaveChanges();

            return Ok(new { message = "Đổi mật khẩu thành công!" });
        }

        [AllowAnonymous]
        [HttpPost("forgot-password")]
        public IActionResult ForgotPassword([FromBody] ForgotPasswordDTO dto)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == dto.Email);
            if (user == null)
                return NotFound(new { message = "Email không tồn tại" });

            // Tạo mật khẩu mới tạm thời
            var tempPassword = Path.GetRandomFileName().Replace(".", "").Substring(0, 8); // 8 ký tự
            user.Password = tempPassword; // hoặc hash nếu dùng hash
            user.UpdatedAt = DateTime.Now;
            user.UpdatedBy = "system";

            _context.SaveChanges();

            // Gửi email
            try
            {
                var emailBody = $@"
            <p>Xin chào {user.Fullname},</p>
            <p>Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>
            <p><strong>Mật khẩu tạm thời:</strong> {tempPassword}</p>
            <p>Vui lòng đăng nhập và đổi mật khẩu ngay lập tức để bảo mật tài khoản của bạn.</p>
            <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
            <p>Trân trọng,<br/>Đội ngũ quản trị</p>
        ";
                SendEmail(user.Email, "Yêu cầu đặt lại mật khẩu", emailBody);
                return Ok(new { message = "Mật khẩu mới đã được gửi vào email của bạn." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Gửi email thất bại", error = ex.Message });
            }
        }

        private void SendEmail(string toEmail, string subject, string body)
        {
            var smtpClient = new SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                Credentials = new System.Net.NetworkCredential("dalrest2210@gmail.com", "dusb svrt rvrb ydyj"),
                EnableSsl = true,
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress("dalrest2210@gmail.com", "Phát Đạt Store"),
                Subject = subject,
                Body = body,
                IsBodyHtml = true, // HTML để format đẹp
            };
            mailMessage.To.Add(toEmail);

            smtpClient.Send(mailMessage);
        }

    }
}
