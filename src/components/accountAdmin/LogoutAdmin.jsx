import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = ({ onLogout }) => {
  const navigate = useNavigate();

  useEffect(() => {
     // Xóa thông tin người dùng khỏi localStorage
     localStorage.removeItem('jwt-token');
     localStorage.removeItem('role');
     localStorage.removeItem('email');
 
    if (onLogout) onLogout();
    // Thông báo đăng xuất
    // Chuyển hướng về trang đăng nhập
    navigate('/login');
  }, [navigate, onLogout]);

  return null; // Không cần render gì
};

export default Logout;
