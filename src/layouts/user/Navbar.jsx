import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaShoppingCart, FaUser, FaSearch } from 'react-icons/fa';  // Import biểu tượng tìm kiếm
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
        const response = await fetch('https://localhost:7177/api/category');
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
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 shadow-sm">
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/">Trang chủ</Link>
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
            <Link className="nav-link" to="/products">Sản phẩm</Link>
          </li>
        </ul>

        {/* Logo */}
        <Link className="navbar-brand mx-auto" to="/">
          PHAT DAT STORE
        </Link>

        {/* Tìm kiếm */}
        <form className="d-flex ms-3" onSubmit={handleSearch}>
              <input
                type="text"
                className="form-control"
                placeholder="Tìm kiếm sản phẩm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="btn btn-outline-light ms-2">
                <FaSearch />
              </button>
            </form>

        <ul className="navbar-nav ms-auto">
          {!isLoggedIn ? (
            <li className="nav-item">
              <Link className="nav-link" to="/login-user">Đăng nhập</Link>
            </li>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/carts">
                  <FaShoppingCart /> Giỏ hàng
                </Link>
              </li>

              {/* Icon User với dropdown */}
              <li className="user-nav-item dropdown">
                <Link 
                  className="nav-link dropdown-toggle" 
                  to="#" 
                  id="userDropdown" 
                  role="button" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false">
                  <FaUser /> {/* Icon người dùng */}
                </Link>
                <ul className="dropdown-menu" aria-labelledby="userDropdown" style={{ right: '0', left: 'auto', position: 'absolute' }}>
                  <li><Link className="dropdown-item" to="/user-profile">Thông tin người dùng</Link></li>
                  <li><Link className="dropdown-item" to="/orders">Đơn hàng</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><Link to="/logout-user" className="dropdown-item">Đăng xuất</Link></li>
                </ul>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
