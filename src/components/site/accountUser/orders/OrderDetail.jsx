import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import API_BASE_URL from "../../../../config";
import "../../../../css/order-detail-responsive.css";
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
      <div className="card" style={{ background: '#212121', border: 'none', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <div className="card-body">
          <h4 style={{ color: '#43a047', marginBottom: '20px', fontWeight: 'bold' }}>Thông tin khách hàng</h4>
          <div className="customer-info">
            <p>
              <strong>Tên khách hàng</strong>
              <span>{orderDetails.customerName}</span>
            </p>
            <p>
              <strong>Email khách hàng</strong>
              <span>{orderDetails.emailCustomer}</span>
            </p>
            <p>
              <strong>Địa chỉ</strong>
              <span>{orderDetails.address}</span>
            </p>
            <p>
              <strong>Ngày đặt hàng</strong>
              <span>{new Date(orderDetails.orderDate).toLocaleDateString()}</span>
            </p>
          </div>

          <h4 className="mt-4">Danh sách sản phẩm</h4>
          
          {/* Mobile View */}
          <div className="d-md-none">
            {orderDetails.orderDetails.map((item) => (
              <div key={item.id} className="product-card">
                <div className="product-header">
                  {getImageUrl(item.productImage) ? (
                    <img
                      src={getImageUrl(item.productImage)}
                      alt={item.name}
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="no-image">Không có ảnh</div>
                  )}
                  <h5 className="mb-0">{item.productName}</h5>
                </div>
                <div className="product-details">
                  <div className="detail-row">
                    <span className="detail-label">Số lượng:</span>
                    <span className="detail-value">{item.quantity}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Giá gốc:</span>
                    <span className="price-value">{item.price.toLocaleString()} đ</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Giảm giá:</span>
                    <span className="discount-value">{item.discount}%</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Giá bán:</span>
                    <span className="price-value">{item.priceSale.toLocaleString()} đ</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Thành tiền:</span>
                    <span className="price-value">{(item.priceSale * item.quantity).toLocaleString()} đ</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View */}
          <div className="table-responsive-container d-none d-md-block">
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
                          style={{ objectFit: 'cover', borderRadius: '4px' }}
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
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3 order-summary">
            <h5 style={{ color: '#43a047' }}>
              Tổng tiền:{" "}
              <span style={{ color: '#fff' }}>{orderDetails.totalPrice.toLocaleString()} đ</span>
            </h5>
            <h5 style={{ color: '#43a047' }}>
              Trạng thái:{" "}
              <span className="badge" style={{ 
                background: '#43a047',
                color: '#fff',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '0.9rem'
              }}>{orderDetails.statusName}</span>
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
