import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const RequireLogin = ({ children }) => {
  const token = localStorage.getItem('jwt-token');
  if (!token) {
    toast.warn('⚠️ Bạn cần đăng nhập để truy cập trang này!');
    return <Navigate to="/login-user" replace />;
  }
  return children;
};

export default RequireLogin;
