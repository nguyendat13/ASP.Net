using Microsoft.Extensions.Configuration;
using PhatDat_TH2.Library;
using PhatDat_TH2.Model;
using PhatDat_TH2.Services;
using PhatDat_TH2.Services.IServices;
using System.Security.Cryptography;
using System.Text;

public class VnPayService : IVnPayService
{
    private readonly IConfiguration _config;

    public VnPayService(IConfiguration config) => _config = config;

    public string CreatePaymentUrl(PaymentInformationModel model, HttpContext context)
    {
        // TimeZone fallback
        TimeZoneInfo tz;
        try
        {
            tz = TimeZoneInfo.FindSystemTimeZoneById(_config["TimeZoneId"] ?? "SE Asia Standard Time");
        }
        catch
        {
            tz = TimeZoneInfo.Local;
        }

        var now = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, tz);
        var txnRef = model.OrderId ?? DateTimeOffset.UtcNow.ToUnixTimeMilliseconds().ToString();

        var pay = new VnPayLibrary();
        pay.AddRequestData("vnp_Version", _config["Vnpay:Version"]);
        pay.AddRequestData("vnp_Command", _config["Vnpay:Command"]);
        pay.AddRequestData("vnp_TmnCode", _config["Vnpay:TmnCode"]);
        pay.AddRequestData("vnp_Amount", ((long)model.Amount * 1000).ToString());
        pay.AddRequestData("vnp_CreateDate", now.ToString("yyyyMMddHHmmss"));
        pay.AddRequestData("vnp_CurrCode", _config["Vnpay:CurrCode"]);
        pay.AddRequestData("vnp_IpAddr", pay.GetIpAddress(context));
        pay.AddRequestData("vnp_Locale", _config["Vnpay:Locale"]);
        pay.AddRequestData("vnp_OrderInfo", $"{model.Name} - {model.OrderDescription}");
        pay.AddRequestData("vnp_OrderType", model.OrderType);
        pay.AddRequestData("vnp_ReturnUrl", _config["Vnpay:ReturnUrl"]);
        pay.AddRequestData("vnp_TxnRef", txnRef);

        return pay.CreateRequestUrl(_config["Vnpay:BaseUrl"], _config["Vnpay:HashSecret"]);
    }

    public PaymentResponseModel PaymentExecute(IQueryCollection collections)
    {
        var pay = new VnPayLibrary();
        return pay.GetFullResponseData(collections, _config["Vnpay:HashSecret"]);
    }
}