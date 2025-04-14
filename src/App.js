import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import AdminDashboard from './layouts/admin/AdminDashboard.jsx';
import Users from './components/admin/users/Users.jsx';
import Orders from './components/admin/orders/Orders.jsx';
import Login from './components/accountAdmin/LoginAdmin.jsx';
import Logout from './components/accountAdmin/LogoutAdmin.jsx';
import Dashboard from './components/admin/dashboard/index.jsx';

import Categories from './components/admin/categories/Categories.jsx';
import CategoryCreate from './components/admin/categories/CategoryCreate.jsx';
import CategoryEdit from './components/admin/categories/CategoryEdit.jsx';
import CategoryDetail from './components/admin/categories/CategoryDetail.jsx';

import Products from './components/admin/products/Products.jsx';
import ProductCreate from './components/admin/products/ProductCreate.jsx';
import ProductEdit from './components/admin/products/ProductEdit.jsx';
import ProductDetail from './components/admin/products/ProductDetail.jsx';


const App = () => {
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('role') === 'admin');

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAdmin(localStorage.getItem('role') === 'admin');
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login onLogin={() => setIsAdmin(true)} />} />
        <Route path="/logout" element={<Logout onLogout={() => setIsAdmin(false)} />} />

        {isAdmin ? (
          <Route path="/admin" element={<AdminDashboard />}>
             <Route path="dashboard" element={<Dashboard />} />

             <Route path="categories" element={<Categories />} />
             <Route path="categories/create" element={<CategoryCreate />} />
            <Route path="categories/edit/:id" element={<CategoryEdit />} />
            <Route path="categories/detail/:id" element={<CategoryDetail />} />


            <Route path="products" element={<Products />} />
            <Route path="/admin/products/create" element={<ProductCreate />} />
            <Route path="/admin/products/edit/:id" element={<ProductEdit />} />
            <Route path="/admin/products/detail/:id" element={<ProductDetail />} />

            <Route path="users" element={<Users />} />
            <Route path="orders" element={<Orders />} />
          </Route>
        ) : (
          <Route path="/admin/*" element={<Navigate to="/login" />} />
        )}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
