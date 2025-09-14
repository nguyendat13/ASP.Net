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
        <div style={{ background: 'linear-gradient(120deg, #23272b 70%, #4CAF50 100%)', minHeight: '100vh' }}>
            <Navbar />
            <div className="container mt-4" style={{ maxWidth: '1200px', background: 'rgba(34, 39, 43, 0.95)', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', padding: '32px 24px' }}>
                {/* Chat Icon */}
                {!showChat && (
                    <div className="chat-icon" onClick={toggleChat} style={{ position: 'fixed', bottom: '32px', right: '32px', zIndex: 1000, background: '#FFA500', borderRadius: '50%', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', padding: '12px', cursor: 'pointer' }}>
                        <FaComments size={32} color="#23272b" />
                    </div>
                )}

                {/* Chatbox Popup */}
     {showChat && (
  <div
    style={{
      position: "fixed",
      bottom: "24px",
      right: "16px",          // sát mép nhưng không bị tràn
      zIndex: 1100,
      width: "100%",
      maxWidth: "360px",      // khống chế không quá to
      height: "520px",
      background: "#23272b",
      borderRadius: "16px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      boxSizing: "border-box" // tránh tràn do border/padding
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 16px",
        borderBottom: "1px solid #FFA500",
        background: "#23272b"
      }}
    >
      <span style={{ fontWeight: "bold", color: "#FFA500" }}>
        <FaComments style={{ marginRight: 8 }} /> Trợ lý ảo
      </span>
      <button
        onClick={toggleChat}
        style={{
          background: "none",
          border: "none",
          color: "#FFD700",
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