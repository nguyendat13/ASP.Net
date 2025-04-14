import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaEye, FaEdit, FaTrashAlt } from 'react-icons/fa';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  // Lấy các thông tin từ localStorage
  const token = localStorage.getItem('jwt-token');
  const role = localStorage.getItem('role');
  const email = localStorage.getItem('email');

  // Kiểm tra nếu là admin hoặc email trùng với user trong bảng
  const isAdmin = role === 'admin';
  const isUser = role === 'user';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://localhost:7177/api/User', {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token kèm theo
        },
      });
      setUsers(response.data);
    } catch (err) {
      console.error(err);
      setError('Lỗi khi tải danh sách người dùng');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xoá người dùng này không?')) {
      try {
        await axios.delete(`https://localhost:7177/api/User/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchUsers(); // Tải lại danh sách người dùng sau khi xoá
      } catch (err) {
        console.error(err);
        setError('Lỗi khi xoá người dùng');
      }
    }
  };

  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <h2>Quản lý Người dùng</h2>

      {/* Nút thêm người dùng chỉ dành cho admin */}
      {isAdmin && (
        <Link to="/admin/users/create" className="btn btn-primary mb-3">
          Thêm Người dùng
        </Link>
      )}

      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Username</th>
            <th>Vai trò</th>
            <th>Chức năng</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.fullname}</td>
              <td>{u.email}</td>
              <td>{u.username}</td>
              <td>{u.role}</td>
              <td>
                {/* Admin có thể thao tác với tất cả người dùng, hoặc nếu email trùng với người dùng trong bảng */}
                {(role === u.role && email !== u.email) ? (
                  <>
                    <span className="text-muted">Bạn không có quyền truy cập</span>
                  </>
                ) : (
                  <>
                   <Link to={`/admin/users/detail/${u.id}`} className="btn btn-sm btn-info me-2">
                      <FaEye />
                    </Link>
                    <Link to={`/admin/users/edit/${u.id}`} className="btn btn-sm btn-warning me-2">
                      <FaEdit />
                    </Link>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(u.id)}>
                      <FaTrashAlt />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
