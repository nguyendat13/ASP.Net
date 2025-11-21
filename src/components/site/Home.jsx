import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Sparkles, Flame, Newspaper, ShoppingCart } from "lucide-react";
import "../../css/home.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import API_BASE_URL from "../../config";
import Slider from "react-slick";

const Home = () => {
  const [newProducts, setNewProducts] = useState([]);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/Product/new`)
      .then((res) => setNewProducts(res.data))
      .catch((err) => console.error("Lỗi khi lấy sản phẩm mới:", err));

    axios
      .get(`${API_BASE_URL}/api/Product/top-selling`)
      .then((res) => setTopSellingProducts(res.data))
      .catch((err) => console.error("Lỗi khi lấy sản phẩm bán chạy:", err));

    axios
      .get(`${API_BASE_URL}/api/Post/latest`)
      .then((res) => setLatestPosts(res.data))
      .catch((err) => console.error("Lỗi khi lấy bài viết mới:", err));
  }, []);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
  };

  const renderProductCard = (product) => (
    <div
      key={product.id}
      onMouseEnter={() => setHoveredCard(product.id)}
      onMouseLeave={() => setHoveredCard(null)}
      style={{
        background: "#23272a",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: hoveredCard === product.id
          ? "0 20px 40px rgba(67, 160, 71, 0.15)"
          : "0 8px 24px rgba(0,0,0,0.3)",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: hoveredCard === product.id ? "translateY(-8px) scale(1.02)" : "translateY(0)",
        border: "1px solid rgba(67, 160, 71, 0.15)",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          position: "relative",
          height: "240px",
          background: "linear-gradient(135deg, #2a2f33 0%, #1e1e1e 100%)",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={`${API_BASE_URL}/api/Product/image/${
            product.avatar ? product.avatar.replace("/images/", "") : "default.jpg"
          }`}
          alt={product.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.4s ease",
            transform: hoveredCard === product.id ? "scale(1.1)" : "scale(1)",
          }}
        />

        {product.discount > 0 && (
          <div
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              background: "linear-gradient(135deg, #e53935 0%, #d32f2f 100%)",
              color: "#fff",
              padding: "8px 12px",
              borderRadius: "12px",
              fontSize: "0.85rem",
              fontWeight: "bold",
              boxShadow: "0 4px 12px rgba(229, 57, 53, 0.3)",
              zIndex: 10,
            }}
          >
            -{product.discount}%
          </div>
        )}
      </div>

      <div style={{ padding: "20px" }}>
        <h5
          style={{
            fontSize: "1.1rem",
            fontWeight: "600",
            color: "#fff",
            marginBottom: "12px",
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          {product.name}
        </h5>

        <div style={{ marginBottom: "16px" }}>
          <div
            style={{
              fontSize: "1.3rem",
              fontWeight: "700",
              color: "#43a047",
              letterSpacing: "-0.5px",
            }}
          >
            {product.price?.toLocaleString()} ₫
          </div>
        </div>

        <Link
          to={`/products/${product.id}`}
          style={{
            display: "block",
            width: "100%",
            padding: "12px",
            background: "linear-gradient(135deg, #43a047 0%, #2e7d32 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            fontSize: "0.95rem",
            fontWeight: "600",
            textDecoration: "none",
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: hoveredCard === product.id
              ? "0 8px 20px rgba(67, 160, 71, 0.3)"
              : "0 4px 12px rgba(67, 160, 71, 0.15)",
            transform: hoveredCard === product.id ? "translateX(2px)" : "translateX(0)",
          }}
        >
          Xem chi tiết →
        </Link>
      </div>
    </div>
  );

  const renderPost = (post) => (
    <div
      key={post.id}
      onMouseEnter={() => setHoveredCard(`post-${post.id}`)}
      onMouseLeave={() => setHoveredCard(null)}
      onClick={() => navigate(`/posts/${post.id}`)}
      style={{
        background: "#23272a",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: hoveredCard === `post-${post.id}`
          ? "0 20px 40px rgba(67, 160, 71, 0.15)"
          : "0 8px 24px rgba(0,0,0,0.3)",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: hoveredCard === `post-${post.id}` ? "translateY(-8px)" : "translateY(0)",
        border: "1px solid rgba(67, 160, 71, 0.15)",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div
        style={{
          height: "200px",
          background: post.imageUrl
            ? `url(${
                post.imageUrl.startsWith("http")
                  ? post.imageUrl
                  : `${API_BASE_URL}${post.imageUrl}`
              }) center/cover`
            : "linear-gradient(135deg, #43a047 0%, #2e7d32 100%)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!post.imageUrl && <Newspaper size={48} color="#fff" opacity={0.3} />}
      </div>

      <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
        <h5
          style={{
            fontSize: "1.1rem",
            fontWeight: "600",
            color: "#fff",
            marginBottom: "12px",
            lineHeight: "1.4",
          }}
        >
          {post.title}
        </h5>

        <p
          style={{
            fontSize: "0.9rem",
            color: "#aaa",
            lineHeight: "1.6",
            marginBottom: "16px",
            flex: 1,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
          dangerouslySetInnerHTML={{
            __html: post.excerpt || "Không có mô tả",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: "#43a047",
            fontWeight: "600",
            fontSize: "0.95rem",
            gap: "6px",
          }}
        >
          Đọc thêm →
        </div>
      </div>
    </div>
  );

  return (
    <div
      style={{
        background: "#1a1a1a",
        minHeight: "100vh",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Hero Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #43a047 0%, #2e7d32 100%)",
          color: "#fff",
          padding: isMobile ? "50px 20px" : "100px 20px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            background: "radial-gradient(circle at 20% 50%, #fff 0%, transparent 50%)",
          }}
        />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "800px", margin: "0 auto" }}>
          <h1
            style={{
              fontSize: isMobile ? "2rem" : "3.5rem",
              fontWeight: "800",
              marginBottom: "16px",
              letterSpacing: "-1px",
            }}
          >
            Chào mừng bạn
          </h1>
          <p
            style={{
              fontSize: isMobile ? "1rem" : "1.3rem",
              opacity: 0.95,
              lineHeight: "1.6",
            }}
          >
            Khám phá bộ sưu tập sản phẩm chất lượng cao và những bài viết hữu ích nhất
          </p>

          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              marginTop: "30px",
              flexWrap: "wrap",
            }}
          >
            <Link
              to="/products"
              style={{
                display: "inline-block",
                padding: "14px 40px",
                background: "#fff",
                color: "#43a047",
                textDecoration: "none",
                borderRadius: "12px",
                fontWeight: "700",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-4px)";
                e.target.style.boxShadow = "0 12px 24px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              Khám phá ngay →
            </Link>
            <Link
              to="/posts"
              style={{
                display: "inline-block",
                padding: "14px 40px",
                background: "rgba(255,255,255,0.2)",
                color: "#fff",
                textDecoration: "none",
                borderRadius: "12px",
                fontWeight: "700",
                border: "2px solid #fff",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255,255,255,0.3)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255,255,255,0.2)";
              }}
            >
              Bài viết mới
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: isMobile ? "40px 15px" : "60px 20px" }}>
        {/* New Products */}
        {newProducts.length > 0 && (
          <section style={{ marginBottom: "80px" }}>
            <div style={{ marginBottom: "40px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <Sparkles size={32} color="#43a047" />
                <h2
                  style={{
                    fontSize: isMobile ? "1.5rem" : "2rem",
                    fontWeight: "700",
                    color: "#fff",
                    margin: 0,
                  }}
                >
                  Sản phẩm mới
                </h2>
              </div>
              <div
                style={{
                  height: "4px",
                  width: "60px",
                  background: "linear-gradient(90deg, #43a047 0%, #81c784 100%)",
                  borderRadius: "2px",
                }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? "150px" : "220px"}, 1fr))`,
                gap: "24px",
              }}
            >
              {newProducts.map((product) => renderProductCard(product))}
            </div>
          </section>
        )}

        {/* Top Selling */}
        {topSellingProducts.length > 0 && (
          <section style={{ marginBottom: "80px" }}>
            <div style={{ marginBottom: "40px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <Flame size={32} color="#e53935" />
                <h2
                  style={{
                    fontSize: isMobile ? "1.5rem" : "2rem",
                    fontWeight: "700",
                    color: "#fff",
                    margin: 0,
                  }}
                >
                  Sản phẩm bán chạy
                </h2>
              </div>
              <div
                style={{
                  height: "4px",
                  width: "60px",
                  background: "linear-gradient(90deg, #e53935 0%, #ef5350 100%)",
                  borderRadius: "2px",
                }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? "150px" : "220px"}, 1fr))`,
                gap: "24px",
              }}
            >
              {topSellingProducts.map((product) => renderProductCard(product))}
            </div>
          </section>
        )}

        {/* Latest Posts */}
        {latestPosts.length > 0 && (
          <section>
            <div style={{ marginBottom: "40px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <Newspaper size={32} color="#43a047" />
                <h2
                  style={{
                    fontSize: isMobile ? "1.5rem" : "2rem",
                    fontWeight: "700",
                    color: "#fff",
                    margin: 0,
                  }}
                >
                  Bài viết mới
                </h2>
              </div>
              <div
                style={{
                  height: "4px",
                  width: "60px",
                  background: "linear-gradient(90deg, #43a047 0%, #81c784 100%)",
                  borderRadius: "2px",
                }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? "150px" : "280px"}, 1fr))`,
                gap: "24px",
              }}
            >
              {latestPosts.map((post) => renderPost(post))}
            </div>
          </section>
        )}

                {/* ===== THÊM SLIDER POSTER ĐẸP Ở ĐÂY ===== */}
        <div style={{ maxWidth: "1000px", margin: "40px auto 0", padding: "0 15px" }}>
          <Slider
            dots={true}
            infinite={true}
            speed={800}
            slidesToShow={1}
            slidesToScroll={1}
            autoplay={true}
            autoplaySpeed={4000}
            arrows={false}
            pauseOnHover={true}
            className="hero-slider"
            dotsClass="slick-dots custom-dots"
          >
            <div>
              <img
                src="../../assets/banner/hero-img-1.png"
                alt="Khuyến mãi lớn"
                style={{
                  width: "100%",
                  height: isMobile ? "180px" : "380px",
                  objectFit: "cover",
                  borderRadius: "20px",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                  border: "4px solid rgba(67,160,71,0.3)",
                }}
              />
            </div>
            <div>
              <img
                src="../../assets/banner/hero-img-2.jpg"
                alt="Sản phẩm hot"
                style={{
                  width: "100%",
                  height: isMobile ? "180px" : "380px",
                  objectFit: "cover",
                  borderRadius: "20px",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                  border: "4px solid rgba(229,57,53,0.3)",
                }}
              />
            </div>
          </Slider>
        </div>
        {/* ===== HẾT SLIDER POSTER ===== */}
      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .slick-slide {
          padding: 10px;
        }

        .slick-prev:before,
        .slick-next:before {
          color: #43a047;
          font-size: 28px;
        }

        @media (max-width: 768px) {
          h1 {
            font-size: 1.8rem !important;
          }

          h2 {
            font-size: 1.3rem !important;
          }

          p {
            font-size: 0.95rem !important;
          }
        }

        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #2a2f33;
        }

        ::-webkit-scrollbar-thumb {
          background: #43a047;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #2e7d32;
        }
      `}</style>
    </div>
  );
};

export default Home;