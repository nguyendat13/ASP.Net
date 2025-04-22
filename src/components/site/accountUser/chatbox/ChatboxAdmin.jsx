import React from 'react';
import Chatbox from './ChatBox';

const ChatboxAdmin = ({ senderId, receiverId }) => {
  return (
    <Chatbox senderId={senderId} receiverId={receiverId} userType="admin" />
  );
};

export default ChatboxAdmin;
