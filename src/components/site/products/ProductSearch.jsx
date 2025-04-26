import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../../css/ProductSearch.css";

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
        const response = await fetch(`https://localhost:7177/api/Product/search?query=${query}`);
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

    axios.post('https://localhost:7177/api/Cart/add-item', {
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
    <div className="container my-5">
      <h2 className="mb-4">Kết quả tìm kiếm cho: <span className="text-primary">"{query}"</span></h2>

      {loading && <div className="alert alert-info">Đang tải dữ liệu...</div>}
      {error && <div className="alert alert-danger">Lỗi: {error}</div>}
      {!loading && products.length === 0 && <div className="alert alert-warning">Không có sản phẩm nào.</div>}

      <div className="row">
        {products.map((product) => (
          <div className="col-md-4 mb-4" key={product.id}>
            <div className="card h-100 shadow-sm">
              <img
                src={`https://localhost:7177${product.avatar}`}
                className="card-img-top"
                alt={product.name}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text text-truncate">{product.description}</p>
                <div className="mt-auto">
                  <p className="fw-bold text-success">{product.price.toLocaleString()} VND</p>
                  <Link to={`/products/${product.id}`} className="btn btn-outline-primary mt-3">
                  Xem chi tiết
                </Link>
                  <button
                    className="btn btn-outline-primary w-100"
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
