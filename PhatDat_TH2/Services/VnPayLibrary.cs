using System.Security.Cryptography;
using System.Text;

public class VnPayLibrary
{
    private SortedList<string, string> requestData = new SortedList<string, string>();
    private SortedList<string, string> responseData = new SortedList<string, string>();

    public void AddRequestData(string key, string value)
    {
        if (!string.IsNullOrEmpty(value))
        {
            requestData.Add(key, value);
        }
    }

    public void AddResponseData(string key, string value)
    {
        if (!string.IsNullOrEmpty(value))
        {
            responseData.Add(key, value);
        }
    }

    public string GetResponseData(string key)
    {
        return responseData.ContainsKey(key) ? responseData[key] : null;
    }

    public bool ValidateSignature(string hashSecret)
    {
        if (!responseData.ContainsKey("vnp_SecureHash"))
            return false;

        string secureHash = responseData["vnp_SecureHash"];
        responseData.Remove("vnp_SecureHash");

        var rawData = new StringBuilder();
        foreach (var kv in responseData)
        {
            if (!string.IsNullOrEmpty(kv.Value))
            {
                rawData.Append($"{kv.Key}={kv.Value}&");
            }
        }
        if (rawData.Length > 0) rawData.Length -= 1;

        var checkHash = HmacSHA512(hashSecret, rawData.ToString());
        return secureHash.Equals(checkHash, StringComparison.InvariantCultureIgnoreCase);
    }

    public string CreateRequestUrl(string baseUrl, string hashSecret)
    {
        var data = new StringBuilder();
        var query = new StringBuilder();

        foreach (var kv in requestData)
        {
            data.Append($"{kv.Key}={kv.Value}&");
            query.Append($"{kv.Key}={Uri.EscapeDataString(kv.Value)}&");
        }

        data.Length -= 1;
        query.Length -= 1;

        var signData = HmacSHA512(hashSecret, data.ToString());
        return $"{baseUrl}?{query}&vnp_SecureHash={signData}";
    }

    public static string HmacSHA512(string key, string inputData)
    {
        var keyBytes = Encoding.UTF8.GetBytes(key);
        var inputBytes = Encoding.UTF8.GetBytes(inputData);
        using (var hmac = new HMACSHA512(keyBytes))
        {
            var hash = hmac.ComputeHash(inputBytes);
            return BitConverter.ToString(hash).Replace("-", "").ToLower();
        }
    }
}
