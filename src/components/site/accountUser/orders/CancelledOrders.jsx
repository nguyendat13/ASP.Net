import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTrashAlt } from "react-icons/fa";
import axios from "axios";
import API_BASE_URL from '../../../../config';

const CancelledOrders = () => {
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const userId = localStorage.getItem("userId");
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
          `${API_BASE_URL}/api/Order/canceled/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCancelledOrders(response.data);
      } catch (error) {
        console.error('Lỗi khi tải danh sách đơn hàng hủy:', error);
        setCancelledOrders([]);
      }
    };

    fetchCancelledOrders();
  }, [userId]);

  // ✅ Xóa vĩnh viễn 1 đơn hàng
  const deleteOrderPermanently = async (orderId) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa vĩnh viễn đơn hàng này?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token-user");
      await axios.delete(`${API_BASE_URL}/api/Order/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Đơn hàng đã được xóa vĩnh viễn.");
      setCancelledOrders(prev => prev.filter(order => order.id !== orderId));
      setSelectedOrders(prev => prev.filter(id => id !== orderId));
    } catch (error) {
      console.error("Lỗi khi xóa đơn hàng:", error);
      alert("Không thể xóa đơn hàng.");
    }
  };

  // ✅ Xóa nhiều đơn hàng cùng lúc
  const deleteSelectedOrders = async () => {
    if (selectedOrders.length === 0) {
      alert("Vui lòng chọn ít nhất một đơn hàng để xóa!");
      return;
    }
    const confirmDelete = window.confirm(`Xóa vĩnh viễn ${selectedOrders.length} đơn hàng đã chọn?`);
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token-user");
      await axios.post(`${API_BASE_URL}/api/Order/delete-multiple`, selectedOrders, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Đã xóa các đơn hàng đã chọn!");
      setCancelledOrders(prev => prev.filter(order => !selectedOrders.includes(order.id)));
      setSelectedOrders([]);
    } catch (error) {
      console.error("Lỗi khi xóa nhiều đơn hàng:", error);
      alert("Không thể xóa các đơn hàng đã chọn.");
    }
  };

  // ✅ Chọn / bỏ chọn tất cả
  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedOrders(cancelledOrders.map(order => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  // ✅ Chọn từng đơn hàng
  const toggleSelectOrder = (orderId) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center fw-bold" style={{ color: '#fff', letterSpacing: 1 }}>
        Đơn hàng đã hủy
      </h2>

      <div className="d-flex justify-content-between mb-3">
        <button
          className="btn btn-dark d-flex align-items-center gap-2 shadow-sm"
          style={{ borderRadius: 8, fontWeight: 500, background: '#23272a', color: '#fff', border: 'none' }}
          onClick={() => navigate("/orders")}
        >
          <FaArrowLeft style={{ fontSize: '1.3rem' }} /> Quay lại trang chính
        </button>

        {selectedOrders.length > 0 && (
          <button
            className="btn btn-danger d-flex align-items-center gap-2 shadow-sm"
            style={{ borderRadius: 8, fontWeight: 500 }}
            onClick={deleteSelectedOrders}
          >
            <FaTrashAlt /> Xóa {selectedOrders.length} đơn đã chọn
          </button>
        )}
      </div>

      <div className="card shadow-lg" style={{ background: '#23272a', borderRadius: 16 }}>
        <div className="card-body">
          <table className="table table-bordered table-striped" style={{ color: '#fff', background: '#23272a' }}>
            <thead className="table-dark" style={{ background: '#212121', color: '#fff' }}>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={toggleSelectAll}
                    checked={selectedOrders.length === cancelledOrders.length && cancelledOrders.length > 0}
                  />
                </th>
                <th>STT</th>
                <th>Mã đơn hàng</th>
                <th>Ngày hủy</th>
                <th>Tổng giá trị</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {cancelledOrders.length > 0 ? (
                cancelledOrders.map((order, index) => (
                  <tr key={order.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => toggleSelectOrder(order.id)}
                      />
                    </td>
                    <td>{index + 1}</td>
                    <td>{order.id}</td>
                    <td>{new Date(order.orderDate).toLocaleString()}</td>
                    <td style={{ color: '#43a047' }}>{order.totalPrice?.toLocaleString()} VNĐ</td>
                    <td style={{ color: '#e53935', fontWeight: 600 }}>{order.statusName}</td>
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
                  <td colSpan="7" className="text-center text-muted" style={{ color: '#fff' }}>
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
