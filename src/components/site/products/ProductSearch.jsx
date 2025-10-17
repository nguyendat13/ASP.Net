import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';


import axios from "axios";

import { FaTags, FaMoneyBillWave } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../../css/ProductSearch.css";
import API_BASE_URL from '../../../config';

const SearchPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");
  const navigate = useNavigate();

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    setError(null);

    const fetchSearchResults = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/Product/search?query=${query}`);
        if (!response.ok) {
          throw new Error('Lỗi khi tìm kiếm sản phẩm');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  const handleAddToCart = (productId) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert("Bạn cần đăng nhập để thêm vào giỏ hàng!");
      navigate("/login-user");
      return;
    }

    axios.post(`${API_BASE_URL}/api/Cart/add-item`, {
      userId: parseInt(userId),
      productId,
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

  return (
    <div className="container-fluid my-5" style={{ background: 'var(--background)', borderRadius: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', padding: '32px 0', minHeight: '80vh' }}>
      <h2 className="mb-4 text-center" style={{ color: '#fff', fontWeight: 'bold', textShadow: 'none' }}>Kết quả tìm kiếm cho: <span style={{ color: '#fff' }}>&quot;{query}&quot;</span></h2>

      {loading && <div className="alert alert-info">Đang tải dữ liệu...</div>}
      {error && <div className="alert alert-danger">Lỗi: {error}</div>}
      {!loading && products.length === 0 && <div className="alert alert-warning">Không có sản phẩm nào.</div>}

      <div className="row g-4">
        {products.map((product) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={product.id}>
            <div className="card h-100 shadow-sm pro-card" style={{ background: '#fff', color: '#23272a', border: 'none', boxShadow: '0 6px 24px rgba(0,0,0,0.18)', borderRadius: '16px', transition: 'transform 0.2s, box-shadow 0.2s' }}>
              <div className="pro-img-wrap" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f5f5f5', borderRadius: '12px', overflow: 'hidden', height: '200px', marginBottom: '8px', boxShadow: '0 2px 12px rgba(0,0,0,0.2)' }}>
               <img
  src={
    product.avatar.startsWith("http")
      ? product.avatar
      : `${API_BASE_URL}/api/Product/image/${product.avatar.replace("/images/", "")}`
  }
  alt={product.name}
  style={{
    maxHeight: "180px",
    maxWidth: "90%",
    objectFit: "cover",
    borderRadius: "12px",
    border: "2px solid #43a047",
    background: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    transition: "transform 0.2s"
  }}
/>

              </div>
              <div className="card-body d-flex flex-column justify-content-between">
                <h5 className="card-title d-flex align-items-center mb-2" style={{ color: '#23272a', fontWeight: 'bold', fontSize: '1.1rem', textShadow: 'none' }}>
                  <FaTags style={{ color: '#43a047', marginRight: '8px' }} /> {product.name}
                </h5>
                <p className="card-text mb-2 text-truncate" style={{ color: '#23272a', textShadow: 'none', fontSize: '0.98rem' }}dangerouslySetInnerHTML={{ __html: product.description }}/>
                <div className="mt-auto d-flex justify-content-between align-items-center mb-2">
                  <span className="badge bg-success" style={{ fontSize: '1rem', fontWeight: 'bold', padding: '8px 14px', borderRadius: '8px', color: '#fff', background: '#43a047' }}>
                    <FaMoneyBillWave style={{ color: '#fff', marginRight: '6px' }} /> {product.price.toLocaleString()} VND
                  </span>
                </div>
                <Link to={`/products/${product.id}`} className="btn btn-success w-100 mt-2" style={{ color: '#fff', fontWeight: 'bold', border: 'none', background: '#43a047', borderRadius: '8px', fontSize: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}>
                  Xem chi tiết
                </Link>
                <button
                  className="btn btn-success w-100 mt-2"
                  style={{ color: '#fff', fontWeight: 'bold', border: 'none', background: '#43a047', borderRadius: '8px', fontSize: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}
                  onClick={() => handleAddToCart(product.id)}
                >
                  Thêm vào giỏ hàng
                </button>
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

export default SearchPage;
