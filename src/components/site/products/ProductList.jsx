import React, { useEffect, useState } from "react";


import axios from "axios";

import { FaTags, FaFolderOpen, FaPercent, FaMoneyBillWave } from "react-icons/fa";
import { Link } from "react-router-dom";
import API_BASE_URL from "../../../config";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/Product`) // Đổi port nếu cần
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy sản phẩm:", err);
      });
  }, []);

  return (
    <div className="container-fluid mt-5" style={{ background: 'linear-gradient(120deg, #23272b 70%, #4CAF50 100%)', borderRadius: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', padding: '32px 0', minHeight: '80vh' }}>
      <h2 className="mb-4 text-center" style={{ color: '#FFD700', fontWeight: 'bold', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>Danh sách sản phẩm</h2>
      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
            <div className="card h-100 shadow-sm rounded" style={{ background: '#23272b', color: '#FFD700', border: '2px solid #FFA500', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#23272b', borderRadius: '8px', overflow: 'hidden', height: '200px', marginBottom: '8px', boxShadow: '0 2px 12px rgba(0,0,0,0.2)' }}>
                <img
                  src={`${API_BASE_URL}${product.avatar}`}
                  alt={product.name}
                  style={{ maxHeight: '180px', maxWidth: '90%', objectFit: 'contain', borderRadius: '8px', border: '2px solid #FFA500', background: '#23272b', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                />
              </div>
              <div className="card-body d-flex flex-column">
                <h5 className="card-title d-flex align-items-center" style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '1.1rem' }}>
                  <FaTags style={{ color: '#FFA500', marginRight: '8px' }} /> {product.name}
                </h5>
                <p className="card-text flex-grow-1" style={{ color: '#FFA500' }}>
                  {product.description?.length > 100
                    ? product.description.substring(0, 100) + "..."
                    : product.description}
                </p>
                <p className="mb-1 d-flex align-items-center" style={{ fontSize: '1.1rem', color: '#FFD700', fontWeight: 'bold' }}>
                  <FaMoneyBillWave style={{ color: '#FFA500', marginRight: '8px' }} /> {product.price.toLocaleString()} đ
                </p>
                {product.discount > 0 && (
                  <p className="mb-1 d-flex align-items-center" style={{ color: '#FFA500', fontWeight: 'bold' }}>
                    <FaPercent style={{ marginRight: '8px' }} /> Giảm giá: {product.discount}%
                  </p>
                )}
                <p className="mb-0 d-flex align-items-center" style={{ color: '#FFD700', fontWeight: 'bold' }}>
                  <FaFolderOpen style={{ color: '#FFA500', marginRight: '8px' }} /> {product.categoryName}
                </p>
                <Link to={`/products/${product.id}`} className="btn btn-outline-warning mt-3" style={{ color: '#23272b', fontWeight: 'bold', border: '2px solid #FFA500', background: '#FFD700' }}>
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
