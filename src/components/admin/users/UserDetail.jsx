import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UserDetail = () => {
  const { id } = useParams(); // Lấy ID người dùng từ URL
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserDetail(id); // Lấy thông tin người dùng khi trang được tải
  }, [id]);
  
  const fetchUserDetail = async (userId) => {
    const token = localStorage.getItem('jwt-token'); // Lấy token từ localStorage

    try {
      const response = await axios.get(`${API_BASE_URL}/api/User/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong header
        },
      });
      setUser(response.data);
    } catch (err) {
      console.error(err);
      setError('Lỗi khi tải thông tin người dùng');
    }
  };

  const handleBack = () => {
    navigate('/admin/users'); // Quay lại trang danh sách người dùng
  };

  if (error) return <p className="text-danger">{error}</p>;

  if (!user) return <p>Đang tải thông tin người dùng...</p>;

  return (
    <div className="container mt-4">
      <h2>Chi tiết Người dùng</h2>

      <div>
        <p><strong>Họ tên:</strong> {user.fullname}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Tên đăng nhập:</strong> {user.username}</p>
        <p><strong>Vai trò:</strong> {user.role}</p>

        <button className="btn btn-secondary" onClick={handleBack}>
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default UserDetail;
