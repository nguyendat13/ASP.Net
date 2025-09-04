    import React, { useState, useRef, useEffect } from "react";
    import axios from "axios";
import { FaPaperPlane } from "react-icons/fa";

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
        const res = await axios.post("https://localhost:7177/api/AIChat/ask", {
            question: input,
        });
        const aiMessage = { sender: "ai", text: res.data.answer };
        setMessages(prev => [...prev, aiMessage]);
        } catch (err) {
        const errorMessage = { sender: "ai", text: "Xin lỗi, AI đang bận. Thử lại sau." };
        setMessages(prev => [...prev, errorMessage]);
        }

        setInput("");
    };

    const handleKeyPress = (e) => { if (e.key === "Enter") sendMessage(); };

    const containerStyle = {
    display: "flex",
    flexDirection: "column",
    width: "360px",
    height: "500px",
    border: "1px solid #23272a",
    borderRadius: "18px",
    overflow: "hidden",
    backgroundColor: "#181a1b",
    boxShadow: "0 4px 16px #23272a",
    marginLeft: "auto",
    marginRight: "40px"
    };

    const messagesStyle = {
        flex: 1,
        padding: "15px",
        overflowY: "auto",
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

    const inputStyle = {
        flex: 1,
        padding: "10px",
        border: "1px solid #43a047",
        borderRadius: "20px",
        outline: "none",
        marginRight: "10px",
        fontSize: "14px",
        backgroundColor: "#23272a",
        color: "#fff"
    };

    const buttonStyle = {
        padding: "10px 20px",
        border: "none",
        borderRadius: "20px",
        backgroundColor: "#43a047",
        color: "#fff",
        fontWeight: "bold",
        cursor: "pointer",
        fontSize: "16px",
        display: "flex",
        alignItems: "center",
        gap: "8px"
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
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                    wordWrap: "break-word",
                                    fontWeight: msg.sender === "user" ? 500 : 400,
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
                            style={inputStyle}
                        />
                        <button onClick={sendMessage} style={buttonStyle}>
                            <FaPaperPlane style={{ color: '#fbc02d', fontSize: 18 }} /> Gửi
                        </button>
                    </div>
                </div>
    );
    };

    export default ChatboxAI;
