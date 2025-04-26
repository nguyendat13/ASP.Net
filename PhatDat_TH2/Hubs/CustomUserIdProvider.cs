using Microsoft.AspNetCore.SignalR;

public class CustomUserIdProvider : IUserIdProvider
{
    public string GetUserId(HubConnectionContext connection)
    {
        // Giả sử bạn lưu userId trong claim có tên "id"
        return connection.User?.FindFirst("id")?.Value;
    }
}
