import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


import axios from "axios";

import { FaTags, FaMoneyBillWave } from "react-icons/fa";
import API_BASE_URL from "../../../config";

const RelatedProducts = ({ productId }) => {
  const [related, setRelated] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/Product/related?productId=${productId}`);
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

    axios.post(`${API_BASE_URL}/api/Cart/add-item`, {
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
    <div className="mt-5">
      <h4 style={{ color: '#fff', fontWeight: 'bold', textShadow: 'none' }}>Sản phẩm liên quan</h4>
      <div className="row g-3">
        {related.map((product) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3" key={product.id}>
            <div className="card h-100 shadow-sm pro-card" style={{ background: '#fff', color: '#23272a', border: 'none', boxShadow: '0 6px 24px rgba(0,0,0,0.18)', borderRadius: '16px', transition: 'transform 0.2s, box-shadow 0.2s' }}>
              <div className="pro-img-wrap" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f5f5f5', borderRadius: '12px', overflow: 'hidden', height: '150px', marginBottom: '8px', boxShadow: '0 2px 12px rgba(0,0,0,0.2)' }}>
                <img
src={
    product.avatar.startsWith("http")
      ? product.avatar
      : `${API_BASE_URL}/api/Product/image/${product.avatar.replace("/images/", "")}`
  }                  alt={product.name}
                  style={{ maxHeight: '130px', maxWidth: '90%', objectFit: 'cover', borderRadius: '12px', border: '2px solid #43a047', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', transition: 'transform 0.2s' }}
                />
              </div>
              <div className="card-body d-flex flex-column justify-content-between">
                <h6 className="card-title d-flex align-items-center mb-2" style={{ color: '#23272a', fontWeight: 'bold', fontSize: '1rem', textShadow: 'none' }}>
                  <FaTags style={{ color: '#43a047', marginRight: '8px' }} /> {product.name}
                </h6>
                <span className="badge bg-success mb-2" style={{ fontSize: '1rem', fontWeight: 'bold', padding: '8px 14px', borderRadius: '8px', color: '#fff', background: '#43a047' }}>
                  <FaMoneyBillWave style={{ color: '#fff', marginRight: '6px' }} /> {product.price.toLocaleString()} VND
                </span>
                <div className="mt-auto d-flex flex-column gap-2">
                  <button
                    className="btn btn-sm btn-success"
                    style={{ color: '#fff', fontWeight: 'bold', border: 'none', background: '#43a047', borderRadius: '8px', fontSize: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    Xem chi tiết
                  </button>
                  <button
                    className="btn btn-sm btn-success"
                    style={{ color: '#fff', fontWeight: 'bold', border: 'none', background: '#43a047', borderRadius: '8px', fontSize: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}
                    onClick={() => handleAddToCart(product)}
                  >
                    Thêm vào giỏ hàng
                  </button>
                </div>
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

export default RelatedProducts;
