import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
    <div>
      <h3>Đang xử lý đăng nhập...</h3>
    </div>
  );
};

export default GoogleSuccess;
