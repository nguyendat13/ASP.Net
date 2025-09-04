import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

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
        .get(`https://localhost:7177/api/User/${userId}`, {
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
      .get("https://localhost:7177/api/Method")
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
        "https://localhost:7177/api/Order/create",
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
        "https://localhost:7177/api/Order/create",
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
  "https://localhost:7177/api/Payment/create",
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
      <h2 className="text-center mb-4">🛒 Xác nhận thanh toán</h2>

      <div className="card">
        <div className="card-body">
          <form>
            <div className="form-group mb-3">
              <label>Tên khách hàng:</label>
              <input type="text" className="form-control" value={customerName} readOnly />
            </div>

            <div className="form-group mb-3">
              <label>Email:</label>
              <input type="email" className="form-control" value={email} readOnly />
            </div>

            <div className="form-group mb-3">
              <label>Số điện thoại:</label>
              <input
                type="text"
                className="form-control"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label>Địa chỉ giao hàng:</label>
              <input
                type="text"
                className="form-control"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <h4 className="mb-3">Danh sách sản phẩm:</h4>
            <table className="table table-striped">
              <thead>
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
                  <tr key={item.productId}>
                    <td>{item.productName}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price.toLocaleString()} đ</td>
                    <td>{item.discount}%</td>
                    <td>{(item.priceAfterDiscount * item.quantity).toLocaleString()} đ</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="d-flex justify-content-between align-items-center mt-3">
              <h5>Tổng tiền: {totalAmount.toLocaleString()} đ</h5>

              <div className="form-group mb-0">
                <label>Phương thức thanh toán:</label>
                <select
                  className="form-select"
                  value={methodId}
                  onChange={(e) => setMethodId(parseInt(e.target.value))}
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
              <button type="button" className="btn btn-primary" onClick={handlePayment}>
                Xác nhận thanh toán
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
