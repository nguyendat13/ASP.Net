import React, { useEffect, useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/home.css";

const Home = () => {
  const [newProducts, setNewProducts] = useState([]);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const navigate = useNavigate();
  const [showChat, setShowChat] = useState(false); // toggle popup chat

  useEffect(() => {
    axios.get("https://localhost:7177/api/Product/new")
      .then(res => setNewProducts(res.data))
      .catch(err => console.error("Lỗi khi lấy sản phẩm mới:", err));

    axios.get("https://localhost:7177/api/Product/top-selling")
      .then(res => setTopSellingProducts(res.data))
      .catch(err => console.error("Lỗi khi lấy sản phẩm bán chạy:", err));

    axios.get("https://localhost:7177/api/Post/latest")
      .then(res => setLatestPosts(res.data))
      .catch(err => console.error("Lỗi khi lấy bài viết mới:", err));
  }, []);

  const renderProducts = (products) => (
    products.map(product => (
      <div className="col-md-4 mb-4" key={product.id}>
        <div className="card product-card">
          <img
            src={`https://localhost:7177${product.avatar}`}
            alt={product.name}
            className="card-img-top product-image"
          />
          <div className="card-body">
            <h5 className="card-title">{product.name}</h5>
            <p className="card-text price">{product.price.toLocaleString()} ₫</p>
            <Link to={`/products/${product.id}`} className="btn btn-outline-primary w-100">
              Xem chi tiết
            </Link>
          </div>
        </div>
      </div>
    ))
  );

  const renderPosts = (posts) => (
    posts.map(post => (
      <div className="col-md-4 mb-4" key={post.id}>
        <div className="card post-card">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="card-img-top post-image"
          />
          <div className="card-body">
            <h5 className="card-title">{post.title}</h5>
            <p className="card-text">{post.excerpt}</p>
            <Link to={`/post/${post.id}`} className="btn btn-outline-secondary w-100">
              Đọc thêm
            </Link>
          </div>
        </div>
      </div>
    ))
  );
  const toggleChat = () => {
    setShowChat(!showChat);
  };
  return (
    <div className="container mt-5 home-container">
      {/* Banner */}
      <div className="banner mb-5">
      

        <div className="banner-images">
          <img src="/assets/banner/hero-img-2.jpg" alt="Banner 1" />
          <img src="/assets/banner/hero-img-1.png" alt="Banner 2" />
        </div>
        <div className="text-center mt-4">
          <h1 className="home-title">Chào mừng đến với cửa hàng của chúng tôi!</h1>
          <p className="home-subtitle">Khám phá các sản phẩm tuyệt vời và bài viết mới nhất</p>
        </div>
      </div>

      {/* New Products */}
      <section className="mb-5">
        <h2 className="section-title">✨ Sản phẩm mới</h2>
        <div className="row">
          {newProducts.length > 0 ? renderProducts(newProducts) : <div className="loading-text">Đang tải sản phẩm mới...</div>}
        </div>
      </section>

      {/* Top Selling */}
      <section className="mb-5">
        <h2 className="section-title">🔥 Sản phẩm bán chạy</h2>
        <div className="row">
          {topSellingProducts.length > 0 ? renderProducts(topSellingProducts) : <div className="loading-text">Đang tải sản phẩm bán chạy...</div>}
        </div>
      </section>

      {/* Latest Posts */}
      <section className="mb-5">
        <h2 className="section-title">📰 Bài viết mới nhất</h2>
        <div className="row">
          {latestPosts.length > 0 ? renderPosts(latestPosts) : <div className="loading-text">Đang tải bài viết mới...</div>}
        </div>
      </section>
    </div>
  );
};

export default Home;
