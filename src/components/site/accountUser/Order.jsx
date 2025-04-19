import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const OrdersList = () => {
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
      .get(`https://localhost:7177/api/Order/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const filteredOrders = (response.data || []).filter(
          (order) => order.statusOrderId !== 4 // 4 là trạng thái "đã hủy"
        );
        setOrders(filteredOrders);
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
      .put(`https://localhost:7177/api/Order/cancel/${orderId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        alert("Đơn hàng đã được hủy thành công.");
        setOrders((prev) => prev.filter((order) => order.id !== orderId));
        navigate("/cancelledOrders");
      })
      .catch((error) => {
        console.error("Lỗi khi hủy đơn hàng:", error);
        alert("Không thể hủy đơn hàng.");
      });
  };

  if (loading) {
    return <div className="text-center mt-5">Đang tải danh sách đơn hàng...</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Danh sách đơn hàng của bạn</h2>
      <div className="mb-3 text-center">
        <Link to="/cancelledOrders" className="btn btn-secondary">
          Xem đơn hàng đã hủy
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="alert alert-info text-center">
          Bạn chưa có đơn hàng nào (ngoại trừ các đơn đã hủy).
        </div>
      ) : (
        <div className="card">
          <div className="card-body">
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Ngày đặt</th>
                  <th>Trạng thái</th>
                  <th>Thanh toán</th>
                  <th>Tổng tiền</th>
                  <th>Chi tiết</th>
                  <th>Hủy đơn</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.customerName}</td>
                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td>{order.statusName}</td>
                    <td>{order.methodName}</td>
                    <td>{order.totalPrice?.toLocaleString()} ₫</td>
                    <td>
                      <button
                        className="btn btn-info btn-sm"
                        onClick={() => navigate(`/order/${order.id}`)}
                      >
                        Xem chi tiết
                      </button>
                    </td>
                    <td>
                      {order.statusName === "Đang xử lý" && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => cancelOrder(order.id)}
                        >
                          Hủy đơn
                        </button>
                      )}
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

export default OrdersList;
