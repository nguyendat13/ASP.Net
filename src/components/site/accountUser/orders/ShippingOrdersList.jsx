import React, { useEffect, useState } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTruckMoving, FaSearch } from "react-icons/fa";

import API_BASE_URL from "../../../../config";
const ShippingOrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token-user");
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setLoading(false);
      return;
    }

    axios
      .get(`${API_BASE_URL}/api/Order/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const shippingOrders = (response.data || []).filter(
          (order) => order.statusName === "Đang giao"
        );
        setOrders(shippingOrders);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy đơn hàng đang vận chuyển:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
  return <div className="text-center mt-5 text-light">Đang tải đơn hàng đang vận chuyển...</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 fw-bold" style={{ color: '#43a047', letterSpacing: 1 }}>
        <FaTruckMoving className="me-2" style={{ color: '#ff9800', fontSize: 28 }} />
        Đơn hàng đang vận chuyển
      </h2>
      <div className="d-flex justify-content-start mb-3">
        <button
          className="btn btn-dark d-flex align-items-center gap-2 shadow-sm"
          style={{ borderRadius: 8, fontWeight: 500, background: '#23272a', color: '#ff9800', border: 'none' }}
          onClick={() => navigate("/orders")}
        >
          <FaArrowLeft style={{ fontSize: '1.3rem', color: '#43a047' }} />
          Quay lại trang chính
        </button>
      </div>
      {orders.length === 0 ? (
        <div className="alert alert-info text-center fw-bold" style={{ background: '#212121', color: '#43a047', border: 'none' }}>
          Hiện không có đơn hàng nào đang được vận chuyển.
        </div>
      ) : (
        <div className="card shadow-lg" style={{ background: '#23272a', borderRadius: 16 }}>
          <div className="card-body">
            <table className="table table-bordered table-striped" style={{ background: '#23272a', color: '#fff', borderRadius: 12 }}>
              <thead className="table-dark" style={{ background: '#212121', color: '#43a047' }}>
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Ngày đặt</th>
                  <th>Trạng thái</th>
                  <th>Thanh toán</th>
                  <th>Tổng tiền</th>
                  <th>Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} style={{ background: '#23272a', color: '#fff' }}>
                    <td>{order.id}</td>
                    <td>{order.customerName}</td>
                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td style={{ color: '#43a047', fontWeight: 600 }}>{order.statusName}</td>
                    <td>{order.methodName}</td>
                    <td style={{ color: '#e53935', fontWeight: 700 }}>{order.totalPrice?.toLocaleString()} ₫</td>
                    <td>
                      <button
                        className="btn btn-outline-warning btn-sm d-flex align-items-center gap-1"
                        style={{ borderRadius: 8, fontWeight: 500 }}
                        onClick={() => navigate(`/order/${order.id}`)}
                      >
                        <FaSearch style={{ color: '#43a047', fontSize: 16 }} /> Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingOrdersList;
