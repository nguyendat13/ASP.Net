import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const CancelledOrders = () => {
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const userId = localStorage.getItem("userId"); // Lấy userId từ localStorage
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      console.error("Không tìm thấy userId trong localStorage");
      return;
    }

    const fetchCancelledOrders = async () => {
      try {
        const token = localStorage.getItem("token-user");
        const response = await axios.get(
          `https://localhost:7177/api/Order/canceled/${userId}`, // ✅ Gọi API đúng với route
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCancelledOrders(response.data);
      } catch (error) {
        console.error('Lỗi khi tải danh sách đơn hàng hủy:', error);
        setCancelledOrders([]); // Reset nếu lỗi
      }
    };

    fetchCancelledOrders();
  }, [userId]);

  const deleteOrderPermanently = async (orderId) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa vĩnh viễn đơn hàng này?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token-user");
      await axios.delete(`https://localhost:7177/api/Order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Đơn hàng đã được xóa vĩnh viễn.");
      // Cập nhật lại danh sách
      setCancelledOrders(prev => prev.filter(order => order.id !== orderId));
    } catch (error) {
      console.error("Lỗi khi xóa đơn hàng:", error);
      alert("Không thể xóa đơn hàng.");
    }
  };
  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Danh sách đơn hàng đã hủy</h2>
      <button className="btn btn-secondary mt-4" onClick={() => navigate("/orders")}>
  🡸 Quay lại trang chính
        </button>
      <div className="card shadow-sm">
        <div className="card-body">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>STT</th>
                <th>Mã đơn hàng</th>
                <th>Ngày hủy</th>
                <th>Tổng giá trị</th>
                <th>Trạng thái</th>
                <th>Thao tác</th> {/* Cột mới */}

              </tr>
            </thead>
            <tbody>
              {cancelledOrders.length > 0 ? (
                cancelledOrders.map((order, index) => (
                  <tr key={order.id}>
                    <td>{index + 1}</td>
                    <td>{order.id}</td>
                    <td>{new Date(order.orderDate).toLocaleString()}</td>
                    <td>{order.totalPrice?.toLocaleString()} VNĐ</td>
                    <td className="text-danger">{order.statusName}</td>
                    <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteOrderPermanently(order.id)}
                  >
                    Xóa vĩnh viễn
                  </button>
                </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    Không có đơn hàng nào bị hủy.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CancelledOrders;
