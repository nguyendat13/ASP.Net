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
import TopicCreate from './components/admin/topic/TopicCreate.jsx';
import TopicDetail from './components/admin/topic/TopicDetail.jsx';
import TopicEdit from './components/admin/topic/TopicEdit.jsx';
import TopicTrash from './components/admin/topic/TopicTrash.jsx';
import PostCreate from './components/admin/posts/PostCreate.jsx';
import PostEdit from './components/admin/posts/PostEdit.jsx';
import PostDetail from './components/admin/posts/PostDetail.jsx';
import PostTrash from './components/admin/posts/PostTrash.jsx';
import ContactList from './components/admin/contacts/ContactList.jsx';
import ContactTrash from './components/admin/contacts/ContactTrash.jsx';
import ContactDetail from './components/admin/contacts/ContactDetail.jsx';
import BannerList from './components/admin/banners/BannerList.jsx';
import BannersCreate from './components/admin/banners/BannerCreate.jsx';
import BannersEdit from './components/admin/banners/BannerEdit.jsx';
import BannersDetail from './components/admin/banners/BannerDetail.jsx';
import SearchPage from './components/site/products/ProductSearch.jsx';
import GoogleSuccess from './components/site/accountUser/loginGoogle/GoogleSuccess.jsx';
import PaymentSuccess from './components/site/accountUser/PaymentSuccess.jsx';
import PaymentFail from './components/site/accountUser/PaymentFail.jsx';
import PaymentCallback from './components/site/accountUser/PaymentCallback.jsx';
import ChatboxAI from './components/site/accountUser/chatbox/ChatBox.jsx';
import RegisterAdmin from './components/accountAdmin/RegisterAdmin.jsx';
import AdminLogs from './components/admin/logs/AdminLogs.jsx';
import PostsUser from './components/site/posts/PostsUser.jsx';
import PostDetailUser from './components/site/posts/PostDetailUser.jsx';
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
      <Route path="/google-success" element={<GoogleSuccess />} />

      {/* Route người dùng */}
      <Route path="/" element={<UserLayout />}>
        <Route index element={<Home />} />
        <Route path="chat" element={<ChatboxAI />} />
        <Route path="user-profile" element={<UserProfilePage />} />
        <Route path="carts" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="orders" element={<OrdersProcessing />} />
        <Route path="orderCancel/:orderId" element={<CancelledOrders />} />
        <Route path="order/:orderId" element={<OrderDetails />} />
        <Route path="cancelledOrders" element={<CancelledOrders />} />  {/* Trang đơn hàng đã hủy */}
        <Route path="shippingOrders" element={<ShippingOrdersList />} />
        <Route path="deliveredOrders" element={<DeliveredOrdersList />} />
        <Route path="returnedOrders" element={<ReturnedOrdersList />} />
        <Route path="failedOrders" element={<FailedOrdersList />} />
        <Route path="search" element={<SearchPage />} />  {/* Trang tìm kiếm */}
        <Route path="products" element={<ProductListUI />} />
        <Route path="products/:id" element={<ProductDetailUI />} />
        <Route path="categories/:categoryId" element={<CategoryProductsPage />} />

        <Route path="/posts" element={<PostsUser />} />
        <Route path="/posts/:id" element={<PostDetailUser />} />  

          <Route path="/payment-callback" element={<PaymentCallback />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-fail" element={<PaymentFail />} />
      </Route>



          {/* Route cho đăng nhập admin */}
        <Route path="/login" element={<Login onLogin={() => setIsAdmin(true)} />} />
        <Route path="/logout" element={<Logout onLogout={() => setIsAdmin(false)} />} />
          <Route path="/register-admin" element={<RegisterAdmin />} />

        {isAdmin ? (
          <Route path="/admin" element={<AdminDashboard />}>
             <Route path="dashboard" element={<Dashboard />} />

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
            <Route path="topics/create" element={<TopicCreate />} />
            <Route path="topics/detail/:id" element={<TopicDetail />} />
            <Route path="topics/edit/:id" element={<TopicEdit />} />
            <Route path="topics/:id/trash" element={<TopicTrash />} />

            <Route path="posts" element={<Posts />} />
            <Route path="posts/create" element={<PostCreate />} />
            <Route path="posts/:id/edit" element={<PostEdit />} />
            <Route path="posts/:id" element={<PostDetail />} />
            <Route path="posts/:id/trash" element={<PostTrash />} />

            <Route path="contacts" element={<ContactList />} />
            <Route path="contacts/trash" element={<ContactTrash />} />
            <Route path="contacts/detail/:id" element={<ContactDetail />} />

            <Route path="banners" element={<BannerList />} />
            <Route path="banners/create" element={<BannersCreate />} />{" "}
            <Route path="banners/edit/:id" element={<BannersEdit />} />{" "}
            <Route path="banners/detail/:id" element={<BannersDetail />} />

            <Route path="menus" element={<Menus />} />
            <Route path="logs" element={<AdminLogs />} />


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
