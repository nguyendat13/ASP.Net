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
    <div className="container-fluid mt-5" style={{ background: 'var(--background)', borderRadius: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', padding: '32px 0', minHeight: '80vh' }}>
      <h2 className="mb-4 text-center" style={{ color: 'var(--foreground)', fontWeight: 'bold', textShadow: 'none' }}>Sản phẩm trong danh mục {category ? category.name : 'loading...'}</h2>
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
                <p className="card-text" style={{ color: 'var(--foreground)', textShadow: 'none' }}>{product.description}</p>
                <p className="mb-1 d-flex align-items-center" style={{ fontSize: '1.1rem', color: 'var(--primary)', fontWeight: 'bold' }}>
                  <FaMoneyBillWave style={{ color: 'var(--foreground)', marginRight: '8px' }} />
                  {product.price - (product.price * product.discount) / 100} VND
                </p>
                {product.discount > 0 && (
                  <p className="mb-1 d-flex align-items-center" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
                    <FaPercent style={{ marginRight: '8px', color: 'var(--foreground)' }} /> Giảm giá: {product.discount}%
                  </p>
                )}
                <a href={`/products/${product.id}`} className="btn btn-outline-warning mt-3" style={{ color: 'var(--card)', fontWeight: 'bold', border: '2px solid var(--primary)', background: 'var(--primary)' }}>
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
