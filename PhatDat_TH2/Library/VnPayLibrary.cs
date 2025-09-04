using PhatDat_TH2.Model;
using System.Net;
using System.Security.Cryptography;
using System.Text;

namespace PhatDat_TH2.Library
{
    public class VnPayLibrary
    {
        private readonly SortedList<string, string> _requestData = new();
        private readonly SortedList<string, string> _responseData = new();

        public void AddRequestData(string key, string value)
        {
            if (!string.IsNullOrEmpty(value)) _requestData.Add(key, value);
        }

        public void AddResponseData(string key, string value)
        {
            if (!string.IsNullOrEmpty(value)) _responseData.Add(key, value);
        }

        public string GetResponseData(string key) =>
            _responseData.TryGetValue(key, out var val) ? val : "";

        public string GetIpAddress(HttpContext context)
        {
            var ip = context.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";
            return ip;
        }

        public string CreateRequestUrl(string baseUrl, string hashSecret)
        {
            var data = new StringBuilder();
            foreach (var kv in _requestData) data.Append(WebUtility.UrlEncode(kv.Key) + "=" + WebUtility.UrlEncode(kv.Value) + "&");
            var query = data.ToString().TrimEnd('&');
            var secureHash = HmacSha512(hashSecret, query);
            return $"{baseUrl}?{query}&vnp_SecureHash={secureHash}";
        }

        public PaymentResponseModel GetFullResponseData(IQueryCollection query, string hashSecret)
        {
            foreach (var kv in query) if (kv.Key.StartsWith("vnp_")) AddResponseData(kv.Key, kv.Value);
            var vnpSecureHash = query["vnp_SecureHash"].ToString();
            var check = ValidateSignature(vnpSecureHash, hashSecret);

            var responseCode = GetResponseData("vnp_ResponseCode");
            var transactionStatus = GetResponseData("vnp_TransactionStatus");
            bool success = check && responseCode == "00" && transactionStatus == "00";

            return new PaymentResponseModel
            {
                Success = success,
                PaymentMethod = "VnPay",
                OrderDescription = GetResponseData("vnp_OrderInfo"),
                OrderId = GetResponseData("vnp_TxnRef"),
                PaymentId = GetResponseData("vnp_TransactionNo"),
                TransactionId = GetResponseData("vnp_TransactionNo"),
                Token = vnpSecureHash,
                VnPayResponseCode = responseCode
            };
        }

        private bool ValidateSignature(string inputHash, string secretKey)
        {
            var data = new StringBuilder();
            foreach (var kv in _responseData)
            {
                if (kv.Key == "vnp_SecureHash") continue; // bỏ qua SecureHash
                data.Append(WebUtility.UrlEncode(kv.Key) + "=" + WebUtility.UrlEncode(kv.Value) + "&");
            }
            if (data.Length > 0) data.Remove(data.Length - 1, 1); // bỏ ký tự & cuối cùng

            var computedHash = HmacSha512(secretKey, data.ToString());
            return string.Equals(computedHash, inputHash, StringComparison.InvariantCultureIgnoreCase);
        }


        private string HmacSha512(string key, string data)
        {
            using var hmac = new HMACSHA512(Encoding.UTF8.GetBytes(key));
            var hashBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(data));
            return string.Concat(hashBytes.Select(b => b.ToString("x2")));
        }
    }

}
