import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../../config";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [canceledOrders, setCanceledOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token-user");
    if (!userId || !token) return;

    // Fetch notifications
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/notification/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Lỗi khi lấy thông báo");
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error(err);
      }
    };

    // Fetch canceled orders
    const fetchCanceledOrders = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/Order/canceled/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Lỗi khi lấy đơn hàng đã hủy");
        const data = await res.json();
        setCanceledOrders(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchNotifications();
    fetchCanceledOrders();
  }, []);

  const markAsRead = async (id) => {
    const token = localStorage.getItem("token-user");
    try {
      await fetch(`${API_BASE_URL}/api/notification/read/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleClick = (n) => {
    markAsRead(n.id);

    // Kiểm tra xem orderId có trong canceledOrders không
    const isCanceled = canceledOrders.some(o => o.id === n.orderId);
    if (isCanceled) {
      navigate(`/orderCancel/${n.orderId}`);
    } else {
      navigate(`/order/${n.orderId}`);
    }
  };

  return (
    <li className="nav-item dropdown me-1">
      <a
        className="nav-link "
        href="#"
        id="notificationDropdown"
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        style={{ color: "#fff" }}
      >
        <FaBell style={{ fontSize: "1.5rem", color: "#fff" }} />
        {notifications.filter((n) => !n.isRead).length > 0 && (
          <span
            className="badge bg-danger position-relative top-[5px] translate-middle"
            style={{ fontSize: "0.75rem" }}
          >
            {notifications.filter((n) => !n.isRead).length}
          </span>
        )}
      </a>
      <ul
        className="dropdown-menu dropdown-menu-end"
        aria-labelledby="notificationDropdown"
        style={{ minWidth: "320px", backgroundColor: "#23272a", color: "#fff", border: "1px solid #43a047" }}
      >
        {notifications.length === 0 ? (
          <li className="dropdown-item" style={{ color: "#ccc" }}>Không có thông báo</li>
        ) : (
          notifications.map((n) => (
            <li key={n.id}>
              <span
                className={`dropdown-item ${!n.isRead ? "fw-bold" : ""}`}
                onClick={() => handleClick(n)}
                style={{
                  cursor: "pointer",
                  color: !n.isRead ? "#43a047" : "#ccc",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#000")}
                onMouseLeave={(e) => (e.target.style.color = !n.isRead ? "#43a047" : "#ccc")}
              >
                {n.message}
              </span>
            </li>
          ))
        )}
      </ul>
    </li>
  );
};

export default Notification;
