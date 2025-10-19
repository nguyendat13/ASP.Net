import React, { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";


import axios from "axios";

import { FaTags, FaMoneyBillWave, FaPercent, FaFolderOpen } from "react-icons/fa";
import RelatedProducts from "./RelatedProducts";
import API_BASE_URL from "../../../config";

const ProductDetail = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/Product/${id}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy chi tiết sản phẩm:", err);
      });
  }, [id]);
  
  const handleAddToCart = () => {
    const userId = localStorage.getItem('userId'); // đảm bảo bạn lưu user id khi login
    if (!userId) {
      alert("Bạn cần đăng nhập để thêm vào giỏ hàng!");
      navigate("/login-user");
      return;
    }

    axios.post(`${API_BASE_URL}/api/Cart/add-item`, {
      userId: parseInt(userId),
      productId: product.id,
      quantity: 1
    })
    .then(res => {
      alert("✅ Đã thêm vào giỏ hàng!");
      navigate("/carts");
    })
    .catch(err => {
      console.error("❌ Lỗi khi thêm vào giỏ hàng:", err);
      alert("❌ Không thể thêm vào giỏ hàng");
    });
  };
  if (!product) return <div>Loading...</div>;

  return (
    <div className="container-fluid mt-5" style={{ background: 'var(--background)', borderRadius: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', padding: '32px 0', minHeight: '80vh' }}>
      <h2 className="mb-4 text-center" style={{ color: 'var(--foreground)', fontWeight: 'bold', textShadow: 'none' }}>Chi tiết sản phẩm</h2>
      <div className="row justify-content-center align-items-center">
        <div className="col-12 col-md-5 mb-4 d-flex justify-content-center">
          <div className="pro-img-wrap" style={{ background: 'var(--card)', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', padding: '16px', transition: 'transform 0.2s' }}>
            <img
            src={
              product.avatar
                ? product.avatar.startsWith("http")
                  ? product.avatar
                  : `${API_BASE_URL}/api/Product/image/${product.avatar.replace("/images/", "")}`
                  : "https://via.placeholder.com/200x200?text=No+Image" 
              }              
              alt={product.name}
              style={{ maxHeight: '350px', maxWidth: '100%', objectFit: 'cover', borderRadius: '12px', border: '2px solid var(--primary)', background: 'var(--card)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', transition: 'transform 0.2s' }}
            />
          </div>
        </div>
        <div className="col-12 col-md-7">
          <h3 className="d-flex align-items-center mb-2" style={{ color: 'var(--foreground)', fontWeight: 'bold', fontSize: '2rem', textShadow: 'none' }}>
            <FaTags style={{ color: 'var(--primary)', marginRight: '10px' }} /> {product.name}
          </h3>
              <div
                style={{ color: 'var(--foreground)', fontSize: '1.1rem', textShadow: 'none' }}
                dangerouslySetInnerHTML={{ __html: product.description }}
              /> 
                       <div className="d-flex align-items-center mb-2" style={{ gap: '16px' }}>
            <span className="badge bg-success" style={{ fontSize: '1.15rem', fontWeight: 'bold', padding: '10px 18px', borderRadius: '8px', color: '#fff', background: 'var(--primary)' }}>
              <FaMoneyBillWave style={{ color: '#fff', marginRight: '8px' }} /> {product.price.toLocaleString()} đ
            </span>
            {product.discount > 0 && (
              <span className="badge bg-danger" style={{ fontSize: '1.05rem', fontWeight: 'bold', padding: '10px 14px', borderRadius: '8px', color: '#fff', background: '#e53935' }}>
                <FaPercent style={{ marginRight: '6px', color: '#fff' }} />-{product.discount}%
              </span>
            )}
          </div>
          <p className="d-flex align-items-center mb-2" style={{ color: 'var(--foreground)', fontWeight: 'bold', textShadow: 'none' }}>
            <FaFolderOpen style={{ color: 'var(--primary)', marginRight: '8px' }} /> Danh mục: {product.categoryName}
          </p>
          <button className="btn btn-warning mt-3 px-3 py-2" style={{ color: 'var(--card)', fontWeight: 'bold', fontSize: '1rem', border: 'none', background: 'var(--foreground)', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.10)', width: 'auto' }} onClick={handleAddToCart}>Thêm vào giỏ</button>
        </div>
      </div>
      <RelatedProducts productId={product.id} />
      <style>{`
        .pro-img-wrap img {
          transition: transform 0.2s;
        }
        .pro-img-wrap:hover img {
          transform: scale(1.08);
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;
