import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaBars, 
  FaTimes,
  FaThLarge,
  FaListUl,
  FaBox,
  FaUsers,
  FaShoppingCart,
  FaImages,
  FaBars as FaMenu,
  FaNewspaper,
  FaTags,
  FaEnvelope,
  FaHistory
} from 'react-icons/fa';
import '../../css/AdminSidebar.css';
const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Kiểm tra đường dẫn hiện tại để thêm class active
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };
 
  return (
    <>
      {/* Nút toggle mobile */}
      <button className="mobile-toggle-btn" onClick={toggleSidebar}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <div className={`admin-sidebar ${isOpen ? 'open' : 'closed'}`}>
        {/* Nút toggle desktop */}
        <button className="desktop-toggle-btn" onClick={toggleSidebar}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        <h3 className="sidebar-title">Admin</h3>
       
        <nav>
          <ul className="sidebar-nav">
            <li>
              <Link to="/admin/dashboard" className={`sidebar-link ${isActive('/admin/dashboard')}`}>
                <FaThLarge className="me-3" /> <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/categories" className={`sidebar-link ${isActive('/admin/categories')}`}>
                <FaListUl className="me-3" /> <span>Danh mục</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/products" className={`sidebar-link ${isActive('/admin/products')}`}>
                <FaBox className="me-3" /> <span>Sản phẩm</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/users" className={`sidebar-link ${isActive('/admin/users')}`}>
                <FaUsers className="me-3" /> <span>Người dùng</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/orders" className={`sidebar-link ${isActive('/admin/orders')}`}>
                <FaShoppingCart className="me-3" /> <span>Đơn hàng</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/banners" className={`sidebar-link ${isActive('/admin/banners')}`}>
                <FaImages className="me-3" /> <span>Banner</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/menus" className={`sidebar-link ${isActive('/admin/menus')}`}>
                <FaMenu className="me-3" /> <span>Menu</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/posts" className={`sidebar-link ${isActive('/admin/posts')}`}>
                <FaNewspaper className="me-3" /> <span>Bài viết</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/topics" className={`sidebar-link ${isActive('/admin/topics')}`}>
                <FaTags className="me-3" /> <span>Chủ đề</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/contacts" className={`sidebar-link ${isActive('/admin/contacts')}`}>
                <FaEnvelope className="me-3" /> <span>Liên hệ</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/logs" className={`sidebar-link ${isActive('/admin/logs')}`}>
                <FaHistory className="me-3" /> <span>Logs</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Overlay khi sidebar mở trên mobile */}
      <div className="sidebar-overlay" onClick={toggleSidebar} />
    </>
  );
};

export default AdminSidebar;
