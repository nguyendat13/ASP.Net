import React, { useState, useEffect } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import "../../../../css/chatbox.css";

const Chatbox = ({ senderId, receiverId, userType }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [connection, setConnection] = useState(null);
  const [userStatus, setUserStatus] = useState('Offline'); // Trạng thái người dùng

  // Kết nối SignalR khi component mount
  useEffect(() => {
    const connect = new HubConnectionBuilder()
      .withUrl('https://localhost:7177/chathub')  // Đảm bảo URL đúng
      .build();

    setConnection(connect);

    // Lắng nghe sự kiện nhận tin nhắn
    connect.on('ReceiveMessage', (sender, receiver, message) => {
      // Kiểm tra nếu sender và receiver khớp với nhau
      if ((sender === senderId && receiver === receiverId) || (receiver === senderId && sender === receiverId)) {
        setMessages((prevMessages) => [...prevMessages, { senderId: sender, message }]);
      }
    });

    // Lắng nghe sự kiện cập nhật trạng thái người dùng
    connect.on('UpdateUserStatus', (userId, status) => {
      if (userId === receiverId) {
        setUserStatus(status);  // Cập nhật trạng thái người dùng khi có tin nhắn mới
      }
    });

    connect.start()
      .catch((err) => console.error('Error while establishing connection: ', err));

    return () => {
      connect.stop();
    };
  }, [senderId, receiverId]);

  // Gửi tin nhắn và cập nhật UI ngay lập tức
  const sendMessage = async () => {
    const message = {
      senderId,
      receiverId,
      message: newMessage,
    };

    const response = await fetch('https://localhost:7177/api/Chat/sendMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (response.ok) {
      // Sau khi gửi tin nhắn thành công, cập nhật giao diện
      setMessages((prevMessages) => [...prevMessages, { senderId, message: newMessage }]);
      setNewMessage('');  // Xóa input sau khi gửi
    }
  };

  // Lấy tin nhắn từ backend (lần đầu khi trang load)
  const fetchMessages = async () => {
    const response = await fetch(`https://localhost:7177/api/Chat/getMessages/${senderId}/${receiverId}`);
    const data = await response.json();
    setMessages(data);
  };

  useEffect(() => {
    fetchMessages();
  }, [senderId, receiverId]);

  return (
    <div className="chat-box">
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.senderId === senderId ? 'sent' : 'received'}`}>
            <strong>
              {message.senderId === senderId 
                ? (userType === 'user' ? 'Admin' : 'You') 
                : (userType === 'admin' ? 'User' : 'You')}
            </strong>: {message.message}
          </div>
        ))}
      </div>
      <div className="status">
        <strong>Status: </strong>{userStatus}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbox;
