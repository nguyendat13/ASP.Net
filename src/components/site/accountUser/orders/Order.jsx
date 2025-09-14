import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaShippingFast, FaRegTimesCircle, FaCheckCircle, FaUndoAlt, FaTruckMoving, FaSearch } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

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
      <h3 className="text-center mb-4 fw-bold" style={{ color: '#43a047', letterSpacing: 1 }}>
        <FaShippingFast className="me-2" style={{ color: '#ff9800', fontSize: 28 }} />
        Đơn hàng đang xử lý
      </h3>

      <div className="mb-3 text-center d-flex justify-content-center flex-wrap gap-2">
        <Link to="/cancelledOrders" className="btn btn-dark d-flex align-items-center gap-1 shadow-sm">
          <MdCancel style={{ color: '#e53935', fontSize: 20 }} /> Đơn đã hủy
        </Link>
        <Link to="/shippingOrders" className="btn btn-success d-flex align-items-center gap-1 shadow-sm">
          <FaTruckMoving style={{ color: '#43a047', fontSize: 20 }} /> Đơn đang giao
        </Link>
        <Link to="/deliveredOrders" className="btn btn-warning d-flex align-items-center gap-1 shadow-sm">
          <FaCheckCircle style={{ color: '#fbc02d', fontSize: 20 }} /> Đơn đã giao
        </Link>
        <Link to="/returnedOrders" className="btn btn-info d-flex align-items-center gap-1 shadow-sm">
          <FaUndoAlt style={{ color: '#039be5', fontSize: 20 }} /> Đơn hoàn trả
        </Link>
        <Link to="/failedOrders" className="btn btn-danger d-flex align-items-center gap-1 shadow-sm">
          <FaRegTimesCircle style={{ color: '#212121', fontSize: 20 }} /> Đơn giao thất bại
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="alert alert-warning text-center fw-bold" style={{ background: '#212121', color: '#ff9800', border: 'none' }}>
          Bạn chưa có đơn hàng đang xử lý nào.
        </div>
      ) : (
        <div className="row">
          {orders.map((order) => (
            <div className="col-md-6 col-lg-4 mb-4" key={order.id}>
              <div className="card shadow-lg border-0 h-100" style={{ background: '#23272a', color: '#fff', borderRadius: 16 }}>
                <div className="card-body">
                  <h5 className="card-title mb-2" style={{ color: '#43a047', fontWeight: 700 }}>
                    <FaSearch className="me-1" style={{ color: '#ff9800', fontSize: 18 }} /> Mã đơn: {order.id}
                  </h5>
                  <p className="mb-1">
                    <strong style={{ color: '#fbc02d' }}>Khách hàng:</strong> {order.customerName}
                  </p>
                  <p className="mb-1">
                    <strong style={{ color: '#fbc02d' }}>Ngày đặt:</strong> {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                  <p className="mb-1">
                    <strong style={{ color: '#fbc02d' }}>Thanh toán:</strong> {order.methodName}
                  </p>
                  <p className="mb-2">
                    <strong style={{ color: '#fbc02d' }}>Tổng tiền:</strong>
                    <span className="fw-bold ms-1" style={{ color: '#e53935', fontSize: 18 }}>
                      {order.totalPrice?.toLocaleString()} ₫
                    </span>
                  </p>

                  <div className="d-flex justify-content-between mt-3">
                    <button
                      className="btn btn-outline-warning btn-sm d-flex align-items-center gap-1"
                      style={{ borderRadius: 8, fontWeight: 500 }}
                      onClick={() => navigate(`/order/${order.id}`)}
                    >
                      <FaSearch style={{ color: '#43a047', fontSize: 16 }} /> Xem chi tiết
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                      style={{ borderRadius: 8, fontWeight: 500 }}
                      onClick={() => cancelOrder(order.id)}
                    >
                      <MdCancel style={{ color: '#e53935', fontSize: 16 }} /> Hủy đơn
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersProcessing;
