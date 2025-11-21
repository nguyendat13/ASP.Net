import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import API_BASE_URL from "../../../config";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    categoryId: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "",
  });
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lấy danh sách danh mục
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/Category`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Lỗi khi lấy danh mục:", err));
  }, []);

  // Lấy danh sách sản phẩm (có lọc)
  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.categoryId) params.append("CategoryId", filters.categoryId);
      if (filters.minPrice) params.append("MinPrice", filters.minPrice);
      if (filters.maxPrice) params.append("MaxPrice", filters.maxPrice);
      if (filters.sortBy) params.append("SortBy", filters.sortBy);

      const res = await axios.get(`${API_BASE_URL}/api/Product/filter?${params.toString()}`);
      setProducts(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy sản phẩm:", err);
    }
  };

  // Xử lý thay đổi filter
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Reset filter
  const resetFilters = () => {
    setFilters({ categoryId: "", minPrice: "", maxPrice: "", sortBy: "" });
  };

  const renderProductCard = (product) => (
    <div
      key={product.id}
      onMouseEnter={() => setHoveredCard(product.id)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      <div
        style={{
          background: "#23272a",
          color: "#fff",
          border: "1px solid rgba(67, 160, 71, 0.15)",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: hoveredCard === product.id
            ? "0 20px 40px rgba(67, 160, 71, 0.15)"
            : "0 8px 24px rgba(0,0,0,0.3)",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: hoveredCard === product.id ? "translateY(-8px) scale(1.02)" : "translateY(0)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          cursor: "pointer",
        }}
      >
        {/* Image Section */}
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(135deg, #2a2f33 0%, #1e1e1e 100%)",
            borderRadius: "16px 16px 0 0",
            overflow: "hidden",
            height: isMobile ? "180px" : "200px",
            marginBottom: 0,
          }}
        >
          <img
            src={
              product.avatar
                ? product.avatar.startsWith("http")
                  ? product.avatar
                  : `${API_BASE_URL}/api/Product/image/${product.avatar.replace("/images/", "")}`
                : "https://via.placeholder.com/200x200?text=No+Image"
            }
            alt={product.name}
            style={{
              maxHeight: "100%",
              maxWidth: "90%",
              objectFit: "cover",
              transition: "transform 0.4s ease",
              transform: hoveredCard === product.id ? "scale(1.1)" : "scale(1)",
            }}
          />

          {/* Discount Badge */}
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

        {/* Content Section */}
        <div style={{ padding: isMobile ? "16px" : "20px", flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Product Name */}
          <h5
            style={{
              fontSize: isMobile ? "0.95rem" : "1.1rem",
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

          {/* Category */}
          {product.categoryName && (
            <p
              style={{
                fontSize: "0.8rem",
                color: "#81c784",
                marginBottom: "12px",
                fontWeight: "500",
              }}
            >
              📁 {product.categoryName}
            </p>
          )}

          {/* Price Section */}
          <div style={{ marginBottom: "16px" }}>
            <div
              style={{
                fontSize: isMobile ? "1.1rem" : "1.3rem",
                fontWeight: "700",
                color: "#43a047",
                letterSpacing: "-0.5px",
              }}
            >
              {product.price?.toLocaleString()} ₫
            </div>
            {product.discount > 0 && (
              <p
                style={{
                  margin: "4px 0 0 0",
                  fontSize: "0.8rem",
                  color: "#999",
                  textDecoration: "line-through",
                }}
              >
                {(product.price * (100 + product.discount) / 100).toLocaleString()} ₫
              </p>
            )}
          </div>

          {/* View Details Button */}
          <Link
            to={`/products/${product.id}`}
            style={{
              display: "block",
              width: "100%",
              padding: isMobile ? "12px" : "14px",
              background: "linear-gradient(135deg, #43a047 0%, #2e7d32 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              fontSize: isMobile ? "0.9rem" : "0.95rem",
              fontWeight: "600",
              textDecoration: "none",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: hoveredCard === product.id
                ? "0 8px 20px rgba(67, 160, 71, 0.3)"
                : "0 4px 12px rgba(67, 160, 71, 0.15)",
              transform: hoveredCard === product.id ? "translateX(2px)" : "translateX(0)",
              marginTop: "auto",
            }}
          >
            Xem chi tiết →
          </Link>
        </div>
      </div>
    </div>
  );

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
          textAlign: "center",
          marginBottom: "30px",
          borderRadius: "0 0 16px 16px",
        }}
      >
        <h2
          style={{
            fontSize: isMobile ? "1.5rem" : "2.5rem",
            fontWeight: "700",
            margin: 0,
            letterSpacing: "-0.5px",
          }}
        >
          🛍️ Danh sách sản phẩm
        </h2>
      </div>

      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: isMobile ? "0 15px" : "0 20px",
        }}
      >
        {/* Filter Section */}
        <div
          style={{
            background: "#23272a",
            border: "1px solid rgba(67, 160, 71, 0.15)",
            borderRadius: "16px",
            padding: isMobile ? "20px" : "30px",
            marginBottom: "40px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
          }}
        >
          <h3
            style={{
              fontSize: isMobile ? "1.1rem" : "1.3rem",
              fontWeight: "700",
              color: "#fff",
              marginBottom: "20px",
              borderBottom: "2px solid #43a047",
              paddingBottom: "12px",
            }}
          >
            🔍 Bộ lọc sản phẩm
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            {/* Category Filter */}
            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: "600",
                  color: "#fff",
                  marginBottom: "8px",
                  fontSize: "0.95rem",
                }}
              >
                📁 Danh mục
              </label>
              <select
                name="categoryId"
                value={filters.categoryId}
                onChange={handleFilterChange}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "#1e1e1e",
                  color: "#fff",
                  border: "1px solid #43a047",
                  borderRadius: "8px",
                  fontSize: "0.95rem",
                  cursor: "pointer",
                }}
              >
                <option value="">Tất cả danh mục</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Price */}
            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: "600",
                  color: "#fff",
                  marginBottom: "8px",
                  fontSize: "0.95rem",
                }}
              >
                💰 Giá từ
              </label>
              <input
                type="number"
                name="minPrice"
                placeholder="Nhập giá tối thiểu"
                value={filters.minPrice}
                onChange={handleFilterChange}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "#1e1e1e",
                  color: "#fff",
                  border: "1px solid #43a047",
                  borderRadius: "8px",
                  fontSize: "0.95rem",
                }}
              />
            </div>

            {/* Max Price */}
            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: "600",
                  color: "#fff",
                  marginBottom: "8px",
                  fontSize: "0.95rem",
                }}
              >
                💰 Đến
              </label>
              <input
                type="number"
                name="maxPrice"
                placeholder="Nhập giá tối đa"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "#1e1e1e",
                  color: "#fff",
                  border: "1px solid #43a047",
                  borderRadius: "8px",
                  fontSize: "0.95rem",
                }}
              />
            </div>

            {/* Sort By */}
            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: "600",
                  color: "#fff",
                  marginBottom: "8px",
                  fontSize: "0.95rem",
                }}
              >
                📊 Sắp xếp theo
              </label>
              <select
                name="sortBy"
                value={filters.sortBy}
                onChange={handleFilterChange}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "#1e1e1e",
                  color: "#fff",
                  border: "1px solid #43a047",
                  borderRadius: "8px",
                  fontSize: "0.95rem",
                  cursor: "pointer",
                }}
              >
                <option value="">Mặc định</option>
                <option value="price_asc">Giá tăng dần ⬆️</option>
                <option value="price_desc">Giá giảm dần ⬇️</option>
                <option value="name_asc">Tên A-Z</option>
                <option value="name_desc">Tên Z-A</option>
              </select>
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={resetFilters}
            style={{
              width: isMobile ? "100%" : "auto",
              padding: "12px 30px",
              background: "linear-gradient(135deg, #43a047 0%, #2e7d32 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 12px rgba(67, 160, 71, 0.2)",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 8px 20px rgba(67, 160, 71, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 12px rgba(67, 160, 71, 0.2)";
            }}
          >
            ↻ Làm mới bộ lọc
          </button>
        </div>

        {/* Products Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? "150px" : "220px"}, 1fr))`,
            gap: "24px",
            marginBottom: "40px",
          }}
        >
          {products.length > 0 ? (
            products.map((product) => renderProductCard(product))
          ) : (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "60px 20px",
                color: "#aaa",
              }}
            >
              <p style={{ fontSize: "1.2rem", marginBottom: "10px" }}>😔 Không tìm thấy sản phẩm</p>
              <p>Thử thay đổi bộ lọc hoặc làm mới để xem thêm sản phẩm</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }

        @media (max-width: 768px) {
          h2 {
            font-size: 1.3rem !important;
          }

          h3 {
            font-size: 1rem !important;
          }

          input,
          select {
            font-size: 16px !important;
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

export default ProductList;