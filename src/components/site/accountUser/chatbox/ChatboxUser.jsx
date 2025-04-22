import React from 'react';
import Chatbox from './ChatBox';

const ChatboxUser = ({ senderId, receiverId }) => {
  return (
    <Chatbox senderId={senderId} receiverId={receiverId} userType="user" />
  );
};

export default ChatboxUser;
