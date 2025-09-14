import React, { useEffect, useState } from "react";
import { FaTag, FaMoneyBillWave } from "react-icons/fa";
import { FaFire, FaStar, FaNewspaper } from "react-icons/fa";
import Slider from "react-slick";
import { Link,useNavigate } from "react-router-dom";


import axios from "axios";

import "../../css/home.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import API_BASE_URL from "../../config";

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
        <div className="card product-card pro-card h-100" style={{ background: 'var(--card)', color: 'var(--foreground)', border: 'none', boxShadow: '0 6px 24px rgba(0,0,0,0.18)', transition: 'transform 0.2s, box-shadow 0.2s' }}>
          <div className="pro-img-wrap" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--card)', borderRadius: '12px', overflow: 'hidden', height: '220px', marginBottom: '8px', boxShadow: '0 2px 12px rgba(0,0,0,0.2)' }}>
            <img
              src={`${API_BASE_URL}/api/Product/image/${product.avatar.replace("/images/", "")}`}
              alt={product.name}
              style={{ maxHeight: '200px', maxWidth: '90%', objectFit: 'cover', borderRadius: '12px', border: '2px solid var(--primary)', background: 'var(--card)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
            />
          </div>
          <div className="card-body d-flex flex-column justify-content-between">
            <h5 className="card-title d-flex align-items-center mb-2" style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--foreground)' }}>
              <FaTag style={{ color: 'var(--primary)', marginRight: '8px' }} /> {product.name}
            </h5>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="badge bg-success" style={{ fontSize: '1rem', fontWeight: 'bold', padding: '8px 14px', borderRadius: '8px', color: '#fff', background: 'var(--primary)' }}>
                <FaMoneyBillWave style={{ color: '#fff', marginRight: '6px' }} /> {product.price.toLocaleString()} ₫
              </span>
              {product.discount > 0 && (
                <span className="badge bg-danger" style={{ fontSize: '0.95rem', fontWeight: 'bold', padding: '8px 12px', borderRadius: '8px', color: '#fff', background: '#e53935' }}>
                  -{product.discount}%
                </span>
              )}
            </div>
            <Link to={`/products/${product.id}`} className="btn btn-warning w-100 mt-2" style={{ color: 'var(--card)', fontWeight: 'bold', border: 'none', background: 'var(--primary)', borderRadius: '8px', fontSize: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}>
              Xem chi tiết
            </Link>
          </div>
        </div>
      </div>
    ))
  );

  const renderPosts = (posts) => (
    posts.map(post => (
      <div className="col-md-6 col-lg-4 mb-4" key={post.id}>
        <div className="card post-card h-100" style={{ background: 'var(--card)', color: 'var(--foreground)', border: 'none', boxShadow: '0 6px 24px rgba(0,0,0,0.18)', borderRadius: '16px', overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s' }}>
          <div style={{ height: '180px', overflow: 'hidden', borderRadius: '16px 16px 0 0', background: '#181a1b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src={post.imageUrl}
              alt={post.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px 16px 0 0' }}
            />
          </div>
          <div className="card-body d-flex flex-column justify-content-between">
            <h5 className="card-title mb-2" style={{ fontWeight: 'bold', fontSize: '1.15rem', color: 'var(--foreground)' }}>{post.title}</h5>
            <p className="card-text mb-2" style={{ color: 'var(--foreground)', fontSize: '1rem' }}>{post.excerpt}</p>
            <Link to={`/post/${post.id}`} className="btn btn-outline-primary w-100 mt-auto" style={{ color: 'var(--primary)', fontWeight: 'bold', border: '2px solid var(--primary)', borderRadius: '8px', fontSize: '1rem', background: 'var(--card)' }}>
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
  <div className="container-fluid mt-5 home-container" style={{ background: 'var(--background)', borderRadius: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', padding: '16px 0', minHeight: '100vh' }}>
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
          <h1 className="home-title" style={{ color: 'var(--foreground)', fontWeight: 'bold', textShadow: 'none' }}>Chào mừng đến với cửa hàng của chúng tôi!</h1>
          <p className="home-subtitle" style={{ color: 'var(--foreground)', fontSize: '1.3rem', textShadow: 'none' }}>Khám phá các sản phẩm tuyệt vời và bài viết mới nhất</p>
        </div>
      </div>

      {/* New Products */}
      <section className="mb-5">
        <h2 className="section-title" style={{ color: 'var(--foreground)', borderLeft: '6px solid var(--primary)', paddingLeft: '16px', fontWeight: 'bold', fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '8px', textShadow: 'none' }}>
          <FaStar style={{ color: 'var(--primary)', fontSize: '2rem' }} /> Sản phẩm mới
        </h2>
        <div className="row g-4">
          {newProducts.length > 0 ? renderProducts(newProducts) : <div className="loading-text" style={{ color: 'var(--foreground)' }}>Đang tải sản phẩm mới...</div>}
        </div>
      </section>

      {/* Top Selling */}
      <section className="mb-5">
        <h2 className="section-title" style={{ color: 'var(--foreground)', borderLeft: '6px solid var(--primary)', paddingLeft: '16px', fontWeight: 'bold', fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '8px', textShadow: 'none' }}>
          <FaFire style={{ color: 'var(--primary)', fontSize: '2rem' }} /> Sản phẩm bán chạy
        </h2>
        <div className="row g-4">
          {topSellingProducts.length > 0 ? renderProducts(topSellingProducts) : <div className="loading-text" style={{ color: 'var(--foreground)' }}>Đang tải sản phẩm bán chạy...</div>}
        </div>
      </section>

      {/* Latest Posts */}
      <section className="mb-5">
        <h2 className="section-title" style={{ color: 'var(--foreground)', borderLeft: '6px solid var(--primary)', paddingLeft: '16px', fontWeight: 'bold', fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '8px', textShadow: 'none' }}>
          <FaNewspaper style={{ color: 'var(--primary)', fontSize: '2rem' }} /> Bài viết mới nhất
        </h2>
        <div className="row g-4">
          {latestPosts.length > 0 ? renderPosts(latestPosts) : <div className="loading-text" style={{ color: 'var(--foreground)' }}>Đang tải bài viết mới...</div>}
        </div>
      </section>
    <style>{`
      .pro-card:hover, .post-card:hover {
        transform: translateY(-6px) scale(1.03);
        box-shadow: 0 12px 32px rgba(0,0,0,0.28);
      }
      .pro-img-wrap img {
        transition: transform 0.2s;
      }
      .pro-card:hover .pro-img-wrap img {
        transform: scale(1.08);
      }
    `}</style>
    </div>
  );
};

export default Home;
