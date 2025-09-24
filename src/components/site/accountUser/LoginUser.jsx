import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaGoogle, FaSignInAlt, FaUnlockAlt } from 'react-icons/fa';
import API_BASE_URL from '../../../config';
import '../../../css/LoginAdmin.css'; // ✅ import css
const LoginUser = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [message, setMessage] = useState('');
  const [showForgotForm, setShowForgotForm] = useState(false); // ✅ state để show form
  const [token, setToken] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role-user');
    if (role === 'user') {
      navigate('/');
    }
  }, []);

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/api/ExternalLogin/google`;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/User/login`, { email, password }, { headers: { 'Content-Type': 'application/json' } });
      const { token, role, userId } = response.data;

      if (role !== 'user' && role == 'admin') {
        setMessage('Chỉ người dùng (user) mới được phép đăng nhập.');
        navigate('/login');
        return;
      }

      setToken(token);
      localStorage.setItem("userId", userId);
      localStorage.setItem('token-user', token);
      localStorage.setItem('role-user', role);
      localStorage.setItem('email-user', email);

      if (onLogin) onLogin();
      navigate('/');
    } catch (error) {
      setMessage(`Lỗi: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      setMessage("Vui lòng nhập email.");
      return;
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/api/User/forgot-password`, { email: forgotEmail });
      setMessage(response.data.message);
      setForgotEmail('');
      setShowForgotForm(false); // ẩn form sau khi gửi thành công
    } catch (error) {
      setMessage(`Lỗi: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: '#181a1b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="login-container d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh', background: '#23272a', borderRadius: 16, boxShadow: '0 0 16px #212121', padding: 20 }}>
        <h2 className="fw-bold mb-4 d-flex align-items-center gap-2" style={{ color: '#fff', letterSpacing: 1 }}>
          <FaSignInAlt style={{ color: '#fff', fontSize: 32 }} /> Đăng Nhập Người Dùng
        </h2>

        <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: 400 }}>
          <div className="input-group mb-3">
            <label className="fw-bold" style={{ color: '#fff' }}>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              style={{ background: '#212121', color: '#fff', border: '1px solid #43a047', borderRadius: 8 }}
            />
          </div>
          <div className="input-group mb-3">
            <label className="fw-bold" style={{ color: '#fff' }}>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              style={{ background: '#212121', color: '#fff', border: '1px solid #43a047', borderRadius: 8 }}
            />
          </div>
          <button type="submit" className="btn btn-success w-100 d-flex align-items-center justify-content-center gap-2 mb-2" style={{ borderRadius: 8, fontWeight: 500 }}>
            <FaSignInAlt style={{ color: '#fbc02d', fontSize: 18 }} /> Đăng Nhập
          </button>
        </form>

        {/* Nút hiện form quên mật khẩu */}
        <button
          onClick={() => setShowForgotForm(!showForgotForm)}
          className="btn btn-link text-warning mb-2"
          style={{ textDecoration: 'underline' }}
        >
          Quên mật khẩu?
        </button>

        {/* Form quên mật khẩu */}
        {showForgotForm && (
          <div className="forgot-password mt-2 w-100" style={{ maxWidth: 400 }}>
            <div className="d-flex gap-2">
                  <input
              type="email"
              placeholder="Nhập email của bạn..."
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="form-control forgot-email-input"
              style={{ background: '#212121', color: '#fff', border: '1px solid #fbc02d', borderRadius: 8 }}
            />



              <button
                onClick={handleForgotPassword}
                className="btn btn-warning d-flex align-items-center gap-1"
                style={{ borderRadius: 8, fontWeight: 500 }}
              >
                <FaUnlockAlt /> Gửi
              </button>
            </div>
          </div>
        )}

        {message && (
          <div className={`message mt-3`} style={{ color: message.includes('Lỗi') ? '#e53935' : '#43a047', fontWeight: 600 }}>
            {message}
          </div>
        )}

        <p className="mt-3" style={{ color: '#fff' }}>
          Bạn chưa có tài khoản? <Link to="/register-user" style={{ color: '#43a047', fontWeight: 600 }}>Đăng ký ngay</Link>
        </p>

        <div className="google-login-btn mt-3 w-100 d-flex align-items-center justify-content-center gap-2" onClick={handleGoogleLogin} style={{ cursor: 'pointer', background: '#fff', color: '#43a047', borderRadius: 8, fontWeight: 500, padding: '10px 0', maxWidth: 400 }}>
          <FaGoogle style={{ color: '#e53935', fontSize: 22 }} /> Đăng nhập với Google
        </div>
      </div>
    </div>
  );
};

export default LoginUser;
