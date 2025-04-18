import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy token từ localStorage
    const token = localStorage.getItem("token-user");

    // Gửi yêu cầu để lấy danh sách đơn hàng từ backend
    axios
      .get("https://localhost:7177/api/Order", {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header nếu cần
        },
      })
      .then((response) => {
        setOrders(response.data); // Lưu danh sách đơn hàng
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy danh sách đơn hàng:", err);
        setLoading(false);
        alert("Có lỗi xảy ra khi lấy danh sách đơn hàng.");
      });
  }, []);

  if (loading) {
    return <div>Đang tải danh sách đơn hàng...</div>;
  }

  if (orders.length === 0) {
    return <div>Không có đơn hàng nào.</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Danh sách đơn hàng của bạn</h2>

      <div className="card">
        <div className="card-body">
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Mã đơn hàng</th>
                <th scope="col">Tên khách hàng</th>
                <th scope="col">Ngày tạo</th>
                <th scope="col">Trạng thái</th>
                <th scope="col">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customerName}</td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td>{order.statusName}</td>
                  <td>
                    <button
                      className="btn btn-info"
                      onClick={() => navigate(`/order/${order.id}`)} // Chuyển đến trang chi tiết đơn hàng
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersList;
