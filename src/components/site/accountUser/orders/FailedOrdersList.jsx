import React, { useEffect, useState } from "react";


import axios from "axios";

import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaRegTimesCircle, FaSearch } from "react-icons/fa";

import API_BASE_URL from '../../../../config';
const FailedOrdersList = () => {
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
        const failedOrders = (response.data || []).filter(
          (order) => order.statusName === "Giao thất bại"
        );
        setOrders(failedOrders);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy đơn hàng giao thất bại:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
  return <div className="text-center mt-5 text-light">Đang tải đơn hàng giao thất bại...</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 fw-bold" style={{ color: '#e53935', letterSpacing: 1 }}>
        <FaRegTimesCircle className="me-2" style={{ color: '#212121', fontSize: 28 }} />
        Đơn hàng giao thất bại
      </h2>
      <div className="d-flex justify-content-start mb-3">
        <button
          className="btn btn-dark d-flex align-items-center gap-2 shadow-sm"
          style={{ borderRadius: 8, fontWeight: 500, background: '#23272a', color: '#e53935', border: 'none' }}
          onClick={() => navigate("/orders")}
        >
          <FaArrowLeft style={{ fontSize: '1.3rem', color: '#e53935' }} />
          Quay lại trang chính
        </button>
      </div>
      {orders.length === 0 ? (
        <div className="alert alert-info text-center fw-bold" style={{ background: '#212121', color: '#e53935', border: 'none' }}>
          Hiện không có đơn hàng nào giao thất bại.
        </div>
      ) : (
        <div className="card shadow-lg" style={{ background: '#23272a', borderRadius: 16 }}>
          <div className="card-body">
            <table className="table table-bordered table-striped" style={{ background: '#23272a', color: '#fff', borderRadius: 12 }}>
              <thead className="table-dark" style={{ background: '#212121', color: '#e53935' }}>
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
                    <td style={{ color: '#e53935', fontWeight: 600 }}>{order.statusName}</td>
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

export default FailedOrdersList;
