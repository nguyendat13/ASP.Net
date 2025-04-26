using Microsoft.AspNetCore.SignalR;
using PhatDat_TH2.Services;

namespace PhatDat_TH2.Hubs
{
    public class ChatHub : Hub
    {
        // Gửi tin nhắn tới cả user và admin
        public async Task SendMessage(string senderId, string receiverId, string message)
        {
            // Gửi tin nhắn đến user hoặc admin (tùy vào receiverId)
            await Clients.User(receiverId).SendAsync("ReceiveMessage", senderId, receiverId, message);

            // Nếu sender là user và receiver là admin, ngược lại nếu sender là admin và receiver là user
            await Clients.User(senderId).SendAsync("ReceiveMessage", senderId, receiverId, message);
        }

     
    }


}
