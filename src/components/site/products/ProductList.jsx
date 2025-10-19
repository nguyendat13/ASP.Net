import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTags, FaFolderOpen, FaPercent, FaMoneyBillWave } from "react-icons/fa";
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

  // 🔹 Lấy danh sách danh mục
  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/Category`)
      .then(res => setCategories(res.data))
      .catch(err => console.error("Lỗi khi lấy danh mục:", err));
  }, []);

  // 🔹 Lấy danh sách sản phẩm (có lọc)
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

  // 🔹 Xử lý thay đổi filter
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // 🔹 Reset filter
  const resetFilters = () => {
    setFilters({ categoryId: "", minPrice: "", maxPrice: "", sortBy: "" });
  };

  return (
    <div className="container-fluid mt-5" style={{ background: 'var(--background)', borderRadius: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', padding: '32px 0', minHeight: '80vh' }}>
      <h2 className="mb-4 text-center text-white fw-bold">Danh sách sản phẩm</h2>

      {/* 🧭 Bộ lọc */}
      <div className="filter-bar container mb-4 p-3 rounded" style={{ background: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <div className="row g-3 align-items-center">
          <div className="col-md-3">
            <label className="form-label fw-bold">Danh mục</label>
            <select className="form-select" name="categoryId" value={filters.categoryId} onChange={handleFilterChange}>
              <option value="">Tất cả</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label fw-bold">Giá từ</label>
            <input type="number" className="form-control" name="minPrice" placeholder="Min" value={filters.minPrice} onChange={handleFilterChange} />
          </div>

          <div className="col-md-3">
            <label className="form-label fw-bold">Đến</label>
            <input type="number" className="form-control" name="maxPrice" placeholder="Max" value={filters.maxPrice} onChange={handleFilterChange} />
          </div>

          <div className="col-md-3">
            <label className="form-label fw-bold">Sắp xếp theo</label>
            <select className="form-select" name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
              <option value="">Mặc định</option>
              <option value="price_asc">Giá tăng dần</option>
              <option value="price_desc">Giá giảm dần</option>
              <option value="name_asc">Tên A-Z</option>
              <option value="name_desc">Tên Z-A</option>
            </select>
          </div>
        </div>

        <div className="text-end mt-3">
          <button className="btn btn-secondary" onClick={resetFilters}>Làm mới</button>
        </div>
      </div>

      {/* 🛍️ Danh sách sản phẩm */}
      <div className="row g-4">
        {products.map((product) => (
          <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
            <div className="card h-100 shadow-sm pro-card" style={{ background: '#fff', color: '#23272a', border: 'none', boxShadow: '0 6px 24px rgba(0,0,0,0.18)', borderRadius: '16px' }}>
              <div className="pro-img-wrap" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f5f5f5', borderRadius: '12px', overflow: 'hidden', height: '200px', marginBottom: '8px' }}>
                <img
                  src={product.avatar
                    ? product.avatar.startsWith("http")
                      ? product.avatar
                      : `${API_BASE_URL}/api/Product/image/${product.avatar.replace("/images/", "")}`
                    : "https://via.placeholder.com/200x200?text=No+Image"}
                  alt={product.name}
                  style={{ maxHeight: "180px", maxWidth: "90%", objectFit: "cover", borderRadius: "12px" }}
                />
              </div>

              <div className="card-body d-flex flex-column justify-content-between">
                <h5 className="card-title d-flex align-items-center mb-2" style={{ fontWeight: 'bold' }}>
                  <FaTags className="me-2 text-success" /> {product.name}
                </h5>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="badge bg-success">
                    <FaMoneyBillWave className="me-1" /> {product.price.toLocaleString()} đ
                  </span>
                  {product.discount > 0 && (
                    <span className="badge bg-danger">
                      <FaPercent className="me-1" /> -{product.discount}%
                    </span>
                  )}
                </div>
                <p className="mb-0 d-flex align-items-center fw-bold">
                  <FaFolderOpen className="me-2 text-success" /> {product.categoryName}
                </p>
                <Link to={`/products/${product.id}`} className="btn btn-success w-100 mt-2">
                  Xem chi tiết
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
