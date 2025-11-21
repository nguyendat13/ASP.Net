import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Tag, DollarSign, Eye, ShoppingCart } from "lucide-react";
import API_BASE_URL from "../../../config";

const RelatedProducts = ({ productId }) => {
  const [related, setRelated] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/Product/related?productId=${productId}`
        );
        const data = await response.json();
        setRelated(data);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm liên quan:", error);
      }
    };

    if (productId) fetchRelated();
  }, [productId]);

  const handleAddToCart = (product) => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("⚠️ Vui lòng đăng nhập để thêm vào giỏ hàng.");
      navigate("/login-user");
      return;
    }

    axios
      .post(`${API_BASE_URL}/api/Cart/add-item`, {
        userId: parseInt(userId),
        productId: product.id,
        quantity: 1,
      })
      .then(() => {
        alert("✅ Đã thêm vào giỏ hàng!");
      })
      .catch((err) => {
        console.error("❌ Lỗi khi thêm vào giỏ hàng:", err);
        alert("❌ Không thể thêm vào giỏ hàng.");
      });
  };

  if (related.length === 0) return null;

  return (
    <div>
      <div style={{ marginBottom: "30px" }}>
        <h3
          style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            color: "#fff",
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Tag size={28} color="#43a047" />
          Sản phẩm liên quan
        </h3>
        <div
          style={{
            height: "3px",
            width: "60px",
            background: "linear-gradient(90deg, #43a047 0%, #81c784 100%)",
            borderRadius: "2px",
          }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(auto-fill, minmax(${
            isMobile ? "140px" : "200px"
          }, 1fr))`,
          gap: "20px",
        }}
      >
        {related.map((product) => (
          <div
            key={product.id}
            onMouseEnter={() => setHoveredCard(product.id)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              background: "#23272a",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: hoveredCard === product.id
                ? "0 16px 32px rgba(67, 160, 71, 0.15)"
                : "0 6px 16px rgba(0,0,0,0.3)",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: hoveredCard === product.id
                ? "translateY(-6px) scale(1.02)"
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
                height: isMobile ? "140px" : "160px",
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
                  transform: hoveredCard === product.id ? "scale(1.1)" : "scale(1)",
                }}
              />
            </div>

            {/* Content Section */}
            <div
              style={{
                padding: "12px",
                flex: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Product Name */}
              <h6
                style={{
                  fontSize: isMobile ? "0.85rem" : "0.95rem",
                  fontWeight: "600",
                  color: "#fff",
                  marginBottom: "8px",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                {product.name}
              </h6>

              {/* Price */}
              <div
                style={{
                  fontSize: isMobile ? "0.9rem" : "1rem",
                  fontWeight: "700",
                  color: "#43a047",
                  marginBottom: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <DollarSign size={16} />
                {product.price?.toLocaleString()} đ
              </div>

              {/* Buttons */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  marginTop: "auto",
                }}
              >
                <button
                  onClick={() => navigate(`/products/${product.id}`)}
                  style={{
                    padding: "8px",
                    background: "linear-gradient(135deg, #43a047 0%, #2e7d32 100%)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: isMobile ? "0.8rem" : "0.85rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px",
                    boxShadow: hoveredCard === product.id
                      ? "0 6px 16px rgba(67, 160, 71, 0.3)"
                      : "0 2px 8px rgba(67, 160, 71, 0.15)",
                  }}
                >
                  <Eye size={14} />
                  Xem
                </button>

                <button
                  onClick={() => handleAddToCart(product)}
                  style={{
                    padding: "8px",
                    background: "rgba(67, 160, 71, 0.15)",
                    color: "#81c784",
                    border: "1px solid #43a047",
                    borderRadius: "8px",
                    fontSize: isMobile ? "0.8rem" : "0.85rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background =
                      "linear-gradient(135deg, #43a047 0%, #2e7d32 100%)";
                    e.target.style.color = "#fff";
                    e.target.style.border = "none";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "rgba(67, 160, 71, 0.15)";
                    e.target.style.color = "#81c784";
                    e.target.style.border = "1px solid #43a047";
                  }}
                >
                  <ShoppingCart size={14} />
                  Thêm
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }

        @media (max-width: 768px) {
          h3 {
            font-size: 1.2rem !important;
          }
        }

        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        ::-webkit-scrollbar-track {
          background: #2a2f33;
        }

        ::-webkit-scrollbar-thumb {
          background: #43a047;
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #2e7d32;
        }
      `}</style>
    </div>
  );
};

export default RelatedProducts;