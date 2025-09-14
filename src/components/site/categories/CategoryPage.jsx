import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTags, FaMoneyBillWave, FaPercent } from "react-icons/fa";
import API_BASE_URL from '../../../config';

const CategoryProductsPage = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null); // Thêm state để lưu thông tin danh mục
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productResponse = await axios.get(`${API_BASE_URL}/api/Category/products/${categoryId}`);
        setProducts(productResponse.data);

        // Fetch danh mục
        const categoryResponse = await axios.get(`${API_BASE_URL}/api/Category/${categoryId}`);
        setCategory(categoryResponse.data); // Lưu thông tin danh mục
      } catch (err) {
        setError('Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container-fluid mt-5" style={{ background: 'linear-gradient(120deg, #23272b 70%, #4CAF50 100%)', borderRadius: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', padding: '32px 0', minHeight: '80vh' }}>
      <h2 className="mb-4 text-center" style={{ color: '#FFD700', fontWeight: 'bold', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>Sản phẩm trong danh mục {category ? category.name : 'loading...'}</h2>
      <div className="row">
        {products.map((product) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={product.id}>
            <div className="card h-100 shadow-sm rounded" style={{ background: '#23272b', color: '#FFD700', border: '2px solid #FFA500', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#23272b', borderRadius: '8px', overflow: 'hidden', height: '200px', marginBottom: '8px', boxShadow: '0 2px 12px rgba(0,0,0,0.2)' }}>
                <img
                  src={`${API_BASE_URL}/api/Product/image${product.avatar}`}
                  alt={product.name}
                  style={{ maxHeight: '180px', maxWidth: '90%', objectFit: 'contain', borderRadius: '8px', border: '2px solid #FFA500', background: '#23272b', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                />
              </div>
              <div className="card-body d-flex flex-column">
                <h5 className="card-title d-flex align-items-center" style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '1.1rem' }}>
                  <FaTags style={{ color: '#FFA500', marginRight: '8px' }} /> {product.name}
                </h5>
                <p className="card-text" style={{ color: '#FFA500' }}>{product.description}</p>
                <p className="mb-1 d-flex align-items-center" style={{ fontSize: '1.1rem', color: '#FFD700', fontWeight: 'bold' }}>
                  <FaMoneyBillWave style={{ color: '#FFA500', marginRight: '8px' }} />
                  {product.price - (product.price * product.discount) / 100} VND
                </p>
                {product.discount > 0 && (
                  <p className="mb-1 d-flex align-items-center" style={{ color: '#FFA500', fontWeight: 'bold' }}>
                    <FaPercent style={{ marginRight: '8px' }} /> Giảm giá: {product.discount}%
                  </p>
                )}
                <a href={`/products/${product.id}`} className="btn btn-outline-warning mt-3" style={{ color: '#23272b', fontWeight: 'bold', border: '2px solid #FFA500', background: '#FFD700' }}>
                  Xem chi tiết
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryProductsPage;
