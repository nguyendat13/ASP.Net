import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../../css/LoginAdmin.css"
import API_BASE_URL from '../../config';
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
        `${API_BASE_URL}/User/login`,
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
    <div className="login-container">
      <h2>Đăng Nhập</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className="remember-checkbox">
          <input
            type="checkbox"
            checked={rememberPassword}
            onChange={() => setRememberPassword(!rememberPassword)}
          />
          <label>Lưu mật khẩu</label>
        </div>
        <button type="submit">Đăng Nhập</button>
      </form>

      {message && (
        <div className={`message ${message.includes('Lỗi') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      {token && (
        <div className="token-container">
          <h4>JWT Token:</h4>
          <textarea value={token} readOnly />
        </div>
      )}
    </div>
  );
};

export default Login;
