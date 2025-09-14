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
      <h2 className="mb-4 text-center" style={{ color: 'var(--foreground)', fontWeight: 'bold', textShadow: 'none' }}>Danh sách sản phẩm</h2>
      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
            <div className="card h-100 shadow-sm rounded" style={{ background: 'var(--card)', color: 'var(--foreground)', border: '2px solid var(--primary)', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--card)', borderRadius: '8px', overflow: 'hidden', height: '200px', marginBottom: '8px', boxShadow: '0 2px 12px rgba(0,0,0,0.2)' }}>
                <img
                  src={`${API_BASE_URL}/api/Product/image/${product.avatar}`}
                  alt={product.name}
                  style={{ maxHeight: '180px', maxWidth: '90%', objectFit: 'contain', borderRadius: '8px', border: '2px solid var(--primary)', background: 'var(--card)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                />
              </div>
              <div className="card-body d-flex flex-column">
                <h5 className="card-title d-flex align-items-center" style={{ color: 'var(--foreground)', fontWeight: 'bold', fontSize: '1.1rem', textShadow: 'none' }}>
                  <FaTags style={{ color: 'var(--primary)', marginRight: '8px' }} /> {product.name}
                </h5>
                <p className="card-text flex-grow-1" style={{ color: 'var(--foreground)', textShadow: 'none' }}>
                  {product.description?.length > 100
                    ? product.description.substring(0, 100) + "..."
                    : product.description}
                </p>
                <p className="mb-1 d-flex align-items-center" style={{ fontSize: '1.1rem', color: 'var(--primary)', fontWeight: 'bold' }}>
                  <FaMoneyBillWave style={{ color: 'var(--foreground)', marginRight: '8px' }} /> {product.price.toLocaleString()} đ
                </p>
                {product.discount > 0 && (
                  <p className="mb-1 d-flex align-items-center" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
                    <FaPercent style={{ marginRight: '8px', color: 'var(--foreground)' }} /> Giảm giá: {product.discount}%
                  </p>
                )}
                <p className="mb-0 d-flex align-items-center" style={{ color: 'var(--foreground)', fontWeight: 'bold', textShadow: 'none' }}>
                  <FaFolderOpen style={{ color: 'var(--primary)', marginRight: '8px' }} /> {product.categoryName}
                </p>
                <Link to={`/products/${product.id}`} className="btn btn-outline-warning mt-3" style={{ color: 'var(--card)', fontWeight: 'bold', border: '2px solid var(--primary)', background: 'var(--primary)' }}>
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
