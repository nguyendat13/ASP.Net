import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaShoppingCart, FaUser, FaSearch, FaLeaf, FaStore, FaHome } from 'react-icons/fa'; // Thêm icon React
import "../../css/Navbar.css";

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
        const response = await fetch(`${API_BASE_URL}/category');
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
            <FaStore style={{ color: '#FFA500', fontSize: '2rem', marginRight: '8px' }} />
            <span style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '1.5rem', letterSpacing: '2px' }}>PHAT DAT STORE</span>
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
            <Link className="nav-link d-flex align-items-center" to="/">
              <FaHome style={{ color: '#4CAF50', marginRight: '5px' }} /> Trang chủ
            </Link>
          </li>
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
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
            <Link className="nav-link d-flex align-items-center" to="/products">
              <FaLeaf style={{ color: '#4CAF50', marginRight: '5px' }} /> Sản phẩm
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
              style={{ background: '#23272b', color: '#FFD700', border: '1px solid #FFA500' }}
            />
            <button type="submit" className="btn btn-success ms-2" style={{ background: '#4CAF50', border: 'none' }}>
              <FaSearch style={{ color: '#FFD700' }} />
            </button>
          </form>
          <ul className="navbar-nav ms-auto">
            {!isLoggedIn ? (
              <li className="nav-item">
                <Link className="nav-link d-flex align-items-center" to="/login-user" style={{ fontSize: '1.25rem' }}>
                  <FaUser style={{ color: '#FFA500', marginRight: '8px', fontSize: '1.5rem' }} /> Đăng nhập
                </Link>
              </li>
            ) : (
              <>
                <li className="nav-item d-flex align-items-center">
                  <Link className="nav-link d-flex align-items-center" to="/carts" style={{ fontSize: '1.25rem', paddingRight: '0' }}>
                    <FaShoppingCart style={{ color: '#FFD700', fontSize: '1.7rem', marginRight: '8px' }} />
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
                      style={{ fontSize: '1.25rem', paddingLeft: '20px' }}
                    >
                      <FaUser style={{ color: '#FFA500', fontSize: '1.5rem' }} />
                    </Link>
                    <ul className="dropdown-menu" aria-labelledby="userDropdown" style={{ right: '0', left: 'auto', position: 'absolute' }}>
                      <li><Link className="dropdown-item" to="/user-profile">Thông tin người dùng</Link></li>
                      <li><Link className="dropdown-item" to="/orders">Đơn hàng</Link></li>
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
