import React, { useState, useEffect } from "react";


import axios from "axios";

import { useNavigate, useLocation } from "react-router-dom";
import { FaShoppingCart, FaMoneyBillWave, FaCheckCircle } from "react-icons/fa";
import API_BASE_URL from "../../../config";

const Checkout = () => {
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [statusOrderId] = useState(1);
  const [methodId, setMethodId] = useState(1);
  const [methods, setMethods] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

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

  // Tạo order và thanh toán COD hoặc phương thức khác
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
      // 1️⃣ Tạo order trước
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
        `${API_BASE_URL}/api/Order/create`,
        orderRequest,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const orderId = orderRes.data.id;

      // 2️⃣ Tạo payment request
      const orderInfo = `Thanh toán đơn hàng|userId:${userId}`;
     // 1️⃣ Gửi Payment lên backend
const paymentRequest = {
  orderId: Date.now().toString(), // để backend tự sinh cũng được
  orderType: "other",
  amount: totalAmount * 100, // VNPay yêu cầu amount là số nguyên, tính theo đơn vị nhỏ nhất (ví dụ: 1000 VND = 100000)
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
    price: item.priceAfterDiscount  // BẮT BUỘC phải có
  }))
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
      handleVnPayPayment(); // VNPay
    } else {
      handleConfirmPayment(); // COD hoặc phương thức khác
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 fw-bold d-flex align-items-center justify-content-center gap-2" style={{ color: '#43a047', letterSpacing: 1 }}>
        <FaShoppingCart style={{ color: '#ff9800', fontSize: 32 }} /> Xác nhận thanh toán
      </h2>

      <div className="card shadow-lg" style={{ background: '#23272a', borderRadius: 16 }}>
        <div className="card-body">
          <form>
            <div className="form-group mb-3">
              <label className="fw-bold" style={{ color: '#fbc02d' }}>Tên khách hàng:</label>
              <input type="text" className="form-control" value={customerName} readOnly style={{ background: '#212121', color: '#fff', border: '1px solid #43a047', borderRadius: 8 }} />
            </div>

            <div className="form-group mb-3">
              <label className="fw-bold" style={{ color: '#fbc02d' }}>Email:</label>
              <input type="email" className="form-control" value={email} readOnly style={{ background: '#212121', color: '#fff', border: '1px solid #43a047', borderRadius: 8 }} />
            </div>

            <div className="form-group mb-3">
              <label className="fw-bold" style={{ color: '#fbc02d' }}>Số điện thoại:</label>
              <input
                type="text"
                className="form-control"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                style={{ background: '#212121', color: '#fff', border: '1px solid #43a047', borderRadius: 8 }}
              />
            </div>

            <div className="form-group mb-3">
              <label className="fw-bold" style={{ color: '#fbc02d' }}>Địa chỉ giao hàng:</label>
              <input
                type="text"
                className="form-control"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                style={{ background: '#212121', color: '#fff', border: '1px solid #43a047', borderRadius: 8 }}
              />
            </div>

            <h4 className="mb-3 fw-bold" style={{ color: '#ff9800' }}>Danh sách sản phẩm:</h4>
            <table className="table table-bordered" style={{ background: '#23272a', color: '#fff', borderRadius: 12 }}>
              <thead className="table-dark" style={{ background: '#212121', color: '#43a047' }}>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Giá</th>
                  <th>Giảm giá</th>
                  <th>Tổng</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.productId} style={{ background: '#23272a', color: '#fff' }}>
                    <td>{item.productName}</td>
                    <td>{item.quantity}</td>
                    <td style={{ color: '#e53935', fontWeight: 700 }}>{item.price.toLocaleString()} đ</td>
                    <td style={{ color: '#fbc02d', fontWeight: 600 }}>{item.discount}%</td>
                    <td style={{ color: '#43a047', fontWeight: 700 }}>{(item.priceAfterDiscount * item.quantity).toLocaleString()} đ</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="d-flex justify-content-between align-items-center mt-3">
              <h5 className="fw-bold d-flex align-items-center gap-2" style={{ color: '#ff9800' }}>
                <FaMoneyBillWave style={{ color: '#43a047', fontSize: 22 }} /> Tổng tiền: {totalAmount.toLocaleString()} đ
              </h5>

              <div className="form-group mb-0">
                <label className="fw-bold" style={{ color: '#fbc02d' }}>Phương thức thanh toán:</label>
                <select
                  className="form-select"
                  value={methodId}
                  onChange={(e) => setMethodId(parseInt(e.target.value))}
                  style={{ background: '#212121', color: '#fff', border: '1px solid #43a047', borderRadius: 8 }}
                >
                  <option value="">-- Chọn phương thức --</option>
                  {methods.map((method) => (
                    <option key={method.id} value={method.id}>
                      {method.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-end mt-4">
              <button type="button" className="btn btn-success d-flex align-items-center gap-1" style={{ borderRadius: 8, fontWeight: 500, background: '#43a047', color: '#fff', border: 'none' }} onClick={handlePayment}>
                <FaCheckCircle style={{ color: '#fbc02d', fontSize: 18 }} /> Xác nhận thanh toán
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
