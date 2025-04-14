import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get('https://localhost:7177/api/Product')
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError('Không thể tải danh sách sản phẩm.');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-4">
      <h2>Quản lý Sản phẩm</h2>
      <table className="table table-bordered table-hover mt-3">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Tên sản phẩm</th>
            <th>Mô tả</th>
            <th>Giá</th>
            <th>Giảm giá</th>
            <th>Ảnh</th>
            <th>Danh mục (ID)</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.description || 'Không có'}</td>
              <td>{p.price.toLocaleString()} đ</td>
              <td>{p.discount}%</td>
              <td>
                {p.avatar ? (
                  <img
                    src={p.avatar}
                    alt={p.name}
                    width="60"
                    height="60"
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  'Không có ảnh'
                )}
              </td>
              <td>{p.categoryId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
