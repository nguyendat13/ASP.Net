import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FaPaperPlane } from "react-icons/fa";
import { Link } from "react-router-dom";
import API_BASE_URL from "../../../../config";

const ChatboxAI = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/AIChat/ask`, {
        question: input,
      });

      const aiMessage = {
        sender: "ai",
        text: res.data.answer || res.data.Answer,
        products: res.data.products || res.data.Products || [],
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "❌ Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại sau." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div style={styles.container}>
      {/* Khu vực tin nhắn */}
      <div style={styles.messages}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              ...styles.message,
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.sender === "user" ? "#43a047" : "#2c2f33",
            }}
          >
            {msg.text && <div>{msg.text}</div>}

            {msg.products && msg.products.length > 0 && (
              <div className="row g-2 mt-2">
                {msg.products.map((product) => (
                  <div key={product.id} className="col-12 col-sm-6">
                    <div
                      className="card h-100 pro-card"
                      style={{
                        background: "#fff",
                        color: "#23272a",
                        borderRadius: "12px",
                        padding: "8px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "120px",
                          overflow: "hidden",
                          marginBottom: "8px",
                        }}
                      >
                        <img
                          src={
                            product.avatar
                              ? product.avatar.startsWith("http")
                                ? product.avatar
                                : `${API_BASE_URL}/api/Product/image/${product.avatar}`
                              : "/placeholder.png"
                          }
                          alt={product.name}
                          style={{
                            maxHeight: "110px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                      </div>
                      <h6 style={{ fontWeight: "bold" }}>{product.name}</h6>
                      <p style={{ margin: "0 0 5px 0" }}>
                        {product.price.toLocaleString()} đ
                      </p>
                      <Link
                        to={`/products/${product.id}`}
                        className="btn btn-success w-100"
                        style={{ fontSize: "0.85rem" }}
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div style={{ ...styles.message, backgroundColor: "#2c2f33", alignSelf: "flex-start" }}>
            ⏳ AI đang trả lời...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Ô nhập liệu */}
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Nhập câu hỏi của bạn..."
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.button} disabled={loading}>
          <FaPaperPlane style={{ fontSize: 18 }} /> Gửi
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    backgroundColor: "#181a1b",
    height: "100vh",
    maxWidth: "400px",
    margin: "0 auto",
    border: "1px solid #23272a",
    borderRadius: "8px",
    overflow: "hidden",
  },
  messages: {
    flex: 1,
    padding: "15px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    backgroundColor: "#23272a",
  },
  message: {
    color: "#fff",
    padding: "10px 14px",
    borderRadius: "18px",
    maxWidth: "100%",
    wordWrap: "break-word",
    fontSize: "15px",
  },
  inputContainer: {
    display: "flex",
    borderTop: "1px solid #23272a",
    padding: "10px",
    backgroundColor: "#181a1b",
  },
  input: {
    flex: 1,
    padding: "10px",
    border: "1px solid #43a047",
    borderRadius: "20px",
    marginRight: "10px",
    fontSize: "14px",
    backgroundColor: "#23272a",
    color: "#fff",
    outline: "none",
  },
  button: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "20px",
    backgroundColor: "#43a047",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
};

export default ChatboxAI;
