import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaVenusMars } from "react-icons/fa";

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token-user");

  useEffect(() => {
    if (!userId || !token) {
      setError("Vui lòng đăng nhập để xem thông tin người dùng.");
      setLoading(false);
      return;
    }

    axios
      .get(`https://localhost:7177/api/User/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUser(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy thông tin người dùng:", err);
        setError("Không thể tải thông tin người dùng.");
        setLoading(false);
      });
  }, [userId, token]);

  if (loading) {
    return <div className="text-center mt-5">Đang tải thông tin người dùng...</div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center mt-4">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body p-5">
              <h3 className="text-center mb-4">👤 Thông tin người dùng</h3>

              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex align-items-center">
                  <FaUser className="me-2 text-primary" />
                  <strong>Họ và tên:</strong>&nbsp; {user.fullname}
                </li>
                <li className="list-group-item d-flex align-items-center">
                  <FaEnvelope className="me-2 text-primary" />
                  <strong>Email:</strong>&nbsp; {user.email}
                </li>
                <li className="list-group-item d-flex align-items-center">
                  <FaPhone className="me-2 text-primary" />
                  <strong>Số điện thoại:</strong>&nbsp; {user.phone}
                </li>
                <li className="list-group-item d-flex align-items-center">
                  <FaVenusMars className="me-2 text-primary" />
                  <strong>Giới tính:</strong>&nbsp; {user.gender === "Male" ? "Nam" : user.gender === "Female" ? "Nữ" : "Khác"}
                </li>
              </ul>

              <div className="text-center mt-4">
                <button className="btn btn-outline-primary" onClick={() => navigate("/")}>
                  ⬅️ Quay về trang chủ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
