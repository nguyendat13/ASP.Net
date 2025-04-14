import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';
import { Outlet } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div style={{ display: 'flex' }}>
      <AdminSidebar />
      <div style={{ flex: 1 }}>
        <AdminNavbar />
        <div id="admin-content" style={{ padding: '20px' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
