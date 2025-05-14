import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google'; // Import GoogleLogin component
import '../../../css/LoginAdmin.css'; // import file CSS mới
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
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
    <div className="login-container">
      <h2>Đăng Nhập Người Dùng</h2>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">
          Đăng Nhập
        </button>
      </form>

      {message && (
        <div className={`message ${message.includes('Lỗi') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <p>
        Bạn chưa có tài khoản? <Link to="/register-user">Đăng ký ngay</Link>
      </p>

    <div className="google-login-btn" onClick={handleGoogleLogin}>
        <FontAwesomeIcon icon={faGoogle} className="google-icon" />
        Đăng nhập với Google
      </div>

    </div>
  );
};

export default LoginUser;
