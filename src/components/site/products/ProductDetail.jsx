import React, { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import axios from "axios";
import { FaTags, FaMoneyBillWave, FaPercent, FaFolderOpen } from "react-icons/fa";
import RelatedProducts from "./RelatedProducts";

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

    axios.post(`${API_BASE_URL}/Cart/add-item', {
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
    <div className="container-fluid mt-5" style={{ background: 'linear-gradient(120deg, #23272b 70%, #4CAF50 100%)', borderRadius: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', padding: '32px 0', minHeight: '80vh' }}>
      <h2 className="mb-4 text-center" style={{ color: '#FFD700', fontWeight: 'bold', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>Chi tiết sản phẩm</h2>
      <div className="row justify-content-center align-items-center">
        <div className="col-12 col-md-5 mb-4 d-flex justify-content-center">
          <div style={{ background: '#23272b', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', padding: '16px' }}>
            <img
              src={`${API_BASE_URL}${product.avatar}`}
              alt={product.name}
              style={{ maxHeight: '350px', maxWidth: '100%', objectFit: 'contain', borderRadius: '12px', border: '2px solid #FFA500', background: '#23272b', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
            />
          </div>
        </div>
        <div className="col-12 col-md-7">
          <h3 className="d-flex align-items-center" style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '2rem' }}>
            <FaTags style={{ color: '#FFA500', marginRight: '10px' }} /> {product.name}
          </h3>
          <p style={{ color: '#FFA500', fontSize: '1.1rem' }}>{product.description}</p>
          <p className="d-flex align-items-center" style={{ fontSize: '1.3rem', color: '#FFD700', fontWeight: 'bold' }}>
            <FaMoneyBillWave style={{ color: '#FFA500', marginRight: '8px' }} /> {product.price.toLocaleString()} đ
          </p>
          {product.discount > 0 && (
            <p className="d-flex align-items-center" style={{ color: '#FFA500', fontWeight: 'bold' }}>
              <FaPercent style={{ marginRight: '8px' }} /> Giảm giá: {product.discount}%
            </p>
          )}
          <p className="d-flex align-items-center" style={{ color: '#FFD700', fontWeight: 'bold' }}>
            <FaFolderOpen style={{ color: '#FFA500', marginRight: '8px' }} /> Danh mục: {product.categoryName}
          </p>
          <button className="btn btn-warning mt-3 px-4 py-2" style={{ color: '#23272b', fontWeight: 'bold', fontSize: '1.1rem', border: '2px solid #FFA500', background: '#FFD700' }} onClick={handleAddToCart}>Thêm vào giỏ</button>
        </div>
      </div>
      <RelatedProducts productId={product.id} />
    </div>
  );
};

export default ProductDetail;
