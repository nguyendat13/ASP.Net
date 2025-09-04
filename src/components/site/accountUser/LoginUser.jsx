import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google'; // Import GoogleLogin component
import '../../../css/LoginAdmin.css'; // import file CSS mới
import { FaGoogle, FaSignInAlt } from 'react-icons/fa';
const LoginUser = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');
  
  const navigate = useNavigate();

  // ✅ Nếu đã đăng nhập là user thì chuyển về trang chủ
  useEffect(() => {
    const role = localStorage.getItem('role-user');
    if (role === 'user') {
      navigate('/');
    }
  }, []);
const handleGoogleLogin = () => {
    window.location.href = "https://localhost:7177/api/ExternalLogin/google";
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'https://localhost:7177/api/User/login',
        { email, password },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      const { token, role, userId } = response.data;

      if (role !== 'user') {
        setMessage('Chỉ người dùng (user) mới được phép đăng nhập.');
        return;
      }

      setToken(token);
      setMessage(`Đăng nhập thành công!`);
      localStorage.setItem("userId", userId); // lưu thêm user id
      localStorage.setItem('token-user', token);
      localStorage.setItem('role-user', role);
      localStorage.setItem('email-user', email);

      if (onLogin) onLogin();
      navigate('/');
    } catch (error) {
      setMessage(`Lỗi: ${error.response?.data?.message || error.message}`);
    }
  };

  

  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: '#181a1b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="login-container d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh', background: '#23272a', borderRadius: 16, boxShadow: '0 0 16px #212121' }}>
        <h2 className="fw-bold mb-4 d-flex align-items-center gap-2" style={{ color: '#43a047', letterSpacing: 1 }}>
          <FaSignInAlt style={{ color: '#ff9800', fontSize: 32 }} /> Đăng Nhập Người Dùng
        </h2>
        <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: 400 }}>
          <div className="input-group mb-3">
            <label className="fw-bold" style={{ color: '#fbc02d' }}>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              style={{ background: '#212121', color: '#fff', border: '1px solid #43a047', borderRadius: 8 }}
            />
          </div>
          <div className="input-group mb-3">
            <label className="fw-bold" style={{ color: '#fbc02d' }}>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              style={{ background: '#212121', color: '#fff', border: '1px solid #43a047', borderRadius: 8 }}
            />
          </div>
          <button type="submit" className="btn btn-success w-100 d-flex align-items-center justify-content-center gap-2" style={{ borderRadius: 8, fontWeight: 500, background: '#43a047', color: '#fff', border: 'none' }}>
            <FaSignInAlt style={{ color: '#fbc02d', fontSize: 18 }} /> Đăng Nhập
          </button>
        </form>

        {message && (
          <div className={`message mt-3 ${message.includes('Lỗi') ? 'error' : 'success'}`} style={{ color: message.includes('Lỗi') ? '#e53935' : '#43a047', fontWeight: 600 }}>
            {message}
          </div>
        )}

        <p className="mt-3" style={{ color: '#fff' }}>
          Bạn chưa có tài khoản? <Link to="/register-user" style={{ color: '#ff9800', fontWeight: 600 }}>Đăng ký ngay</Link>
        </p>

        <div className="google-login-btn mt-3 w-100 d-flex align-items-center justify-content-center gap-2" onClick={handleGoogleLogin} style={{ cursor: 'pointer', background: '#fff', color: '#43a047', borderRadius: 8, fontWeight: 500, padding: '10px 0', maxWidth: 400 }}>
          <FaGoogle style={{ color: '#e53935', fontSize: 22 }} /> Đăng nhập với Google
        </div>
      </div>
    </div>
  );
};

export default LoginUser;
