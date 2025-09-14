import React, { useEffect, useState } from "react";


import axios from "axios";

import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaVenusMars, FaArrowLeft } from "react-icons/fa";
import API_BASE_URL from "../../../config";

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
  <div className="container-fluid mt-5" style={{ background: 'var(--background)', borderRadius: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', padding: '32px 0', minHeight: '80vh' }}>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg border-0 rounded-4" style={{ background: 'var(--card)', color: 'var(--foreground)', border: '2px solid var(--primary)' }}>
            <div className="card-body p-5">
              <h3 className="text-center mb-4" style={{ color: 'var(--foreground)', fontWeight: 'bold', textShadow: 'none' }}>
                <FaUser style={{ color: 'inherit', marginRight: '8px' }} /> Thông tin người dùng
              </h3>
              {user ? (
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex align-items-center" style={{ background: 'var(--card)', color: 'var(--foreground)', border: 'none' }}>
                    <FaUser className="me-2" style={{ color: 'inherit' }} />
                    <strong style={{ color: 'var(--primary)' }}>Họ và tên:</strong>&nbsp; {user.fullname}
                  </li>
                  <li className="list-group-item d-flex align-items-center" style={{ background: 'var(--card)', color: 'var(--foreground)', border: 'none' }}>
                    <FaEnvelope className="me-2" style={{ color: 'inherit' }} />
                    <strong style={{ color: 'var(--primary)' }}>Email:</strong>&nbsp; {user.email}
                  </li>
                  <li className="list-group-item d-flex align-items-center" style={{ background: 'var(--card)', color: 'var(--foreground)', border: 'none' }}>
                    <FaPhone className="me-2" style={{ color: 'inherit' }} />
                    <strong style={{ color: 'var(--primary)' }}>Số điện thoại:</strong>&nbsp; {user.phone}
                  </li>
                  <li className="list-group-item d-flex align-items-center" style={{ background: 'var(--card)', color: 'var(--foreground)', border: 'none' }}>
                    <FaVenusMars className="me-2" style={{ color: 'inherit' }} />
<strong style={{ color: 'var(--primary)' }}>Giới tính:</strong>&nbsp; {user.gender}
                  </li>
                </ul>
              ) : (
                <div className="text-center" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Không có thông tin người dùng.</div>
              )}
              <div className="text-center mt-4">
                <button className="btn btn-outline-warning d-flex align-items-center justify-content-center" style={{ color: 'var(--card)', fontWeight: 'bold', border: '2px solid var(--primary)', background: 'var(--primary)' }} onClick={() => navigate("/")}> 
                  <FaArrowLeft style={{ marginRight: '8px', fontSize: '1.2rem', color: 'inherit' }} /> Quay về trang chủ
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
