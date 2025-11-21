import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Search, DollarSign, AlertCircle, ShoppingCart } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../css/ProductSearch.css";
import API_BASE_URL from "../../../config";

const SearchPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    setError(null);

    const fetchSearchResults = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/Product/search?query=${query}`
        );
        if (!response.ok) {
          throw new Error("Lỗi khi tìm kiếm sản phẩm");
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  const handleAddToCart = (productId) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Bạn cần đăng nhập để thêm vào giỏ hàng!");
      navigate("/login-user");
      return;
    }

    axios
      .post(`${API_BASE_URL}/api/Cart/add-item`, {
        userId: parseInt(userId),
        productId,
        quantity: 1,
      })
      .then((res) => {
        alert("✅ Đã thêm vào giỏ hàng!");
        navigate("/carts");
      })
      .catch((err) => {
        console.error("❌ Lỗi khi thêm vào giỏ hàng:", err);
        alert("❌ Không thể thêm vào giỏ hàng");
      });
  };

  return (
    <div
      style={{
        background: "#1a1a1a",
        minHeight: "100vh",
        paddingTop: "20px",
        paddingBottom: "60px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #43a047 0%, #2e7d32 100%)",
          color: "#fff",
          padding: isMobile ? "30px 15px" : "40px 20px",
          marginBottom: "40px",
          borderRadius: "0 0 16px 16px",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <Search size={isMobile ? 28 : 36} />
          <h2
            style={{
              fontSize: isMobile ? "1.5rem" : "2rem",
              fontWeight: "700",
              margin: 0,
            }}
          >
            Kết quả tìm kiếm
          </h2>
        </div>
        <p
          style={{
            marginTop: "12px",
            fontSize: "1rem",
            opacity: 0.9,
          }}
        >
          Tìm thấy kết quả cho: <strong>"{query}"</strong>
        </p>
      </div>

      {/* Main Content */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: isMobile ? "0 15px" : "0 20px",
        }}
      >
        {/* Loading State */}
        {loading && (
          <div
            style={{
              background: "rgba(67, 160, 71, 0.1)",
              border: "1px solid rgba(67, 160, 71, 0.3)",
              color: "#81c784",
              padding: "20px",
              borderRadius: "12px",
              textAlign: "center",
              fontSize: "1rem",
              fontWeight: "500",
            }}
          >
            ⏳ Đang tải dữ liệu...
          </div>
        )}

        {/* Error State */}
        {error && (
          <div
            style={{
              background: "rgba(229, 57, 53, 0.1)",
              border: "1px solid rgba(229, 57, 53, 0.3)",
              color: "#ff6b6b",
              padding: "16px 20px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontSize: "0.95rem",
            }}
          >
            <AlertCircle size={20} />
            Lỗi: {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && !error && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#aaa",
            }}
          >
            <p style={{ fontSize: "1.2rem", marginBottom: "10px" }}>
              😔 Không tìm thấy sản phẩm
            </p>
            <p>Thử tìm kiếm với từ khóa khác hoặc quay lại trang chủ</p>
            <Link
              to="/"
              style={{
                display: "inline-block",
                marginTop: "20px",
                padding: "12px 24px",
                background: "linear-gradient(135deg, #43a047 0%, #2e7d32 100%)",
                color: "#fff",
                textDecoration: "none",
                borderRadius: "12px",
                fontWeight: "600",
              }}
            >
              Về trang chủ
            </Link>
          </div>
        )}

        {/* Products Grid */}
        {!loading && products.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(auto-fill, minmax(${
                isMobile ? "150px" : "220px"
              }, 1fr))`,
              gap: "24px",
            }}
          >
            {products.map((product) => (
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
                  transform: hoveredCard === product.id
                    ? "translateY(-8px) scale(1.02)"
                    : "translateY(0)",
                  border: "1px solid rgba(67, 160, 71, 0.15)",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Image Section */}
                <div
                  style={{
                    position: "relative",
                    height: "200px",
                    background: "linear-gradient(135deg, #2a2f33 0%, #1e1e1e 100%)",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={
                      product.avatar
                        ? product.avatar.startsWith("http")
                          ? product.avatar
                          : `${API_BASE_URL}/api/Product/image/${product.avatar.replace(
                              "/images/",
                              ""
                            )}`
                        : "https://via.placeholder.com/200x200?text=No+Image"
                    }
                    alt={product.name}
                    style={{
                      maxHeight: "100%",
                      maxWidth: "90%",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "2px solid #43a047",
                      transition: "transform 0.4s ease",
                      transform: hoveredCard === product.id
                        ? "scale(1.1)"
                        : "scale(1)",
                    }}
                  />
                </div>

                {/* Content Section */}
                <div
                  style={{
                    padding: "16px",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Product Name */}
                  <h5
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: "#fff",
                      marginBottom: "10px",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {product.name}
                  </h5>

                  {/* Price */}
                  <div
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "700",
                      color: "#43a047",
                      marginBottom: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <DollarSign size={18} />
                    {product.price?.toLocaleString()} đ
                  </div>

                  {/* Buttons */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      marginTop: "auto",
                    }}
                  >
                    <Link
                      to={`/products/${product.id}`}
                      style={{
                        display: "block",
                        padding: "10px",
                        background: "linear-gradient(135deg, #43a047 0%, #2e7d32 100%)",
                        color: "#fff",
                        textDecoration: "none",
                        textAlign: "center",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        transition: "all 0.3s ease",
                        boxShadow: hoveredCard === product.id
                          ? "0 8px 16px rgba(67, 160, 71, 0.3)"
                          : "0 4px 8px rgba(67, 160, 71, 0.15)",
                      }}
                    >
                      Xem chi tiết
                    </Link>

                    <button
                      onClick={() => handleAddToCart(product.id)}
                      style={{
                        padding: "10px",
                        background: "rgba(67, 160, 71, 0.15)",
                        color: "#81c784",
                        border: "1px solid #43a047",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = "linear-gradient(135deg, #43a047 0%, #2e7d32 100%)";
                        e.target.style.color = "#fff";
                        e.target.style.border = "none";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "rgba(67, 160, 71, 0.15)";
                        e.target.style.color = "#81c784";
                        e.target.style.border = "1px solid #43a047";
                      }}
                    >
                      <ShoppingCart size={16} />
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }

        @media (max-width: 768px) {
          h2 {
            font-size: 1.3rem !important;
          }

          p {
            font-size: 0.9rem !important;
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

export default SearchPage;