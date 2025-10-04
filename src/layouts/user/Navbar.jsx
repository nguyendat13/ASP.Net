import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaShoppingCart, FaUser, FaSearch, FaLeaf, FaStore, FaHome } from 'react-icons/fa'; // Thêm icon React
import "../../css/Navbar.css";
import API_BASE_URL from '../../config';
import Notification from '../../components/site/noti/Notification';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // Lưu trữ từ khóa tìm kiếm
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem('email-user');
    setIsLoggedIn(!!email);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/category`);
        if (!response.ok) {
          throw new Error('Lỗi khi lấy danh mục');
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${searchTerm}`); // Điều hướng đến trang tìm kiếm với query
    }
  };

  return (
    <nav className="navbar navbar-expand-lg custom-navbar px-4 shadow-sm">
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          {/* Logo và tên cửa hàng */}
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <FaStore className="navbar-icon" style={{ fontSize: '2rem', marginRight: '8px', color: 'inherit' }} />
            <span style={{ color: 'var(--foreground)', fontWeight: 'bold', fontSize: '1.5rem', letterSpacing: '2px', textShadow: 'none' }}>PHAT DAT STORE</span>
          </Link>
          {/* Toggler cho mobile */}
          <button
            className="navbar-toggler ms-2"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
          <li className="nav-item">
            <Link className="nav-link d-flex align-items-center" to="/" style={{ color: '#fff' }}>
              <FaHome className="navbar-icon" style={{ marginRight: '5px' }} /> Trang chủ
            </Link>
          </li>
          <li className="nav-item dropdown">
            <a href="#" className="nav-link dropdown-toggle"  id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Danh mục
            </a>
            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <li key={category.id}>
                    <Link className="dropdown-item" to={`/categories/${category.id}`}>{category.name}</Link>
                  </li>
                ))
              ) : (
                <li><span className="dropdown-item">Không có danh mục</span></li>
              )}
            </ul>
          </li>

          <li className="nav-item">
            <Link className="nav-link d-flex align-items-center" to="/products" style={{ color: '#fff' }}>
              <FaLeaf className="navbar-icon" style={{ marginRight: '5px' }} /> Sản phẩm
            </Link>
          </li>
          </ul>
          {/* Tìm kiếm */}
          <form className="d-flex mx-auto" style={{ maxWidth: '300px' }} onSubmit={handleSearch}>
            <input
              type="text"
              className="form-control"
              placeholder="Tìm kiếm sản phẩm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ background: 'var(--card)', color: 'var(--foreground)', border: '1px solid var(--primary)' }}
            />
            <button type="submit" className="btn btn-success ms-2" style={{ background: 'var(--primary)', border: 'none' }}>
              <FaSearch className="navbar-icon" />
            </button>
          </form>
          <ul className="navbar-nav ms-auto">
            {!isLoggedIn ? (
              <li className="nav-item">
                <Link className="nav-link d-flex align-items-center" to="/login-user" style={{ fontSize: '1.25rem', color: '#fff' }}>
                  <FaUser className="navbar-icon" style={{ marginRight: '8px', fontSize: '1.5rem' }} /> Đăng nhập
                </Link>
              </li>
            ) : (
              <>
             
                <li className="nav-item d-flex align-items-center">
          {/* Thông báo */}
          <li className="nav-item d-flex align-items-center me-1 "> 
            <Notification /> 
          </li>            
                <Link className="nav-link d-flex align-items-center" to="/carts" style={{ fontSize: '1.25rem', paddingRight: '0', color: '#fff' }}>
                    <FaShoppingCart className="navbar-icon" style={{ fontSize: '1.7rem', marginRight: '8px' }} />
                  </Link>
                  {/* Icon User với dropdown */}
                  <div className="user-nav-item dropdown">
                    <Link 
                      className="nav-link dropdown-toggle d-flex align-items-center" 
                      to="#" 
                      id="userDropdown" 
                      role="button" 
                      data-bs-toggle="dropdown" 
                      aria-expanded="false"
                      style={{ fontSize: '1.25rem', paddingLeft: '20px', color: '#fff' }}
                    >
                      <FaUser className="navbar-icon" style={{ fontSize: '1.5rem' }} />
                    </Link>
                    <ul className="dropdown-menu" aria-labelledby="userDropdown" style={{ right: '0', left: 'auto', position: 'absolute' }}>
                      <li><Link className="dropdown-item" to="/user-profile">Thông tin người dùng</Link></li>
                      <li><Link className="dropdown-item" to="/orders">Đơn hàng</Link></li>
                       <li><Link className="dropdown-item" to="/register-admin">Đăng ký tài khoản admin(demo)</Link></li>

                      <li><hr className="dropdown-divider" /></li>
                      <li><Link to="/logout-user" className="dropdown-item">Đăng xuất</Link></li>
                    </ul>
                  </div>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
