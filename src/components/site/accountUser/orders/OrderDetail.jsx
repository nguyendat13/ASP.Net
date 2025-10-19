import React, { useEffect, useState } from "react";


import axios from "axios";

import { useParams,useNavigate } from "react-router-dom";

import API_BASE_URL from "../../../../config";
const OrderDetails = () => {
  const { orderId } = useParams(); // Lấy orderId từ URL (ví dụ /order/14)
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    // Lấy token từ localStorage
    const token = localStorage.getItem("token-user");

    // Gửi yêu cầu để lấy chi tiết đơn hàng từ backend
    axios
      .get(`${API_BASE_URL}/api/Order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header nếu cần
        },
      })
      .then((response) => {
        setOrderDetails(response.data); // Lưu thông tin đơn hàng
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy thông tin đơn hàng:", err);
        setLoading(false);
        alert("Có lỗi xảy ra khi lấy thông tin đơn hàng.");
      });
  }, [orderId]);
const getImageUrl = (avatarPath) => {
  if (!avatarPath) return "https://via.placeholder.com/200x200?text=No+Image";

  // Nếu là link đầy đủ (bắt đầu bằng http hoặc https)
  if (avatarPath.startsWith("http")) {
    return avatarPath;
  }

  // Nếu là đường dẫn tương đối, xử lý để gọi API backend
  const filename = avatarPath.replace("/images/", "").split("/").pop();
  return `${API_BASE_URL}/api/Product/image/${filename}`;
};

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (!orderDetails) {
    return <div>Không tìm thấy đơn hàng.</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 fw-bold" style={{ color: '#43a047', letterSpacing: 1 }}>
        Chi tiết đơn hàng #{orderDetails.id}
      </h2>
      <div className="d-flex justify-content-start mb-3">
        <button
          className="btn btn-dark d-flex align-items-center gap-2 shadow-sm"
          style={{ borderRadius: 8, fontWeight: 500, background: '#23272a', color: '#ff9800', border: 'none' }}
          onClick={() => navigate("/orders")}
        >
          <span style={{ fontSize: '1.3rem', color: '#43a047' }}>&#8592;</span>
          Quay lại trang chính
        </button>
      </div>
      <div className="card">
        <div className="card-body">
          <h4>Thông tin khách hàng</h4>
          <p><strong>Tên khách hàng:</strong> {orderDetails.customerName}</p>
          <p><strong>Email khách hàng:</strong> {orderDetails.emailCustomer}</p>
          <p><strong>Địa chỉ:</strong> {orderDetails.address}</p>
          <p><strong>Ngày đặt hàng:</strong> {new Date(orderDetails.orderDate).toLocaleDateString()}</p>

          <h4 className="mt-4">Danh sách sản phẩm</h4>
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Ảnh</th>
                <th scope="col">Sản phẩm</th>                 
                <th scope="col">Số lượng</th>
                <th scope="col">Giá gốc</th>
                <th scope="col">Giảm giá</th>
                <th scope="col">Giá bán</th>
                <th scope="col">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.orderDetails.map((item) => (
                <tr key={item.id}>
                   <td>
                {getImageUrl(item.productImage) ? (
                  <img
                    src={getImageUrl(item.productImage)}
                    alt={item.name}
                    width="60"
                    height="60"
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <span>Không có ảnh</span>
                )}
              </td>   
                  <td>{item.productName}</td>
                       
                  <td>{item.quantity}</td>
                  <td>{item.price.toLocaleString()} đ</td>
                  <td>{item.discount}%</td>
                  <td>{item.priceSale.toLocaleString()} đ</td>
                  <td>{(item.priceSale * item.quantity).toLocaleString()} đ</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <h5>
              Tổng tiền:{" "}
              {orderDetails.totalPrice.toLocaleString()} đ
            </h5>
            <h5>
              Trạng thái:{" "}
              <span className="badge bg-info">{orderDetails.statusName}</span>
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
