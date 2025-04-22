import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaEye, FaEdit, FaTrashAlt } from 'react-icons/fa';

const Topics = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = 'https://localhost:7177/api/Topic';

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = () => {
    axios
      .get(API_URL)
      .then((res) => {
        setTopics(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Lỗi khi tải chủ đề');
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xoá chủ đề này không?')) {
      axios.delete(`${API_URL}/${id}`).then(fetchTopics);
    }
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <h2>Quản lý Chủ đề</h2>
      <Link to="/admin/topics/create" className="btn btn-primary mb-3">
        Thêm Chủ đề
      </Link>
      <table className="table table-bordered table-hover mt-3">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Tên chủ đề</th>
            <th>Mô tả</th>
            <th>Chức năng</th>
          </tr>
        </thead>
        <tbody>
          {topics.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.title}</td>
              <td>{t.description || 'Không có mô tả'}</td>
              <td>
                <Link to={`/admin/topics/detail/${t.id}`} className="btn btn-sm btn-info me-2">
                  <FaEye />
                </Link>
                <Link to={`/admin/topics/edit/${t.id}`} className="btn btn-sm btn-warning me-2">
                  <FaEdit />
                </Link>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(t.id)}>
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

export default Topics;
