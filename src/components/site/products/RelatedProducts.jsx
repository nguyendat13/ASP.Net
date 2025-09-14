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
      <h4 style={{ color: 'var(--foreground)', fontWeight: 'bold', textShadow: 'none' }}>Sản phẩm liên quan</h4>
      <div className="row">
        {related.map((product) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3" key={product.id}>
            <div className="card h-100 shadow-sm rounded" style={{ background: 'var(--card)', color: 'var(--foreground)', border: '2px solid var(--primary)', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--card)', borderRadius: '8px', overflow: 'hidden', height: '150px', marginBottom: '8px', boxShadow: '0 2px 12px rgba(0,0,0,0.2)' }}>
                <img
                  src={`${API_BASE_URL}/api/Product/image/${product.avatar}`}
                  alt={product.name}
                  style={{ maxHeight: '130px', maxWidth: '90%', objectFit: 'contain', borderRadius: '8px', border: '2px solid var(--primary)', background: 'var(--card)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                />
              </div>
              <div className="card-body d-flex flex-column">
                <h6 className="card-title d-flex align-items-center" style={{ color: 'var(--foreground)', fontWeight: 'bold', fontSize: '1rem', textShadow: 'none' }}>
                  <FaTags style={{ color: 'var(--primary)', marginRight: '8px' }} /> {product.name}
                </h6>
                <p className="mb-2 d-flex align-items-center" style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1rem' }}>
                  <FaMoneyBillWave style={{ color: 'var(--foreground)', marginRight: '8px' }} /> {product.price.toLocaleString()} VND
                </p>
                <div className="mt-auto d-flex flex-column gap-2">
                  <button
                    className="btn btn-sm btn-outline-warning"
                    style={{ color: 'var(--card)', fontWeight: 'bold', border: '2px solid var(--primary)', background: 'var(--primary)' }}
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    Xem chi tiết
                  </button>
                  <button
                    className="btn btn-sm btn-warning"
                    style={{ color: 'var(--card)', fontWeight: 'bold', border: '2px solid var(--primary)', background: 'var(--primary)' }}
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
    </div>
  );
};

export default RelatedProducts;
