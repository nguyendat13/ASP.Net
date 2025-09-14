import React, { useEffect, useState } from "react";
import { FaTag, FaMoneyBillWave } from "react-icons/fa";
import { FaFire, FaStar, FaNewspaper } from "react-icons/fa";
import Slider from "react-slick";
import { Link,useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/home.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
  const [newProducts, setNewProducts] = useState([]);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const navigate = useNavigate();
  const [showChat, setShowChat] = useState(false); // toggle popup chat

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/Product/new`)
      .then(res => setNewProducts(res.data))
      .catch(err => console.error("Lỗi khi lấy sản phẩm mới:", err));

    axios.get(`${API_BASE_URL}/api/Product/top-selling`)
      .then(res => setTopSellingProducts(res.data))
      .catch(err => console.error("Lỗi khi lấy sản phẩm bán chạy:", err));

    axios.get(`${API_BASE_URL}/api/Post/latest`)
      .then(res => setLatestPosts(res.data))
      .catch(err => console.error("Lỗi khi lấy bài viết mới:", err));
  }, []);

  const renderProducts = (products) => (
    products.map(product => (
      <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={product.id}>
        <div className="card product-card" style={{ background: '#23272b', color: '#FFD700', border: '2px solid #FFA500', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#23272b', borderRadius: '8px', overflow: 'hidden', height: '220px', marginBottom: '8px', boxShadow: '0 2px 12px rgba(0,0,0,0.2)' }}>
            <img
              src={`${API_BASE_URL}${product.avatar}`}
              alt={product.name}
              style={{ maxHeight: '200px', maxWidth: '90%', objectFit: 'contain', borderRadius: '8px', border: '2px solid #FFA500', background: '#23272b', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
            />
          </div>
          <div className="card-body">
            <h5 className="card-title d-flex align-items-center" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
              <FaTag style={{ color: '#FFA500', marginRight: '8px' }} /> {product.name}
            </h5>
            <p className="card-text price d-flex align-items-center" style={{ fontSize: '1.1rem', color: '#FFA500', fontWeight: 'bold' }}>
              <FaMoneyBillWave style={{ color: '#FFD700', marginRight: '8px' }} /> {product.price.toLocaleString()} ₫
            </p>
            <Link to={`/products/${product.id}`} className="btn btn-outline-warning w-100" style={{ color: '#23272b', fontWeight: 'bold', border: '2px solid #FFA500', background: '#FFD700' }}>
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
  <div className="container-fluid mt-5 home-container" style={{ background: 'linear-gradient(120deg, #23272b 70%, #4CAF50 100%)', borderRadius: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', padding: '16px 0', minHeight: '100vh' }}>
      {/* Banner Slider */}
  <div className="banner mb-5" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Slider
          dots={true}
          infinite={true}
          speed={500}
          slidesToShow={1}
          slidesToScroll={1}
          autoplay={true}
          autoplaySpeed={3500}
        >
          <div>
            <img src="/assets/banner/hero-img-2.jpg" alt="Banner 1" style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }} />
          </div>
          <div>
            <img src="/assets/banner/hero-img-1.png" alt="Banner 2" style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }} />
          </div>
        </Slider>
        <div className="text-center mt-4">
          <h1 className="home-title" style={{ color: '#FFD700', fontWeight: 'bold', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>Chào mừng đến với cửa hàng của chúng tôi!</h1>
          <p className="home-subtitle" style={{ color: '#FFA500', fontSize: '1.3rem' }}>Khám phá các sản phẩm tuyệt vời và bài viết mới nhất</p>
        </div>
      </div>

      {/* New Products */}
      <section className="mb-5">
        <h2 className="section-title" style={{ color: '#FFD700', borderLeft: '6px solid #FFA500', paddingLeft: '16px', fontWeight: 'bold', fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaStar style={{ color: '#FFA500', fontSize: '2rem' }} /> Sản phẩm mới
        </h2>
        <div className="row">
          {newProducts.length > 0 ? renderProducts(newProducts) : <div className="loading-text" style={{ color: '#FFD700' }}>Đang tải sản phẩm mới...</div>}
        </div>
      </section>

      {/* Top Selling */}
      <section className="mb-5">
        <h2 className="section-title" style={{ color: '#FFD700', borderLeft: '6px solid #FFA500', paddingLeft: '16px', fontWeight: 'bold', fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaFire style={{ color: '#FFA500', fontSize: '2rem' }} /> Sản phẩm bán chạy
        </h2>
        <div className="row">
          {topSellingProducts.length > 0 ? renderProducts(topSellingProducts) : <div className="loading-text" style={{ color: '#FFD700' }}>Đang tải sản phẩm bán chạy...</div>}
        </div>
      </section>

      {/* Latest Posts */}
      <section className="mb-5">
        <h2 className="section-title" style={{ color: '#FFD700', borderLeft: '6px solid #FFA500', paddingLeft: '16px', fontWeight: 'bold', fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaNewspaper style={{ color: '#FFA500', fontSize: '2rem' }} /> Bài viết mới nhất
        </h2>
        <div className="row">
          {latestPosts.length > 0 ? renderPosts(latestPosts) : <div className="loading-text" style={{ color: '#FFD700' }}>Đang tải bài viết mới...</div>}
        </div>
      </section>
    </div>
  );
};

export default Home;
