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
    <div className="container-fluid mt-5" style={{ background: 'var(--background)', borderRadius: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', padding: '32px 0', minHeight: '80vh' }}>
      <h2 className="mb-4 text-center" style={{ color: '#fff', fontWeight: 'bold', textShadow: 'none' }}>Danh sách sản phẩm</h2>
      <div className="row g-4">
        {products.map((product) => (
          <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
            <div className="card h-100 shadow-sm pro-card" style={{ background: '#fff', color: '#23272a', border: 'none', boxShadow: '0 6px 24px rgba(0,0,0,0.18)', borderRadius: '16px', transition: 'transform 0.2s, box-shadow 0.2s' }}>
              <div className="pro-img-wrap" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f5f5f5', borderRadius: '12px', overflow: 'hidden', height: '200px', marginBottom: '8px', boxShadow: '0 2px 12px rgba(0,0,0,0.2)' }}>
                <img
                  src={`${API_BASE_URL}/api/Product/image/${product.avatar}`}
                  alt={product.name}
                  style={{ maxHeight: '180px', maxWidth: '90%', objectFit: 'cover', borderRadius: '12px', border: '2px solid #43a047', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', transition: 'transform 0.2s' }}
                />
              </div>
              <div className="card-body d-flex flex-column justify-content-between">
                <h5 className="card-title d-flex align-items-center mb-2" style={{ color: '#23272a', fontWeight: 'bold', fontSize: '1.1rem', textShadow: 'none' }}>
                  <FaTags style={{ color: '#43a047', marginRight: '8px' }} /> {product.name}
                </h5>
                <p className="card-text mb-2 flex-grow-1" style={{ color: '#23272a', textShadow: 'none', fontSize: '0.98rem' }}>
                  {product.description?.length > 100
                    ? product.description.substring(0, 100) + "..."
                    : product.description}
                </p>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="badge bg-success" style={{ fontSize: '1rem', fontWeight: 'bold', padding: '8px 14px', borderRadius: '8px', color: '#fff', background: '#43a047' }}>
                    <FaMoneyBillWave style={{ color: '#fff', marginRight: '6px' }} /> {product.price.toLocaleString()} đ
                  </span>
                  {product.discount > 0 && (
                    <span className="badge bg-danger" style={{ fontSize: '0.95rem', fontWeight: 'bold', padding: '8px 12px', borderRadius: '8px', color: '#fff', background: '#e53935' }}>
                      <FaPercent style={{ marginRight: '6px', color: '#fff' }} />-{product.discount}%
                    </span>
                  )}
                </div>
                <p className="mb-0 d-flex align-items-center" style={{ color: '#23272a', fontWeight: 'bold', textShadow: 'none' }}>
                  <FaFolderOpen style={{ color: '#43a047', marginRight: '8px' }} /> {product.categoryName}
                </p>
                <Link to={`/products/${product.id}`} className="btn btn-success w-100 mt-2" style={{ color: '#fff', fontWeight: 'bold', border: 'none', background: '#43a047', borderRadius: '8px', fontSize: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}>
                  Xem chi tiết
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        .pro-card:hover {
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

export default ProductList;
