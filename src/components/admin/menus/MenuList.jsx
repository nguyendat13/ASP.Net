import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaEye, FaEdit, FaTrashAlt } from 'react-icons/fa';

const Menus = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = `${API_BASE_URL}/Menu';

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = () => {
    axios
      .get(API_URL)
      .then((res) => {
        setMenus(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Lỗi khi tải menu');
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xoá menu này không?')) {
      axios.delete(`${API_URL}/${id}`).then(fetchMenus);
    }
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <h2>Quản lý Menu</h2>
      <Link to="/admin/menus/create" className="btn btn-primary mb-3">
        Thêm Menu
      </Link>
      <table className="table table-bordered table-hover mt-3">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Tên menu</th>
            <th>URL</th>
            <th>Chức năng</th>
          </tr>
        </thead>
        <tbody>
          {menus.map((m) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.name}</td>
              <td>{m.url}</td>
              <td>
                <Link to={`/admin/menus/detail/${m.id}`} className="btn btn-sm btn-info me-2">
                  <FaEye />
                </Link>
                <Link to={`/admin/menus/edit/${m.id}`} className="btn btn-sm btn-warning me-2">
                  <FaEdit />
                </Link>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(m.id)}>
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

export default Menus;
