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
    <div style={{ minHeight: '100vh', width: '100vw', background: '#181a1b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="register-container d-flex flex-column align-items-center justify-content-center" style={{ maxWidth: '450px', width: '100%', background: '#23272a', borderRadius: 16, boxShadow: '0 0 16px #212121', padding: '32px 24px' }}>
        <h2 className="fw-bold mb-4 d-flex align-items-center gap-2" style={{ color: '#43a047', letterSpacing: 1 }}>
          Đăng Ký Người Dùng
        </h2>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          {['fullname', 'username', 'email', 'password', 'phone'].map((field) => (
            <div key={field} className="mb-3">
              <label className="fw-bold" style={{ color: '#fbc02d' }}>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
              <input
                type={field === 'password' ? 'password' : 'text'}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="form-control"
                style={{ background: '#212121', color: '#fff', border: '1px solid #43a047', borderRadius: 8 }}
                required
              />
            </div>
          ))}

          <div className="mb-3">
            <label className="fw-bold" style={{ color: '#fbc02d' }}>Giới tính:</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="form-select"
              style={{ background: '#212121', color: '#fff', border: '1px solid #43a047', borderRadius: 8 }}
              required
            >
              <option value="">-- Chọn giới tính --</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          <button type="submit" className="btn btn-success w-100 d-flex align-items-center justify-content-center gap-2" style={{ borderRadius: 8, fontWeight: 500, background: '#43a047', color: '#fff', border: 'none', padding: '10px 0' }}>
            Đăng Ký
          </button>
        </form>

        {message && (
          <div className="mt-4" style={{ padding: '10px', background: message.includes('Lỗi') ? '#e53935' : '#43a047', color: '#fff', borderRadius: 8, fontWeight: 600 }}>
            {message}
          </div>
        )}
        <p className="mt-4" style={{ color: '#fff' }}>
          Bạn đã có tài khoản? <Link to="/login-user" style={{ color: '#ff9800', fontWeight: 600 }}>Đăng nhập ngay</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterUser;
