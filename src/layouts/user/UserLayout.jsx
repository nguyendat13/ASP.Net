import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; // nếu có
import Footer from './Footer'; // nếu có

const UserLayout = () => {
  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default UserLayout;
