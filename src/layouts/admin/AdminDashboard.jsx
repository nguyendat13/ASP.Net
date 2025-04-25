import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { FaComments } from 'react-icons/fa';
import ChatboxAdmin from '../../components/site/accountUser/chatbox/ChatboxAdmin';

const AdminDashboard = () => {
  const [showChat, setShowChat] = useState(false); // toggle popup chat

  const toggleChat = () => {
    setShowChat(!showChat);
  };
  return (
    <div style={{ display: 'flex' }}>
      <AdminSidebar />
      <div style={{ flex: 1 }}>
        <AdminNavbar />
        <div id="admin-content" style={{ padding: '20px' }}>
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
          <ChatboxAdmin senderId={3} receiverId={13} />
        </div>
      )}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
