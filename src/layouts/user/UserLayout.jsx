import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import React, { useState } from "react";
import { FaComments } from 'react-icons/fa';
import ChatboxAI from '../../components/site/accountUser/chatbox/ChatBox';

const UserLayout = ({ userId }) => {
    const [showChat, setShowChat] = useState(false);

    const toggleChat = () => setShowChat(!showChat);

    return (
  <div style={{ background: 'var(--background)', minHeight: '100vh' }}>
            <Navbar />
            <div className="container mt-4" style={{ maxWidth: '1200px', background: 'var(--card)', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', padding: '32px 24px' }}>
                {/* Chat Icon */}
                {!showChat && (
          <div className="chat-icon" onClick={toggleChat} style={{ position: 'fixed', bottom: '32px', right: '32px', zIndex: 1000, background: 'var(--foreground)', borderRadius: '50%', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', padding: '12px', cursor: 'pointer' }}>
            <FaComments size={32} color="var(--card)" />
                    </div>
                )}

                {/* Chatbox Popup */}
     {showChat && (
  <div
    style={{
      position: "fixed",
      bottom: "24px",
      right: "16px",
      zIndex: 1100,
      width: "100%",
      maxWidth: "360px",
      height: "520px",
      background: "var(--card)",
      borderRadius: "16px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      boxSizing: "border-box"
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 16px",
        borderBottom: "1px solid var(--foreground)",
        background: "var(--card)"
      }}
    >
      <span style={{ fontWeight: "bold", color: "var(--foreground)" }}>
        <FaComments style={{ marginRight: 8 }} /> Trợ lý ảo
      </span>
      <button
        onClick={toggleChat}
        style={{
          background: "none",
          border: "none",
          color: "var(--foreground)",
          fontSize: "1.2rem",
          cursor: "pointer"
        }}
      >
        ✖
      </button>
    </div>
    <ChatboxAI userId={userId} />
  </div>
)}



                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default UserLayout;