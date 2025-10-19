import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaEye, FaEdit, FaTrashAlt } from 'react-icons/fa';
import API_BASE_URL from '../../../config';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const API_URL = `${API_BASE_URL}/api/Post`;

  useEffect(() => {
    axios.get(API_URL)
      .then(res => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Lỗi khi tải danh sách bài viết!');
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm('Bạn có chắc muốn xoá bài viết này không?');
    if (!confirm) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      setPosts(prev => prev.filter(post => post.id !== id));
    } catch (err) {
      console.error(err);
      alert('Xoá thất bại!');
    }
  };

  if (loading) return <p>Đang tải bài viết...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Quản lý Bài viết</h4>
        <Link to="/admin/posts/create" className="btn btn-primary">Thêm bài viết</Link>
      </div>
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Ảnh</th>
            <th>Tiêu đề</th>
            <th>Nội dung</th>
            <th>Chủ đề</th>
            <th>Ngày xuất bản</th>
            <th className="text-center">Chức năng</th>
          </tr>
        </thead>
        <tbody>
          {posts.map(post => (
            <tr key={post.id}>
              <td>{post.id}</td>
             <td>
          {post.imageUrl ? (
            <img
              src={
                post.imageUrl.startsWith("http")
                  ? post.imageUrl
                  : `${API_BASE_URL}${post.imageUrl}`
              }
              alt={post.title}
              style={{ width: "80px", height: "60px", objectFit: "cover" }}
            />
          ) : (
            <span className="text-muted">Không có ảnh</span>
          )}
        </td>

              <td>{post.title}</td>
    <td style={{ 
  maxWidth: 200, 
  overflow: "hidden", 
  textOverflow: "ellipsis", 
  whiteSpace: "nowrap" 
}}>
  <div
    dangerouslySetInnerHTML={{
      __html:
        post.content && post.content.length > 50
          ? post.content.substring(0, 10) + "..."
          : post.content || "Không có mô tả",
    }}
  />
</td>

              <td>{post.topicName || 'Không có'}</td>
              <td>{new Date(post.publishedDate).toLocaleDateString()}</td>
              <td className="text-center">
                <div className="d-flex justify-content-center gap-2">
                  <Link to={`/admin/posts/${post.id}`} className="btn btn-sm btn-info"><FaEye /></Link>
                  <Link to={`/admin/posts/${post.id}/edit`} className="btn btn-sm btn-warning"><FaEdit /></Link>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(post.id)}><FaTrashAlt /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Posts;
