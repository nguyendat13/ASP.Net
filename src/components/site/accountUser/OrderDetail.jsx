import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const OrderDetails = () => {
  const { orderId } = useParams(); // Lấy orderId từ URL (ví dụ /order/14)
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy token từ localStorage
    const token = localStorage.getItem("token-user");

    // Gửi yêu cầu để lấy chi tiết đơn hàng từ backend
    axios
      .get(`https://localhost:7177/api/Order/${orderId}`, {
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

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (!orderDetails) {
    return <div>Không tìm thấy đơn hàng.</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Chi tiết đơn hàng #{orderDetails.id}</h2>

      <div className="card">
        <div className="card-body">
          <h4>Thông tin khách hàng</h4>
          <p><strong>Tên khách hàng:</strong> {orderDetails.customerName}</p>
          <p><strong>Email khách hàng:</strong> {orderDetails.emailCustomer}</p>
          <p><strong>Ngày đặt hàng:</strong> {new Date(orderDetails.orderDate).toLocaleDateString()}</p>

          <h4 className="mt-4">Danh sách sản phẩm</h4>
          <table className="table table-striped">
            <thead>
              <tr>
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
