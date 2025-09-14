import React, { useEffect, useState } from "react";


import axios from "axios";

import { useNavigate, Link } from "react-router-dom";
import { FaShippingFast, FaRegTimesCircle, FaCheckCircle, FaUndoAlt, FaTruckMoving, FaSearch } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

import API_BASE_URL from "../../../../config";
const OrdersProcessing = () => {
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
        const processingOrders = (response.data || []).filter(
          (order) => order.statusName === "Đang xử lý"
        );
        setOrders(processingOrders);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy danh sách đơn hàng:", err);
        setLoading(false);
      });
  }, []);

  const cancelOrder = (orderId) => {
    const token = localStorage.getItem("token-user");

    axios
      .put(`${API_BASE_URL}/api/Order/cancel/${orderId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        alert("Đơn hàng đã được hủy.");
        setOrders((prev) => prev.filter((order) => order.id !== orderId));
      })
      .catch((error) => {
        console.error("Lỗi khi hủy đơn hàng:", error);
        alert("Không thể hủy đơn hàng.");
      });
  };

  if (loading) {
  return <div className="text-center mt-5 text-light">Đang tải đơn hàng...</div>;
  }

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4 fw-bold" style={{ color: '#fff', letterSpacing: 1 }}>
        <FaShippingFast className="me-2 navbar-icon" style={{ color: 'inherit', fontSize: 28 }} />
        Đơn hàng đang xử lý
      </h3>

      <div className="mb-3 text-center d-flex justify-content-center flex-wrap gap-2">
        <Link to="/cancelledOrders" className="btn btn-dark d-flex align-items-center gap-1 shadow-sm" style={{ color: '#fff', background: '#23272a', border: 'none', borderRadius: 8, fontWeight: 500 }}>
          <MdCancel style={{ color: 'inherit', fontSize: 20 }} className="navbar-icon" /> Đơn đã hủy
        </Link>
        <Link to="/shippingOrders" className="btn btn-success d-flex align-items-center gap-1 shadow-sm" style={{ color: '#fff', background: '#43a047', border: 'none', borderRadius: 8, fontWeight: 500 }}>
          <FaTruckMoving style={{ color: 'inherit', fontSize: 20 }} className="navbar-icon" /> Đơn đang giao
        </Link>
        <Link to="/deliveredOrders" className="btn btn-warning d-flex align-items-center gap-1 shadow-sm" style={{ color: '#fff', background: '#fbc02d', border: 'none', borderRadius: 8, fontWeight: 500 }}>
          <FaCheckCircle style={{ color: 'inherit', fontSize: 20 }} className="navbar-icon" /> Đơn đã giao
        </Link>
        <Link to="/returnedOrders" className="btn btn-info d-flex align-items-center gap-1 shadow-sm" style={{ color: '#fff', background: '#039be5', border: 'none', borderRadius: 8, fontWeight: 500 }}>
          <FaUndoAlt style={{ color: 'inherit', fontSize: 20 }} className="navbar-icon" /> Đơn hoàn trả
        </Link>
        <Link to="/failedOrders" className="btn btn-danger d-flex align-items-center gap-1 shadow-sm" style={{ color: '#fff', background: '#e53935', border: 'none', borderRadius: 8, fontWeight: 500 }}>
          <FaRegTimesCircle style={{ color: 'inherit', fontSize: 20 }} className="navbar-icon" /> Đơn giao thất bại
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="alert alert-warning text-center fw-bold" style={{ background: '#212121', color: '#fff', border: 'none' }}>
          Bạn chưa có đơn hàng đang xử lý nào.
        </div>
      ) : (
        <div className="row">
          {orders.map((order) => (
            <div className="col-md-6 col-lg-4 mb-4" key={order.id}>
              <div className="card shadow-lg border-0 h-100" style={{ background: '#23272a', color: '#fff', borderRadius: 16 }}>
                <div className="card-body">
                  <h5 className="card-title mb-2" style={{ color: '#43a047', fontWeight: 700 }}>
                    <FaSearch className="me-1 navbar-icon" style={{ color: 'inherit', fontSize: 18 }} /> Mã đơn: {order.id}
                  </h5>
                  <p className="mb-1">
                    <strong style={{ color: '#fff' }}>Khách hàng:</strong> {order.customerName}
                  </p>
                  <p className="mb-1">
                    <strong style={{ color: '#fff' }}>Ngày đặt:</strong> {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                  <p className="mb-1">
                    <strong style={{ color: '#fff' }}>Thanh toán:</strong> {order.methodName}
                  </p>
                  <p className="mb-2">
                    <strong style={{ color: '#fff' }}>Tổng tiền:</strong>
                    <span className="fw-bold ms-1" style={{ color: '#e53935', fontSize: 18 }}>
                      {order.totalPrice?.toLocaleString()} ₫
                    </span>
                  </p>

                  <div className="d-flex justify-content-between mt-3">
                    <button
                      className="btn btn-outline-warning btn-sm d-flex align-items-center gap-1"
                      style={{ borderRadius: 8, fontWeight: 500, color: '#fff', border: '1px solid #43a047' }}
                      onClick={() => navigate(`/order/${order.id}`)}
                    >
                      <FaSearch style={{ color: 'inherit', fontSize: 16 }} className="navbar-icon" /> Xem chi tiết
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                      style={{ borderRadius: 8, fontWeight: 500, color: '#fff', border: '1px solid #e53935' }}
                      onClick={() => cancelOrder(order.id)}
                    >
                      <MdCancel style={{ color: 'inherit', fontSize: 16 }} className="navbar-icon" /> Hủy đơn
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
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

export default OrdersProcessing;
