import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Tag, DollarSign, Percent, FolderOpen, ShoppingCart, ArrowLeft } from "lucide-react";
import RelatedProducts from "./RelatedProducts";
import API_BASE_URL from "../../../config";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/Product/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy chi tiết sản phẩm:", err);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Bạn cần đăng nhập để thêm vào giỏ hàng!");
      navigate("/login-user");
      return;
    }

    axios
      .post(`${API_BASE_URL}/api/Cart/add-item`, {
        userId: parseInt(userId),
        productId: product.id,
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

  if (loading) {
    return (
      <div
        style={{
          background: "#1a1a1a",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: "1.2rem",
        }}
      >
        Đang tải...
      </div>
    );
  }

  if (!product) {
    return (
      <div
        style={{
          background: "#1a1a1a",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ff6b6b",
          fontSize: "1.2rem",
        }}
      >
        Không tìm thấy sản phẩm
      </div>
    );
  }

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
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "rgba(255,255,255,0.2)",
            border: "none",
            color: "#fff",
            padding: "10px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.3s ease",
            marginBottom: "16px",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "rgba(255,255,255,0.3)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "rgba(255,255,255,0.2)";
          }}
        >
          <ArrowLeft size={18} />
          Quay lại
        </button>
        <h2
          style={{
            fontSize: isMobile ? "1.5rem" : "2.5rem",
            fontWeight: "700",
            margin: 0,
          }}
        >
          Chi tiết sản phẩm
        </h2>
      </div>

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: isMobile ? "0 15px" : "0 20px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: isMobile ? "30px" : "50px",
            marginBottom: "60px",
          }}
        >
          {/* Product Image */}
          <div>
            <div
              style={{
                background: "#23272a",
                borderRadius: "16px",
                padding: "20px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                border: "1px solid rgba(67, 160, 71, 0.15)",
                position: "sticky",
                top: "20px",
              }}
            >
              <img
                src={
                  product.avatar
                    ? product.avatar.startsWith("http")
                      ? product.avatar
                      : `${API_BASE_URL}/api/Product/image/${product.avatar.replace("/images/", "")}`
                    : "https://via.placeholder.com/400x400?text=No+Image"
                }
                alt={product.name}
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "500px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  border: "2px solid #43a047",
                  transition: "transform 0.3s ease",
                }}
              />
            </div>
          </div>

          {/* Product Details */}
          <div>
            {/* Title */}
            <h1
              style={{
                fontSize: isMobile ? "1.8rem" : "2.5rem",
                fontWeight: "700",
                color: "#fff",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <Tag size={32} color="#43a047" />
              {product.name}
            </h1>

            {/* Category */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "24px",
                color: "#aaa",
                fontSize: "1rem",
              }}
            >
              <FolderOpen size={20} color="#43a047" />
              <span>Danh mục: <strong style={{ color: "#43a047" }}>{product.categoryName}</strong></span>
            </div>

            {/* Price Section */}
            <div
              style={{
                background: "linear-gradient(135deg, rgba(67, 160, 71, 0.1) 0%, rgba(67, 160, 71, 0.05) 100%)",
                padding: "24px",
                borderRadius: "16px",
                border: "1px solid rgba(67, 160, 71, 0.2)",
                marginBottom: "24px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "12px" }}>
                <div>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      color: "#aaa",
                      marginBottom: "6px",
                    }}
                  >
                    Giá:
                  </div>
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: "700",
                      color: "#43a047",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <DollarSign size={28} />
                    {product.price?.toLocaleString()} ₫
                  </div>
                </div>

                {product.discount > 0 && (
                  <div
                    style={{
                      background: "linear-gradient(135deg, #e53935 0%, #d32f2f 100%)",
                      padding: "16px",
                      borderRadius: "12px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        color: "#fff",
                        fontSize: "0.9rem",
                        marginBottom: "4px",
                      }}
                    >
                      Giảm giá
                    </div>
                    <div
                      style={{
                        color: "#fff",
                        fontSize: "1.8rem",
                        fontWeight: "700",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        justifyContent: "center",
                      }}
                    >
                      <Percent size={24} />
                      {product.discount}%
                    </div>
                  </div>
                )}
              </div>

              {product.discount > 0 && (
                <div style={{ color: "#81c784", fontSize: "0.9rem" }}>
                  Giá sau giảm: {(product.price * (100 - product.discount) / 100).toLocaleString()} ₫
                </div>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div
                style={{
                  background: "#23272a",
                  padding: "20px",
                  borderRadius: "12px",
                  border: "1px solid rgba(67, 160, 71, 0.15)",
                  marginBottom: "24px",
                  color: "#ccc",
                  lineHeight: "1.6",
                  fontSize: "0.95rem",
                }}
              >
                <h3 style={{ color: "#fff", fontSize: "1.1rem", marginBottom: "12px", fontWeight: "600" }}>
                  Mô tả sản phẩm
                </h3>
                <div dangerouslySetInnerHTML={{ __html: product.description }} />
              </div>
            )}

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              style={{
                width: "100%",
                padding: isMobile ? "14px" : "16px",
                background: "linear-gradient(135deg, #43a047 0%, #2e7d32 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                fontSize: isMobile ? "1rem" : "1.1rem",
                fontWeight: "700",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 16px rgba(67, 160, 71, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-4px)";
                e.target.style.boxShadow = "0 12px 24px rgba(67, 160, 71, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 16px rgba(67, 160, 71, 0.3)";
              }}
            >
              <ShoppingCart size={24} />
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>

        {/* Related Products */}
        <div style={{ marginTop: "60px" }}>
          <RelatedProducts productId={product.id} />
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          h1 {
            font-size: 1.5rem !important;
          }

          h3 {
            font-size: 1rem !important;
          }

          button {
            font-size: 1rem !important;
          }
        }

        ::-webkit-scrollbar {
          width: 8px;
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

export default ProductDetail;