import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import API_BASE_URL from '../../../config';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/Product`)
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Không thể tải danh sách sản phẩm.');
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xoá sản phẩm này?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/Product/${id}`);
        setProducts(products.filter((p) => p.id !== id));
      } catch (err) {
        alert('Xoá thất bại!');
      }
    }
  };

  const getImageUrl = (avatarPath) => {
    if (!avatarPath) return null;
    const filename = avatarPath.split('/').pop();
    return `${API_BASE_URL}/api/Product/image/${filename}`;
  };
  


  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-4">
      <h2>Quản lý Sản phẩm</h2>
      <div className="mb-3">
        <Link to="/admin/products/create" className="btn btn-success">
          Thêm sản phẩm
        </Link>
      </div>
      <table className="table table-bordered table-hover mt-3">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Tên sản phẩm</th>
            <th>Mô tả</th>
            <th>Giá</th>
            <th>Giảm giá</th>
            <th>Ảnh</th>
            <th>Danh mục</th>
            <th>Hành động</th>
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
                {getImageUrl(p.avatar) ? (
                  <img
                    src={getImageUrl(p.avatar)}
                    alt={p.name}
                    width="60"
                    height="60"
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <span>Không có ảnh</span>
                )}
              </td>
              <td>{p.categoryName}</td>
              <td className="d-flex gap-2">
                <Link to={`/admin/products/detail/${p.id}`} className="btn btn-info btn-sm">
                  <FaEye />
                </Link>
                <Link to={`/admin/products/edit/${p.id}`} className="btn btn-warning btn-sm">
                  <FaEdit />
                </Link>
                <button onClick={() => handleDelete(p.id)} className="btn btn-danger btn-sm">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
