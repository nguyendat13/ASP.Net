import React, { useState ,useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({onLogin}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');
  const [rememberPassword, setRememberPassword] = useState(false); // State để kiểm tra xem người dùng có muốn lưu mật khẩu hay không

  const navigate = useNavigate();
 // ✅ Nếu đã đăng nhập thì không được truy cập trang login nữa
 useEffect(() => {
  const role = localStorage.getItem('role');
  if (role === 'admin') {
    navigate('/admin');
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
  
      const { token, role } = response.data;
  
      if (role !== 'admin') {
        setMessage('Chỉ quản trị viên (admin) mới được phép đăng nhập.');
        return;
      }
  
      setToken(token);
      setMessage(`Đăng nhập thành công! Role: ${role}`);
      console.log('Full response:', response.data);
  
      // Lưu token nếu muốn sử dụng sau
      localStorage.setItem('jwt-token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('email', email);

      // Gọi hàm cập nhật state ở App
      if (onLogin) onLogin();
      navigate('/admin');


    } catch (error) {
      setMessage(`Lỗi: ${error.response?.data?.message || error.message}`);
      console.error('Error details:', error.response);
    }
  };
  

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc' }}>
      <h2>Đăng Nhập</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
            autoComplete="off" // Tắt tự động điền cho email

          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
            autoComplete="off" // Tắt tự động điền cho password

          />
          {/* Checkbox để chọn có lưu mật khẩu không */}
        <div style={{ marginBottom: '15px' }}>
          <label>
            <input
              type="checkbox"
              checked={rememberPassword}
              onChange={() => setRememberPassword(!rememberPassword)}
            />
            Lưu mật khẩu
          </label>
        </div>
        </div>
        <button type="submit" style={{ padding: '10px 15px', background: '#007bff', color: 'white', border: 'none' }}>
          Đăng Nhập
        </button>
      </form>

      {message && (
        <div style={{ marginTop: '20px', padding: '10px', background: message.includes('Lỗi') ? '#ffdddd' : '#ddffdd' }}>
          {message}
        </div>
      )}

      {token && (
        <div style={{ marginTop: '20px', wordBreak: 'break-all' }}>
          <h4>JWT Token:</h4>
          <textarea 
            value={token} 
            readOnly 
            style={{ width: '100%', height: '100px', fontFamily: 'monospace' }}
          />
        </div>
      )}
    </div>
  );
};

export default Login;