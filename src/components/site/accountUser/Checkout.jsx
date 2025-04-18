import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const Checkout = () => {
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState(""); // Lưu địa chỉ người dùng
  const [statusOrderId] = useState(1); // Giả sử trạng thái là "Đang xử lý"
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = location.state?.cartItems || [];

  useEffect(() => {
    // Lấy token từ localStorage
    const token = localStorage.getItem("token-user");
    const userId = localStorage.getItem("userId");

    if (userId && token) {
      // Thực hiện yêu cầu API để lấy thông tin người dùng
      axios
        .get(`https://localhost:7177/api/User/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header
          },
        })
        .then((response) => {
          setCustomerName(response.data.fullname); // Lưu tên người dùng
        })
        .catch((err) => {
          console.error("Lỗi khi lấy thông tin người dùng:", err);
          alert("Có lỗi xảy ra khi lấy thông tin người dùng.");
        });
    }
  }, []);

  const handleConfirmPayment = () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token-user");

    // Tạo request cho Order
    const orderRequest = {
      customerName, // Tên khách hàng đã tự động lấy
      statusOrderId,
      userId: parseInt(userId),
      address, // Địa chỉ người dùng
      items: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        priceAfterDiscount: item.priceAfterDiscount, // Thêm giá sau giảm giá
      })),
    };

    // Gửi yêu cầu tạo đơn hàng với token trong header
    axios
      .post("https://localhost:7177/api/Order/create", orderRequest, {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
      })
      .then((response) => {
        alert("Đơn hàng đã được tạo thành công!");
        navigate(`/order/${response.data.id}`);
      })
      .catch((err) => {
        console.error("Lỗi khi tạo đơn hàng:", err);
        alert("Có lỗi xảy ra khi tạo đơn hàng.");
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">🛒 Xác nhận thanh toán</h2>

      <div className="card">
        <div className="card-body">
          <form>
            {/* Hiển thị tên khách hàng tự động */}
            <div className="form-group mb-3">
              <label htmlFor="customerName" className="form-label">
                Tên khách hàng:
              </label>
              <input
                type="text"
                className="form-control"
                id="customerName"
                value={customerName}
                readOnly
              />
            </div>

            {/* Nhập địa chỉ */}
            <div className="form-group mb-3">
              <label htmlFor="address" className="form-label">
                Địa chỉ giao hàng:
              </label>
              <input
                type="text"
                className="form-control"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <h4 className="mb-3">Danh sách sản phẩm trong đơn hàng:</h4>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Sản phẩm</th>
                  <th scope="col">Số lượng</th>
                  <th scope="col">Giá</th>
                  <th scope="col">Giảm giá</th>
                  <th scope="col">Tổng</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.productId}>
                    <td>{item.productName}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price.toLocaleString()} đ</td>
                    <td>{item.discount}%</td>
                    <td>
                      {(item.priceAfterDiscount * item.quantity).toLocaleString()} đ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="d-flex justify-content-between align-items-center mt-3">
              <h5>
                Tổng tiền:{" "}
                {cartItems
                  .reduce(
                    (total, item) => total + item.priceAfterDiscount * item.quantity,
                    0
                  )
                  .toLocaleString()}{" "}
                đ
              </h5>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleConfirmPayment}
              >
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
