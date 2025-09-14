import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaVenusMars, FaArrowLeft } from "react-icons/fa";

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
      .get(`${API_BASE_URL}/api/User/${userId}`, {
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

  return (
    <div className="container-fluid mt-5" style={{ background: 'linear-gradient(120deg, #23272b 70%, #4CAF50 100%)', borderRadius: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', padding: '32px 0', minHeight: '80vh' }}>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg border-0 rounded-4" style={{ background: '#23272b', color: '#FFD700', border: '2px solid #FFA500' }}>
            <div className="card-body p-5">
              <h3 className="text-center mb-4" style={{ color: '#FFD700', fontWeight: 'bold', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                <FaUser style={{ color: '#FFA500', marginRight: '8px' }} /> Thông tin người dùng
              </h3>
              {user ? (
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex align-items-center" style={{ background: '#23272b', color: '#FFD700', border: 'none' }}>
                    <FaUser className="me-2" style={{ color: '#FFA500' }} />
                    <strong style={{ color: '#FFA500' }}>Họ và tên:</strong>&nbsp; {user.fullname}
                  </li>
                  <li className="list-group-item d-flex align-items-center" style={{ background: '#23272b', color: '#FFD700', border: 'none' }}>
                    <FaEnvelope className="me-2" style={{ color: '#FFA500' }} />
                    <strong style={{ color: '#FFA500' }}>Email:</strong>&nbsp; {user.email}
                  </li>
                  <li className="list-group-item d-flex align-items-center" style={{ background: '#23272b', color: '#FFD700', border: 'none' }}>
                    <FaPhone className="me-2" style={{ color: '#FFA500' }} />
                    <strong style={{ color: '#FFA500' }}>Số điện thoại:</strong>&nbsp; {user.phone}
                  </li>
                  <li className="list-group-item d-flex align-items-center" style={{ background: '#23272b', color: '#FFD700', border: 'none' }}>
                    <FaVenusMars className="me-2" style={{ color: '#FFA500' }} />
                    <strong style={{ color: '#FFA500' }}>Giới tính:</strong>&nbsp; {user.gender === "Male" ? "Nam" : user.gender === "Female" ? "Nữ" : "Khác"}
                  </li>
                </ul>
              ) : (
                <div className="text-center" style={{ color: '#FFA500', fontWeight: 'bold' }}>Không có thông tin người dùng.</div>
              )}
              <div className="text-center mt-4">
                <button className="btn btn-outline-warning d-flex align-items-center justify-content-center" style={{ color: '#23272b', fontWeight: 'bold', border: '2px solid #FFA500', background: '#FFD700' }} onClick={() => navigate("/")}>
                  <FaArrowLeft style={{ marginRight: '8px', fontSize: '1.2rem' }} /> Quay về trang chủ
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
