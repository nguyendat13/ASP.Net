// components/accountUser/LoginUser.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom';

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

      const { token, role,userId } = response.data;

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
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc' }}>
      <h2>Đăng Nhập Người Dùng</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 15px', background: '#28a745', color: 'white', border: 'none' }}>
          Đăng Nhập
        </button>

      </form>

      {message && (
        <div style={{ marginTop: '20px', padding: '10px', background: message.includes('Lỗi') ? '#ffdddd' : '#ddffdd' }}>
          {message}
        </div>
      )}

<p style={{ marginTop: '20px' }}>
          Bạn chưa có tài khoản? <Link to="/register-user">Đăng ký ngay</Link>
        </p>

    </div>
  );
};

export default LoginUser;
