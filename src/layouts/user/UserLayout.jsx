import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; // nếu có
import Footer from './Footer'; // nếu có
import React, { useEffect, useState } from "react";
import { FaComments } from 'react-icons/fa';
import ChatboxUser from '../../components/site/accountUser/chatbox/ChatboxUser';

const UserLayout = () => {
    const [showChat, setShowChat] = useState(false); // toggle popup chat
  
  const toggleChat = () => {
    setShowChat(!showChat);
  };
  return (
    <div>
      <Navbar />
      <div className="container mt-4">
          {/* Chat Icon */}
                <div className="chat-icon" onClick={toggleChat}>
                <FaComments size={32} />
              </div>
        
              {/* Chatbox Popup */}
              {showChat && (
                <div className="chat-popup">
                  <div className="chat-popup-header">
                    <span>💬 Tin nhắn</span>
                    <button onClick={toggleChat} className="close-btn">✖</button>
                  </div>
                  <ChatboxUser senderId={13} receiverId={3} />
                </div>
              )}
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default UserLayout;
