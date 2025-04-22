import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ReturnedOrdersList = () => {
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
        const returnedOrders = (response.data || []).filter(
          (order) => order.statusName === "Hoàn trả"
        );
        setOrders(returnedOrders);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy đơn hàng hoàn trả:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Đang tải đơn hàng hoàn trả...</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Đơn hàng hoàn trả</h2>
      <button className="btn btn-secondary mt-4" onClick={() => navigate("/orders")}>
        🡸 Quay lại trang chính
      </button>
      {orders.length === 0 ? (
        <div className="alert alert-info text-center">
          Hiện không có đơn hàng nào đã hoàn trả.
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

export default ReturnedOrdersList;
