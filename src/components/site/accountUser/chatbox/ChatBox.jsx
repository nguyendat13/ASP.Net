import React, { useState, useRef, useEffect } from "react";


import axios from "axios";

import { FaPaperPlane } from "react-icons/fa";
import API_BASE_URL from "../../../../config";

const ChatboxAI = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input };
    setMessages(prev => [...prev, userMessage]);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/AIChat/ask`, {
        question: input,
      });
      const aiMessage = { sender: "ai", text: res.data.answer };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: "ai", text: "Xin lỗi, AI đang bận. Thử lại sau." }]);
    }
    setInput("");
  };

  const handleKeyPress = (e) => { if (e.key === "Enter") sendMessage(); };

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  flex: 1,                  // chiếm hết khung cha
  backgroundColor: "#181a1b"
};

const messagesStyle = {
  flex: 1,
  padding: "15px",
  overflowY: "auto",        // cuộn nội dung
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  backgroundColor: "#23272a"
};


  const inputContainerStyle = {
    display: "flex",
    borderTop: "1px solid #23272a",
    padding: "10px",
    backgroundColor: "#181a1b"
  };

  return (
    <div style={containerStyle}>
      <div style={messagesStyle}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.sender === "user" ? "#43a047" : "#23272a",
              color: msg.sender === "user" ? "#fff" : "#ff9800",
              padding: "10px 14px",
              borderRadius: "18px",
              maxWidth: "75%",
              wordWrap: "break-word",
              fontSize: "15px"
            }}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={inputContainerStyle}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Nhập câu hỏi của bạn..."
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #43a047",
            borderRadius: "20px",
            marginRight: "10px",
            fontSize: "14px",
            backgroundColor: "#23272a",
            color: "#fff",
            outline: "none"
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "10px 20px",
            border: "none",
            borderRadius: "20px",
            backgroundColor: "#43a047",
            color: "#fff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <FaPaperPlane style={{ color: '#fbc02d', fontSize: 18 }} /> Gửi
        </button>
      </div>
    </div>
  );
};


export default ChatboxAI;