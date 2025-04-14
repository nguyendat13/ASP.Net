import { Link } from "react-router-dom";
import '../../css/AdminNavbar.css'; // Import file CSS

const AdminNavbar = () => (
  <div className="admin-navbar">
    <h2 className="navbar-title">Quản trị hệ thống</h2>
    <Link to="/logout" className="logout-link">Đăng xuất</Link>
  </div>
);

export default AdminNavbar;
