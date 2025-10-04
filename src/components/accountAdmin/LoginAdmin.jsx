import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../../css/LoginAdmin.css"
import API_BASE_URL from '../../config';
import { FaArrowLeft } from 'react-icons/fa';
const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');
  const [rememberPassword, setRememberPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role === 'admin') {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/User/login`,
        { email, password },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      const { token, role, userId } = response.data;

      if (role !== 'admin') {
        setMessage('Chỉ quản trị viên (admin) mới được phép đăng nhập.');
        return;
      }

      setToken(token);
      setMessage(`Đăng nhập thành công! Role: ${role}`);
      console.log('Full response:', response.data);

      localStorage.setItem("adminId", userId);
      localStorage.setItem('jwt-token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('email', email);

      if (onLogin) onLogin();
      navigate('/admin');

    } catch (error) {
      setMessage(`Lỗi: ${error.response?.data?.message || error.message}`);
      console.error('Error details:', error.response);
    }
  };

  return (
    <div className="login-container" style={{ backgroundColor: '#121212', color: '#fff' }}>
      <h2 style={{ color: '#fff' }}>Đăng Nhập</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label style={{ color: '#fff' }}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            style={{ color: '#fff', backgroundColor: '#1e1e1e', borderColor: '#333' }}
          />
        </div>
        <div>
          <label style={{ color: '#fff' }}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="off"
            style={{ color: '#fff', backgroundColor: '#1e1e1e', borderColor: '#333' }}
          />
        </div>
        <div className="remember-checkbox">
          <input
            type="checkbox"
            checked={rememberPassword}
            onChange={() => setRememberPassword(!rememberPassword)}
          />
          <label style={{ color: '#fff' }}>Lưu mật khẩu</label>
        </div>
        <button type="submit" style={{ backgroundColor: '#007bff', color: '#fff' }}>Đăng Nhập</button>
      </form>
        <button className="btn btn-secondary w-100" onClick={() => navigate("/")}>
              <FaArrowLeft className="me-2" /> Quay về trang chủ
            </button>
      {message && (
        <div className={`message ${message.includes('Lỗi') ? 'error' : 'success'}`} style={{ color: message.includes('Lỗi') ? '#d9534f' : '#5cb85c' }}>
          {message}
        </div>
      )}

      {token && (
        <div className="token-container">
          <h4 style={{ color: '#fff' }}>JWT Token:</h4>
          <textarea value={token} readOnly style={{ color: '#fff', backgroundColor: '#1e1e1e', borderColor: '#333' }} />
        </div>
      )}
    </div>
  );
};

export default Login;
