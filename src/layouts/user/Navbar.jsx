import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem('email-user');
    setIsLoggedIn(!!email); // Nếu có email thì xem như đã đăng nhập
  }, []);

 

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">MyShop</Link>
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
          <li className="nav-item">
            <Link className="nav-link" to="/products">Sản phẩm</Link>
          </li>
          <li className="nav-item">
    <Link className="nav-link" to="/carts">
      <FaShoppingCart /> Giỏ hàng
    </Link>
  </li>
  <li className="nav-item">
            <Link className="nav-link" to="/orders">Đơn hàng</Link>
          </li>
        </ul>
        <ul className="navbar-nav">
          {!isLoggedIn ? (
            <li className="nav-item">
              <Link className="nav-link" to="/login-user">Đăng nhập</Link>
            </li>
          ) : (
            <li className="nav-item">
              <Link to="/logout-user"  className="nav-link btn btn-link text-white" >
                Đăng xuất
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
