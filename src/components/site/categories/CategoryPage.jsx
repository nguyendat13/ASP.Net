import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const CategoryProductsPage = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null); // Thêm state để lưu thông tin danh mục
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productResponse = await axios.get(`https://localhost:7177/api/Category/products/${categoryId}`);
        setProducts(productResponse.data);

        // Fetch danh mục
        const categoryResponse = await axios.get(`https://localhost:7177/api/Category/${categoryId}`);
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
    <div className="container">
      {/* Hiển thị tên danh mục */}
      <h1>Sản phẩm trong danh mục {category ? category.name : 'loading...'}</h1>

      <div className="row">
        {products.map((product) => (
          <div className="col-md-4" key={product.id}>
            <div className="card mb-4">
              <img
                src={`https://localhost:7177${product.avatar}`}
                alt={product.name}
                className="card-img-top"
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description}</p>
                <p className="card-text">
                  Giá: {product.price - (product.price * product.discount) / 100} VND
                </p>
                <a href={`/products/${product.id}`} className="btn btn-primary">
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
