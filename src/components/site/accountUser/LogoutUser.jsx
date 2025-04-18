import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutUser = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Xóa dữ liệu người dùng
    localStorage.removeItem('token-user');
    localStorage.removeItem('role-user');
    localStorage.removeItem('email-user');
    localStorage.removeItem("userId"); // lưu thêm user id

    // Chuyển về trang chủ
    navigate('/login-user');
  }, [navigate]);

  return null; // Không render gì
};

export default LogoutUser;
