import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaEye, FaEdit, FaTrashAlt } from 'react-icons/fa';  // Import icon từ react-icons
import API_BASE_URL from '../../../config';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = `${API_BASE_URL}/api/Category`;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    axios
      .get(API_URL)
      .then((res) => {
        setCategories(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Lỗi khi tải danh mục');
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xoá danh mục này không?')) {
      axios.delete(`${API_URL}/${id}`).then(fetchCategories);
    }
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <h2>Quản lý Danh mục</h2>
      <Link to="/admin/categories/create" className="btn btn-primary mb-3">
        Thêm Danh mục
      </Link>
      <table className="table table-bordered table-hover mt-3">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Tên danh mục</th>
            <th>Mô tả</th>
            <th>Chức năng</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>{c.description || 'Không có mô tả'}</td>
              <td>
                <Link to={`/admin/categories/detail/${c.id}`} className="btn btn-sm btn-info me-2">
                  <FaEye /> 
                </Link>
                <Link to={`/admin/categories/edit/${c.id}`} className="btn btn-sm btn-warning me-2">
                  <FaEdit /> 
                </Link>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.id)}>
                  <FaTrashAlt /> 
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Categories;
