import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import AdminDashboard from './layouts/admin/AdminDashboard.jsx';
import Orders from './components/admin/orders/Orders.jsx';
import Login from './components/accountAdmin/LoginAdmin.jsx';
import Logout from './components/accountAdmin/LogoutAdmin.jsx';
import Dashboard from './components/admin/dashboard/index.jsx';

///admin
import Categories from './components/admin/categories/Categories.jsx';
import CategoryCreate from './components/admin/categories/CategoryCreate.jsx';
import CategoryEdit from './components/admin/categories/CategoryEdit.jsx';
import CategoryDetail from './components/admin/categories/CategoryDetail.jsx';

import Products from './components/admin/products/Products.jsx';
import ProductCreate from './components/admin/products/ProductCreate.jsx';
import ProductEdit from './components/admin/products/ProductEdit.jsx';
import ProductDetail from './components/admin/products/ProductDetail.jsx';

import Users from './components/admin/users/Users.jsx';
import CreateUser from './components/admin/users/UserCreate.jsx';
import EditUser from './components/admin/users/UserEdit.jsx';
import UserDetail from './components/admin/users/UserDetail.jsx';

///nguoidung

import UserLayout from './layouts/user/UserLayout.jsx';
import Home from './components/site/Home.jsx';
import ProductListUI from './components/site/products/ProductList.jsx';
import ProductDetailUI  from './components/site/products/ProductDetail.jsx'   ;
import OrderEdit from './components/admin/orders/OrderEdit.jsx';
import OrderDetail from './components/admin/orders/OrderDetail.jsx';
import LoginUser from './components/site/accountUser/LoginUser.jsx';
import LogoutUser from './components/site/accountUser/LogoutUser.jsx';
import RequireLogin from './components/site/accountUser/RequireLogin .jsx';
import Cart from './components/site/accountUser/Cart.jsx';
import Checkout from './components/site/accountUser/Checkout.jsx';
import OrderDetails from './components/site/accountUser/orders/OrderDetail.jsx';
import RegisterUser from './components/site/accountUser/RegisterUser.jsx';
import CancelledOrders from './components/site/accountUser/orders/CancelledOrders.jsx';
import CategoryProductsPage from './components/site/categories/CategoryPage.jsx';
import UserProfilePage from './components/site/accountUser/UserProfilePage.jsx';
import ShippingOrdersList from './components/site/accountUser/orders/ShippingOrdersList.jsx';
import OrdersProcessing from './components/site/accountUser/orders/Order.jsx';
import DeliveredOrdersList from './components/site/accountUser/orders/DeliveredOrdersList.jsx';
import ReturnedOrdersList from './components/site/accountUser/orders/ReturnedOrdersList.jsx';
import FailedOrdersList from './components/site/accountUser/orders/FailedOrdersList.jsx';
import Topics from './components/admin/topic/TopicList.jsx';
import Posts from './components/admin/posts/PostList.jsx';
import Menus from './components/admin/menus/MenuList.jsx';
import ChatboxUser from './components/site/accountUser/chatbox/ChatboxUser.jsx';
import ChatboxAdmin from './components/site/accountUser/chatbox/ChatboxAdmin.jsx';
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
      <Route path="/register-user" element={<RegisterUser />} />
      <Route path="/login-user" element={<LoginUser />} />
      <Route path="/logout-user" element={<LogoutUser />} />  {/* ✅ Route logout user */}

      {/* Route người dùng */}
      <Route path="/" element={<UserLayout />}>
        <Route index element={<Home />} />
        <Route path="chat" element={<ChatboxUser senderId={13} receiverId={3} />} />
        <Route path="user-profile" element={<UserProfilePage />} />
        <Route path="carts" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="orders" element={<OrdersProcessing />} />
        <Route path="order/:orderId" element={<OrderDetails />} />
        <Route path="cancelledOrders" element={<CancelledOrders />} />  {/* Trang đơn hàng đã hủy */}
        <Route path="shippingOrders" element={<ShippingOrdersList />} />
        <Route path="deliveredOrders" element={<DeliveredOrdersList />} />
        <Route path="returnedOrders" element={<ReturnedOrdersList />} />
        <Route path="failedOrders" element={<FailedOrdersList />} />

        <Route path="products" element={<ProductListUI />} />
        <Route path="products/:id" element={<ProductDetailUI />} />
        <Route path="categories/:categoryId" element={<CategoryProductsPage />} />

      </Route>



          {/* Route cho đăng nhập admin */}
        <Route path="/login" element={<Login onLogin={() => setIsAdmin(true)} />} />
        <Route path="/logout" element={<Logout onLogout={() => setIsAdmin(false)} />} />

        {isAdmin ? (
          <Route path="/admin" element={<AdminDashboard />}>
             <Route path="dashboard" element={<Dashboard />} />
             <Route path="chat" element={<ChatboxAdmin senderId={3} receiverId={13} />} />

             <Route path="categories" element={<Categories />} />
             <Route path="categories/create" element={<CategoryCreate />} />
            <Route path="categories/edit/:id" element={<CategoryEdit />} />
            <Route path="categories/detail/:id" element={<CategoryDetail />} />


            <Route path="products" element={<Products />} />
            <Route path="products/create" element={<ProductCreate />} />
            <Route path="products/edit/:id" element={<ProductEdit />} />
            <Route path="products/detail/:id" element={<ProductDetail />} />

            <Route path="users" element={<Users />} />
            <Route path="users/create" element={<CreateUser/>} />
            <Route path="users/edit/:id" element={<EditUser/>} />
            <Route path="users/detail/:id" element={<UserDetail />} />

            <Route path="orders" element={<Orders />} />
            <Route path="orders/edit/:id" element={<OrderEdit />} />  
            <Route path="orders/detail/:id" element={<OrderDetail />} />


            <Route path="topics" element={<Topics />} />
            <Route path="posts" element={<Posts />} />
            <Route path="menus" element={<Menus />} />

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
