import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import API_BASE_URL from "../../../config";
import "../../../css/checkout.css";

const Checkout = () => {
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [statusOrderId] = useState(1);
  const [methodId, setMethodId] = useState(1);
  const [methods, setMethods] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const navigate = useNavigate();
  const location = useLocation();

  // Detect mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lấy cartItems từ location.state
  useEffect(() => {
    const items = location.state?.cartItems || [];
    setCartItems(items);
  }, [location.state]);

  // Tính tổng tiền
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.priceAfterDiscount * item.quantity,
    0
  );

  // Lấy thông tin user
  useEffect(() => {
    const token = localStorage.getItem("token-user");
    const userId = localStorage.getItem("userId");

    if (userId && token) {
      axios
        .get(`${API_BASE_URL}/api/User/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setCustomerName(res.data.fullname);
          setEmail(res.data.email);
          setPhone(res.data.phone);
        })
        .catch((err) => {
          console.error("Lỗi khi lấy thông tin người dùng:", err);
          alert("Không thể lấy thông tin người dùng.");
        });
    }
  }, []);

  // Lấy danh sách phương thức thanh toán
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/Method`)
      .then((res) => setMethods(res.data))
      .catch((err) => console.error("Lỗi khi fetch phương thức thanh toán:", err));
  }, []);

  // Tạo order
  const handleConfirmPayment = async () => {
    const token = localStorage.getItem("token-user");
    const userId = localStorage.getItem("userId");

    if (!address || !phone) {
      alert("Vui lòng nhập địa chỉ giao hàng!");
      return;
    }

    const orderRequest = {
      customerName,
      email,
      phone,
      address,
      statusOrderId,
      methodId,
      userId: parseInt(userId),
      items: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/Order/create`,
        orderRequest,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Đơn hàng đã được tạo thành công!");
      navigate(`/order/${res.data.id}`);
    } catch (err) {
      console.error("Lỗi khi tạo đơn hàng:", err);
      alert("Không thể tạo đơn hàng.");
    }
  };

  // Thanh toán VNPay
  const handleVnPayPayment = async () => {
    const token = localStorage.getItem("token-user");
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Bạn chưa đăng nhập.");
      return;
    }
    if (!address || !phone) {
      alert("Vui lòng nhập địa chỉ giao hàng!");
      return;
    }

    try {
      const orderRequest = {
        customerName,
        email,
        phone,
        address,
        statusOrderId: 1,
        methodId,
        userId: parseInt(userId),
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      const orderRes = await axios.post(
        `${API_BASE_URL}/api/Order/create-temp`,
        orderRequest,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const paymentRequest = {
        orderId: Date.now().toString(),
        orderType: "other",
        amount: totalAmount * 100,
        orderDescription: `Thanh toán đơn hàng|userId:${userId}`,
        name: customerName,
        userId: parseInt(userId),
        address: address,
        phone: phone,
        email: email,
        methodId: methodId,
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.priceAfterDiscount,
        })),
      };

      const paymentRes = await axios.post(
        `${API_BASE_URL}/api/Payment/create`,
        paymentRequest,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.href = paymentRes.data.paymentUrl;
    } catch (err) {
      console.error("Lỗi khi tạo thanh toán VNPay:", err);
      alert("Không thể khởi tạo thanh toán.");
    }
  };

  // Xác nhận thanh toán
  const handlePayment = () => {
    if (!address || !phone) {
      alert("Vui lòng nhập địa chỉ giao hàng!");
      return;
    }

    if (methodId === 3) {
      handleVnPayPayment();
    } else {
      handleConfirmPayment();
    }
  };

  const inputStyle = {
    background: "#212121",
    color: "#fff",
    border: "1px solid #43a047",
    borderRadius: 8,
    padding: "10px 12px",
    fontSize: "0.95rem",
  };

  return (
    <div
      style={{
        background: "#1a1a1a",
        minHeight: "100vh",
        paddingTop: "20px",
        paddingBottom: "40px",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #43a047 0%, #2e7d32 100%)",
          color: "#fff",
          padding: isMobile ? "30px 15px" : "40px 20px",
          textAlign: "center",
          marginBottom: "30px",
          borderRadius: "0 0 16px 16px",
        }}
      >
        <h2
          style={{
            fontSize: isMobile ? "1.5rem" : "2.5rem",
            fontWeight: "700",
            margin: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            letterSpacing: "0.5px",
          }}
        >
          🛒 Xác nhận thanh toán
        </h2>
      </div>

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: isMobile ? "0 15px" : "0 20px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: isMobile ? "20px" : "30px",
          }}
        >
          {/* Form Section */}
          <div>
            <div
              style={{
                background: "#23272a",
                borderRadius: "16px",
                padding: isMobile ? "20px" : "30px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                border: "1px solid rgba(67, 160, 71, 0.15)",
              }}
            >
              <h3
                style={{
                  fontSize: isMobile ? "1.1rem" : "1.3rem",
                  fontWeight: "700",
                  color: "#fff",
                  marginBottom: "20px",
                  borderBottom: "2px solid #43a047",
                  paddingBottom: "12px",
                }}
              >
                📋 Thông tin giao hàng
              </h3>

              {/* Customer Name */}
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: "600",
                    color: "#fff",
                    marginBottom: "8px",
                    fontSize: "0.95rem",
                  }}
                >
                  Tên khách hàng:
                </label>
                <input
                  type="text"
                  value={customerName}
                  readOnly
                  style={{
                    background: "#1e1e1e",
                    color: "#fff",
                    border: "1px solid #43a047",
                    borderRadius: 8,
                    padding: "10px 12px",
                    fontSize: "0.95rem",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                  className="form-control"
                />
              </div>

              {/* Email */}
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: "600",
                    color: "#fff",
                    marginBottom: "8px",
                    fontSize: "0.95rem",
                  }}
                >
                  Email:
                </label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  style={{
                    background: "#1e1e1e",
                    color: "#fff",
                    border: "1px solid #43a047",
                    borderRadius: 8,
                    padding: "10px 12px",
                    fontSize: "0.95rem",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                  className="form-control"
                />
              </div>

              {/* Phone */}
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: "600",
                    color: "#fff",
                    marginBottom: "8px",
                    fontSize: "0.95rem",
                  }}
                >
                  Số điện thoại: <span style={{ color: "#ff6b6b" }}>*</span>
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="Nhập số điện thoại"
                  style={{
                    background: "#1e1e1e",
                    color: "#fff",
                    border: "1px solid #43a047",
                    borderRadius: 8,
                    padding: "10px 12px",
                    fontSize: "0.95rem",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                  className="form-control"
                />
              </div>

              {/* Address */}
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: "600",
                    color: "#fff",
                    marginBottom: "8px",
                    fontSize: "0.95rem",
                  }}
                >
                  Địa chỉ giao hàng: <span style={{ color: "#ff6b6b" }}>*</span>
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  placeholder="Nhập địa chỉ giao hàng đầy đủ"
                  style={{
                    background: "#1e1e1e",
                    color: "#fff",
                    border: "1px solid #43a047",
                    borderRadius: 8,
                    padding: "10px 12px",
                    fontSize: "0.95rem",
                    width: "100%",
                    boxSizing: "border-box",
                    minHeight: "80px",
                    resize: "vertical",
                    fontFamily: "inherit",
                  }}
                  className="form-control"
                />
              </div>

              {/* Payment Method */}
              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: "600",
                    color: "#fff",
                    marginBottom: "8px",
                    fontSize: "0.95rem",
                  }}
                >
                  💳 Phương thức thanh toán: <span style={{ color: "#ff6b6b" }}>*</span>
                </label>
                <select
                  value={methodId}
                  onChange={(e) => setMethodId(parseInt(e.target.value))}
                  style={{
                    background: "#1e1e1e",
                    color: "#fff",
                    border: "1px solid #43a047",
                    borderRadius: 8,
                    padding: "10px 12px",
                    fontSize: "0.95rem",
                    width: "100%",
                    boxSizing: "border-box",
                    cursor: "pointer",
                  }}
                  className="form-select"
                >
                  <option value="">-- Chọn phương thức --</option>
                  {methods.map((method) => (
                    <option key={method.id} value={method.id}>
                      {method.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Confirm Button */}
              <button
                onClick={handlePayment}
                style={{
                  width: "100%",
                  padding: isMobile ? "14px" : "16px",
                  background: "linear-gradient(135deg, #43a047 0%, #2e7d32 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "12px",
                  fontWeight: "700",
                  fontSize: isMobile ? "0.95rem" : "1rem",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 12px rgba(67, 160, 71, 0.2)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 8px 20px rgba(67, 160, 71, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 4px 12px rgba(67, 160, 71, 0.2)";
                }}
              >
                ✓ Xác nhận thanh toán
              </button>
            </div>
          </div>

          {/* Order Summary Section */}
          <div>
            <div
              style={{
                background: "#23272a",
                borderRadius: "16px",
                padding: isMobile ? "20px" : "30px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                border: "1px solid rgba(67, 160, 71, 0.15)",
                position: isMobile ? "relative" : "sticky",
                top: isMobile ? "auto" : "20px",
              }}
            >
              <h3
                style={{
                  fontSize: isMobile ? "1.1rem" : "1.3rem",
                  fontWeight: "700",
                  color: "#fff",
                  marginBottom: "20px",
                  borderBottom: "2px solid #43a047",
                  paddingBottom: "12px",
                }}
              >
                📦 Đơn hàng của bạn
              </h3>

              {/* Products List */}
              <div style={{ marginBottom: "20px", maxHeight: isMobile ? "400px" : "500px", overflowY: "auto" }}>
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div
                      key={item.productId}
                      style={{
                        display: "flex",
                        gap: "12px",
                        padding: "12px",
                        background: "#2a2f33",
                        borderRadius: "12px",
                        marginBottom: "12px",
                        borderLeft: "4px solid #43a047",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            margin: 0,
                            fontWeight: "600",
                            color: "#fff",
                            fontSize: "0.95rem",
                            marginBottom: "4px",
                          }}
                        >
                          {item.productName}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            fontSize: "0.85rem",
                            color: "#aaa",
                          }}
                        >
                          <span>Số lượng: {item.quantity}</span>
                          {item.discount > 0 && (
                            <span style={{ color: "#43a047", fontWeight: "600" }}>
                              -{item.discount}%
                            </span>
                          )}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p
                          style={{
                            margin: 0,
                            color: "#43a047",
                            fontWeight: "700",
                            fontSize: "0.95rem",
                          }}
                        >
                          {(item.priceAfterDiscount * item.quantity).toLocaleString()} đ
                        </p>
                        {item.discount > 0 && (
                          <p
                            style={{
                              margin: "4px 0 0 0",
                              color: "#666",
                              fontSize: "0.8rem",
                              textDecoration: "line-through",
                            }}
                          >
                            {(item.price * item.quantity).toLocaleString()} đ
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "#666", textAlign: "center", padding: "20px 0" }}>
                    Giỏ hàng trống
                  </p>
                )}
              </div>

              {/* Divider */}
              <div
                style={{
                  height: "1px",
                  background: "rgba(67, 160, 71, 0.2)",
                  margin: "20px 0",
                }}
              />

              {/* Total Section */}
              <div
                style={{
                  background: "rgba(67, 160, 71, 0.08)",
                  padding: "16px",
                  borderRadius: "12px",
                  border: "1px solid rgba(67, 160, 71, 0.2)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "12px",
                  }}
                >
                  <span style={{ color: "#aaa", fontSize: "0.95rem" }}>
                    Tổng cộng:
                  </span>
                  <span
                    style={{
                      fontSize: isMobile ? "1.3rem" : "1.5rem",
                      fontWeight: "700",
                      color: "#43a047",
                    }}
                  >
                    {totalAmount.toLocaleString()} đ
                  </span>
                </div>
                <p
                  style={{
                    margin: "8px 0 0 0",
                    fontSize: "0.8rem",
                    color: "#666",
                  }}
                >
                  ✓ Miễn phí vận chuyển cho đơn hàng trên 500.000đ
                </p>
              </div>

              {/* Shipping Info */}
              <div
                style={{
                  marginTop: "20px",
                  padding: "12px",
                  background: "rgba(67, 160, 71, 0.1)",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  color: "#81c784",
                  border: "1px solid rgba(67, 160, 71, 0.3)",
                }}
              >
                ℹ️ Giao hàng trong 24-48 giờ tại TP.HCM, 3-5 ngày tại các tỉnh khác
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .form-control,
          .form-select {
            font-size: 16px !important; /* Ngăn zoom trên iOS */
          }

          textarea {
            font-size: 16px !important;
          }

          input[type="text"],
          input[type="email"],
          input[type="number"],
          select {
            font-size: 16px !important;
          }
        }

        /* Scrollbar style */
        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: #43a047;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #2e7d32;
        }
      `}</style>
    </div>
  );
};

export default Checkout;