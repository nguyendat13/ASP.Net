import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const RegisterUser = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    gender: '',
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'https://localhost:7177/api/User/register',
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      setMessage('Đăng ký thành công!');
      setTimeout(() => {
        navigate('/login-user'); // điều hướng sang trang đăng nhập
      }, 1500);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Đã xảy ra lỗi!';
      setMessage(`Lỗi: ${errorMsg}`);
    }
  };

  return (
    <div style={{ maxWidth: '450px', margin: '50px auto', padding: '20px', border: '1px solid #ccc' }}>
      <h2>Đăng Ký Người Dùng</h2>
      <form onSubmit={handleSubmit}>
        {['fullname', 'username', 'email', 'password', 'phone'].map((field) => (
          <div key={field} style={{ marginBottom: '15px' }}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <input
              type={field === 'password' ? 'password' : 'text'}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px' }}
              required
            />
          </div>
        ))}

        <div style={{ marginBottom: '15px' }}>
          <label>Giới tính:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px' }}
            required
          >
            <option value="">-- Chọn giới tính --</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
        </div>

        <button type="submit" style={{ padding: '10px 15px', background: '#007bff', color: 'white', border: 'none' }}>
          Đăng Ký
        </button>
      </form>

      {message && (
        <div style={{ marginTop: '20px', padding: '10px', background: message.includes('Lỗi') ? '#ffdddd' : '#ddffdd' }}>
          {message}
        </div>
      )}
      <p style={{ marginTop: '20px' }}>
  Bạn đã có tài khoản? <Link to="/login-user">Đăng nhập ngay</Link>
</p>

    </div>
  );
};

export default RegisterUser;
