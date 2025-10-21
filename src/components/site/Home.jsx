import React, { useEffect, useState } from "react";
import { FaTag, FaMoneyBillWave, FaFire, FaStar, FaNewspaper } from "react-icons/fa";
import ScrollReveal from "../../components/transitions/ScrollReveal";
import Slider from "react-slick";
import { Link, useNavigate } from "react-router-dom";
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
const [showChat, setShowChat] = useState(false);

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

// ✅ Cấu hình slider dùng chung
const sliderSettings = {
dots: false,
infinite: true,
speed: 500,
slidesToShow: 4,
slidesToScroll: 1,
autoplay: true,
autoplaySpeed: 3500,
responsive: [
{ breakpoint: 1024, settings: { slidesToShow: 3 } },
{ breakpoint: 768, settings: { slidesToShow: 2 } },
{ breakpoint: 576, settings: { slidesToShow: 1 } }
]
};

// ✅ Render sản phẩm
const renderProductCard = (product) => ( <div key={product.id} className="p-2">
<div
className="card product-card pro-card h-100"
style={{
background: "#fff",
color: "#23272a",
border: "none",
boxShadow: "0 6px 24px rgba(0,0,0,0.18)",
transition: "transform 0.2s, box-shadow 0.2s"
}}
>
<div
className="pro-img-wrap"
style={{
display: "flex",
justifyContent: "center",
alignItems: "center",
background: "#f5f5f5",
borderRadius: "12px",
overflow: "hidden",
height: "220px",
marginBottom: "8px",
boxShadow: "0 2px 12px rgba(0,0,0,0.2)"
}}
>
<img
src={`${API_BASE_URL}/api/Product/image/${
              product.avatar ? product.avatar.replace("/images/", "") : "default.jpg"
            }`}
alt={product.name}
style={{
maxHeight: "200px",
maxWidth: "90%",
objectFit: "cover",
borderRadius: "12px",
border: "2px solid #43a047",
background: "#fff",
boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
}}
/> </div> <div className="card-body d-flex flex-column justify-content-between">
<h5
className="card-title d-flex align-items-center mb-2"
style={{ fontWeight: "bold", fontSize: "1.2rem", color: "#23272a" }}
>
<FaTag style={{ color: "#43a047", marginRight: "8px" }} /> {product.name} </h5> <div className="d-flex justify-content-between align-items-center mb-2">
<span
className="badge bg-success"
style={{
fontSize: "1rem",
fontWeight: "bold",
padding: "8px 14px",
borderRadius: "8px",
color: "#fff",
background: "#43a047"
}}
>
<FaMoneyBillWave style={{ color: "#fff", marginRight: "6px" }} />{" "}
{product.price.toLocaleString()} ₫ </span>
{product.discount > 0 && (
<span
className="badge bg-danger"
style={{
fontSize: "0.95rem",
fontWeight: "bold",
padding: "8px 12px",
borderRadius: "8px",
color: "#fff",
background: "#e53935"
}}
>
-{product.discount}% </span>
)} </div>
<Link
to={`/products/${product.id}`}
className="btn btn-success w-100 mt-2"
style={{
color: "#fff",
fontWeight: "bold",
border: "none",
background: "#43a047",
borderRadius: "8px",
fontSize: "1rem",
boxShadow: "0 2px 8px rgba(0,0,0,0.10)"
}}
>
Xem chi tiết </Link> </div> </div> </div>
);

// ✅ Render bài viết (đồng bộ giao diện với sản phẩm)
const renderPosts = (posts) =>
  posts.map((post) => (
    <div
      key={post.id}
      className="card post-card h-100"
      style={{
        background: "#fff",
        color: "#23272a",
        border: "none",
        boxShadow: "0 6px 24px rgba(0,0,0,0.18)",
        borderRadius: "16px",
        overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
        height: "100%",
      }}
    >
      <div
        className="post-img-wrap"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f5f5f5",
          borderRadius: "16px 16px 0 0",
          overflow: "hidden",
          height: "220px",
          marginBottom: "8px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
        }}
      >
        {post.imageUrl ? (
          <img
            src={
              post.imageUrl.startsWith("http")
                ? post.imageUrl
                : `${API_BASE_URL}${post.imageUrl}`
            }
            alt={post.title}
            style={{
              maxHeight: "220px",
              width: "100%",
              objectFit: "cover",
              borderRadius: "16px 16px 0 0",
              border: "2px solid #43a047",
              background: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          />
        ) : (
          <span className="text-muted">Không có ảnh</span>
        )}
      </div>

      <div className="card-body d-flex flex-column justify-content-between">
        <h5
          className="card-title mb-2"
          style={{
            fontWeight: "bold",
            fontSize: "1.2rem",
            color: "#23272a",
          }}
        >
          {post.title}
        </h5>
        <p
          className="card-text mb-3"
          style={{
            fontSize: "0.95rem",
            color: "#555",
            minHeight: "60px",
            overflow: "hidden",
          }}
          dangerouslySetInnerHTML={{
            __html: post.excerpt ? post.excerpt : "Không có mô tả",
          }}
        ></p>
        <Link
          to={`/posts/${post.id}`}
          className="btn btn-success w-100 mt-auto"
          style={{
            color: "#fff",
            fontWeight: "bold",
            border: "none",
            background: "#43a047",
            borderRadius: "8px",
            fontSize: "1rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
          }}
        >
          Đọc thêm
        </Link>
      </div>
    </div>
  ));



return (
<div
className="container-fluid mt-5 home-container"
style={{
background: "var(--background)",
borderRadius: "24px",
boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
padding: "16px 0",
minHeight: "100vh"
}}
>
{/* Banner Slider */}
<div className="banner mb-5" style={{ maxWidth: "900px", margin: "0 auto" }}> <Slider dots infinite speed={500} slidesToShow={1} slidesToScroll={1} autoplay autoplaySpeed={3500}> <div>
<img
src="/assets/banner/hero-img-2.jpg"
alt="Banner 1"
style={{
width: "100%",
maxHeight: "400px",
objectFit: "cover",
borderRadius: "16px",
boxShadow: "0 4px 16px rgba(0,0,0,0.2)"
}}
/> </div> <div>
<img
src="/assets/banner/hero-img-1.png"
alt="Banner 2"
style={{
width: "100%",
maxHeight: "400px",
objectFit: "cover",
borderRadius: "16px",
boxShadow: "0 4px 16px rgba(0,0,0,0.2)"
}}
/> </div> </Slider> <div className="text-center mt-4">
<h1
className="home-title"
style={{
color: "var(--foreground)",
fontWeight: "bold",
textShadow: "none"
}}
>
Chào mừng đến với cửa hàng của chúng tôi! </h1>
<p
className="home-subtitle"
style={{
color: "var(--foreground)",
fontSize: "1.3rem",
textShadow: "none"
}}
>
Khám phá các sản phẩm tuyệt vời và bài viết mới nhất </p> </div> </div>

 <section className="mb-5">
  <h2 className="section-title">
    <FaStar style={{ color: "#43a047", fontSize: "2rem" }} /> Sản phẩm mới
  </h2>
  <div className="horizontal-scroll">
    {newProducts.map((product) => (
      <div key={product.id} className="horizontal-item">
        {renderProductCard(product)}
      </div>
    ))}
  </div>
</section>

<section className="mb-5">
  <h2 className="section-title">
    <FaFire style={{ color: "#43a047", fontSize: "2rem" }} /> Sản phẩm bán chạy
  </h2>
  <div className="horizontal-scroll">
    {topSellingProducts.map((product) => (
      <div key={product.id} className="horizontal-item">
        {renderProductCard(product)}
      </div>
    ))}
  </div>
</section>


 {/* ✅ Bài viết mới */}
<section className="mb-5">
  <h2 className="section-title">
    <FaNewspaper style={{ color: "#43a047", fontSize: "2rem" }} /> Bài viết mới
  </h2>
  <div className="horizontal-scroll">
    {latestPosts.map((post) => (
      <div key={post.id} className="horizontal-item">
        {renderPosts([post])}
      </div>
    ))}
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
    .slick-slide { padding: 10px; }
    .slick-prev:before, .slick-next:before {
      color: #43a047;
      font-size: 28px;
    }
  `}</style>
</div>


);
};

export default Home;
