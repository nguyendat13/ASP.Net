import React, { useState, useEffect } from 'react';
import "../../../../css/chatbox.css";
const ChatboxUser = ({ senderId, receiverId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Lấy tin nhắn từ backend
  const fetchMessages = async () => {
    const response = await fetch(`https://localhost:7177/api/Chat/getMessages/${senderId}/${receiverId}`);
    const data = await response.json();
    setMessages(data);
  };

  useEffect(() => {
    fetchMessages();
  }, [senderId, receiverId]);

  // Gửi tin nhắn
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
      setNewMessage('');
      fetchMessages(); // Refresh tin nhắn sau khi gửi
    }
  };

  return (
    <div className="chat-box">
      <div className="messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.senderId === senderId ? 'sent' : 'received'}`}>
            <strong>{message.senderId === senderId ? 'You' : 'Admin'}:</strong> {message.message}
          </div>
        ))}
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

export default ChatboxUser;
