import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import axios from "axios";
import API_BASE_URL from '../../../../config';

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
          `${API_BASE_URL}/api/Order/canceled/${userId}`, // ✅ Gọi API đúng với route
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
      await axios.delete(`${API_BASE_URL}/api/Order/${orderId}`, {
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
      <h2 className="mb-4 text-center fw-bold" style={{ color: '#fff', letterSpacing: 1 }}>
        Đơn hàng đã hủy
      </h2>
      <div className="d-flex justify-content-start mb-3">
        <button
          className="btn btn-dark d-flex align-items-center gap-2 shadow-sm"
          style={{ borderRadius: 8, fontWeight: 500, background: '#23272a', color: '#fff', border: 'none' }}
          onClick={() => navigate("/orders")}
        >
          <FaArrowLeft style={{ fontSize: '1.3rem', color: 'inherit' }} className="navbar-icon" />
          Quay lại trang chính
        </button>
      </div>
      <div className="card shadow-lg" style={{ background: '#23272a', borderRadius: 16 }}>
        <div className="card-body">
          <table className="table table-bordered table-striped" style={{ color: '#fff', background: '#23272a' }}>
            <thead className="table-dark" style={{ background: '#212121', color: '#fff' }}>
              <tr>
                <th style={{ color: '#fff' }}>STT</th>
                <th style={{ color: '#fff' }}>Mã đơn hàng</th>
                <th style={{ color: '#fff' }}>Ngày hủy</th>
                <th style={{ color: '#fff' }}>Tổng giá trị</th>
                <th style={{ color: '#fff' }}>Trạng thái</th>
                <th style={{ color: '#fff' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {cancelledOrders.length > 0 ? (
                cancelledOrders.map((order, index) => (
                  <tr key={order.id} style={{ color: '#fff', background: '#23272a' }}>
                    <td>{index + 1}</td>
                    <td>{order.id}</td>
                    <td>{new Date(order.orderDate).toLocaleString()}</td>
                    <td style={{ color: '#43a047' }}>{order.totalPrice?.toLocaleString()} VNĐ</td>
                    <td style={{ color: '#e53935', fontWeight: 600 }}>{order.statusName}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        style={{ color: '#fff', background: '#e53935', border: 'none', borderRadius: 8, fontWeight: 500 }}
                        onClick={() => deleteOrderPermanently(order.id)}
                      >
                        Xóa vĩnh viễn
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted" style={{ color: '#fff' }}>
                    Không có đơn hàng nào bị hủy.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`
        .navbar-icon {
          color: inherit !important;
          transition: color 0.2s;
        }
        .navbar-icon:hover {
          color: #fff !important;
        }
      `}</style>
    </div>
  );
};

export default CancelledOrders;
