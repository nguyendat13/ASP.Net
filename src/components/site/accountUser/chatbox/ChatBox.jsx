import React, { useState, useEffect } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import "../../../../css/chatbox.css";

const Chatbox = ({ senderId, receiverId, userType }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [connection, setConnection] = useState(null);
  const [userStatus, setUserStatus] = useState('Offline');
  const optimisticMessage = { senderId, message: newMessage };

  useEffect(() => {
    const connect = new HubConnectionBuilder()
      .withUrl('https://localhost:7177/chathub')
      .build();

    setConnection(connect);

    // Fetch messages when the component mounts
    const fetchMessages = async () => {
      try {
        const response = await fetch(`https://localhost:7177/api/Chat/getMessages/${senderId}/${receiverId}`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    // Handle received messages
    connect.on('ReceiveMessage', (sender, receiver, message) => {
      if (
        (sender === senderId && receiver === receiverId) ||
        (sender === receiverId && receiver === senderId)
      ) {
        setMessages((prevMessages) => [...prevMessages, { senderId: sender, message }]);
      }
    });

    // Handle user status updates
    connect.on('UpdateUserStatus', (userId, status) => {
      if (userId === receiverId) {
        setUserStatus(status);
      }
    });

    // Start the connection and fetch messages
    connect.start()
      .then(() => {
        console.log('SignalR connection established');
        fetchMessages(); // Fetch messages after connection is established
      })
      .catch((err) => console.error('Error while establishing connection: ', err));

    return () => {
      connect.stop();
    };
  }, [senderId, receiverId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return; // Don't send empty messages

    try {
      // Optimistically update the UI
      const optimisticMessage = { senderId, message: newMessage };
      setMessages((prevMessages) => [...prevMessages, optimisticMessage]);
      setNewMessage('');

      // Send the message to the server
      const response = await fetch('https://localhost:7177/api/Chat/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderId,
          receiverId,
          message: newMessage,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // No need to manually update messages here because SignalR will handle it
    } catch (error) {
      console.error('Error sending message:', error);
      // Roll back the optimistic update if there's an error
      setMessages((prevMessages) => prevMessages.filter(msg => msg !== optimisticMessage));
    }
  };

  return (
    <div className="chat-box">
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.senderId === senderId ? 'sent' : 'received'}`}>
            <strong>
              {message.senderId === senderId
                ? (userType === 'user' ? 'You' : 'You') // Fixed: Show "You" if sender is current user
                : (userType === 'admin' ? 'User' : 'Admin')}
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
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbox;