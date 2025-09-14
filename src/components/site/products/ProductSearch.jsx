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
      <h2 className="mb-4 text-center" style={{ color: 'var(--foreground)', fontWeight: 'bold', textShadow: 'none' }}>Kết quả tìm kiếm cho: <span style={{ color: 'var(--foreground)' }}>&quot;{query}&quot;</span></h2>

      {loading && <div className="alert alert-info">Đang tải dữ liệu...</div>}
      {error && <div className="alert alert-danger">Lỗi: {error}</div>}
      {!loading && products.length === 0 && <div className="alert alert-warning">Không có sản phẩm nào.</div>}

      <div className="row">
        {products.map((product) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={product.id}>
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
                <p className="card-text text-truncate" style={{ color: 'var(--foreground)', textShadow: 'none' }}>{product.description}</p>
                <div className="mt-auto">
                  <p className="fw-bold d-flex align-items-center" style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.1rem' }}>
                    <FaMoneyBillWave style={{ color: 'var(--foreground)', marginRight: '8px' }} /> {product.price.toLocaleString()} VND
                  </p>
                  <Link to={`/products/${product.id}`} className="btn btn-outline-warning mt-3" style={{ color: 'var(--card)', fontWeight: 'bold', border: '2px solid var(--primary)', background: 'var(--primary)' }}>
                    Xem chi tiết
                  </Link>
                  <button
                    className="btn btn-outline-warning w-100 mt-2"
                    style={{ color: 'var(--card)', fontWeight: 'bold', border: '2px solid var(--primary)', background: 'var(--primary)' }}
                    onClick={() => handleAddToCart(product.id)}
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

export default SearchPage;
