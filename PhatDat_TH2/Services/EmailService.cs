using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using PhatDat_TH2.Library;
using PhatDat_TH2.Model;
using PhatDat_TH2.Services.IServices;
using System.Globalization;
public class EmailService : IEmailService
{
    private readonly EmailSettings _settings;
    private readonly IImageService _imageService;

    public EmailService(IOptions<EmailSettings> settings, IImageService imageService)
    {
        _settings = settings.Value;
        _imageService = imageService;
    }

    public async Task SendOrderConfirmationEmail(User user, Order order)
    {
        var email = new MimeMessage();
        email.From.Add(new MailboxAddress(_settings.SenderName, _settings.SenderEmail));
        email.To.Add(MailboxAddress.Parse(user.Email));
        email.Subject = $"Xác nhận đơn hàng #{order.Id}";


        var emailBody = $@"
<html>
<head>
  <style>
    body {{ font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; }}
    .container {{ max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1); }}
    .header {{ background-color: #ff5722; color: white; padding: 20px; text-align: center; }}
    .content {{ padding: 20px; }}
    table {{ width: 100%; border-collapse: collapse; margin-top: 15px; }}
    table th, table td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
    table th {{ background-color: #f8f8f8; }}
    table img {{ max-width: 60px; border-radius: 5px; }}
    .total {{ text-align: right; font-weight: bold; margin-top: 10px; }}
    .footer {{ background-color: #f8f8f8; text-align: center; padding: 10px; font-size: 12px; color: #888; }}
  </style>
</head>
<body>
  <div class='container'>
    <div class='header'>
      <h1>Xác nhận đơn hàng #{order.Id}</h1>
    </div>
    <div class='content'>
      <h2>Xin chào {user.Fullname},</h2>
      <p>Đơn hàng của bạn đã được tạo thành công. Dưới đây là thông tin chi tiết:</p>
      
      <h3>Chi tiết sản phẩm</h3>
      <table>
        <thead>
          <tr>
            <th>Ảnh</th>
            <th>Sản phẩm</th>
            <th>Số lượng</th>
            <th>Giá</th>
            <th>Giảm giá</th>
            <th>Thành tiền</th>
          </tr>
        </thead>
        <tbody>";

        foreach (var item in order.OrderDetails)
        {
            var imageUrl = _imageService.GenerateImageUrl(item.Product?.Avatar ?? "");
            var price = item.Price.ToString("C0", CultureInfo.GetCultureInfo("vi-VN")); // 25.000 ₫
            var total = item.TotalPrice.ToString("C0", CultureInfo.GetCultureInfo("vi-VN"));

            emailBody += $@"
              <tr>
                <td>";
            if (!string.IsNullOrEmpty(imageUrl))
                emailBody += $"<img src='{imageUrl}' alt='{item.ProductName}' />";
            else
                emailBody += "<span>Không có ảnh</span>";

            emailBody += $@"</td>
                <td>{item.ProductName}</td>
                <td>{item.Quantity}</td>
                    <td>{price}</td>
                <td>{item.Discount}%</td>
                <td>{total}</td>
              </tr>";
        }

        emailBody += $@"
        </tbody>
      </table>
      <p class='total'>Tổng cộng: {order.TotalPrice.ToString("C0", CultureInfo.GetCultureInfo("vi-VN"))}</p>
      <p>Cảm ơn bạn đã mua hàng tại Shop Phát Đạt!</p>
    </div>
    <div class='footer'>
      &copy; {DateTime.Now.Year} Shop Phát Đạt. Mọi thắc mắc xin liên hệ support@phatdatshop.com
    </div>
  </div>
</body>
</html>";

        var builder = new BodyBuilder { HtmlBody = emailBody };
        email.Body = builder.ToMessageBody();

        using var smtp = new SmtpClient();
        await smtp.ConnectAsync(_settings.SmtpServer, _settings.Port, SecureSocketOptions.StartTls);
        await smtp.AuthenticateAsync(_settings.SenderEmail, _settings.Password);
        await smtp.SendAsync(email);
        await smtp.DisconnectAsync(true);
    }
}
