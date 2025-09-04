import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaGoogle, FaSpinner } from 'react-icons/fa';

const GoogleSuccess = () => {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const userId = urlParams.get('userId');
  const email = urlParams.get('email');

  useEffect(() => {
    if (token && userId && email) {
      // Save token and user data to localStorage
      localStorage.setItem('token-user', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('email-user', email);

      // Optionally save role if available
      localStorage.setItem('role-user', 'user');

      // Redirect to profile page or home page
      navigate('/user-profile');
    } else {
      navigate('/login-user');
    }
  }, [token, userId, email, navigate]);

  return (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh', background: '#23272a' }}>
      <div className="mb-3">
        <FaGoogle style={{ color: '#43a047', fontSize: 48 }} />
      </div>
      <h3 className="fw-bold mb-2" style={{ color: '#ff9800', letterSpacing: 1 }}>
        Đang xử lý đăng nhập Google...
      </h3>
      <FaSpinner className="fa-spin" style={{ color: '#fbc02d', fontSize: 32 }} />
    </div>
  );
};

export default GoogleSuccess;
