import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../../css/Giognhau.css';  // Import CSS
import BackButton from '../../../Button/BackButton';

const CategoryCreate = () => {
  const [form, setForm] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      const categoryData = {
        name: form.name,
        description: form.description,
      };
  
      const response = await axios.post('https://localhost:7177/api/Category', categoryData);
      const newCategory = response.data;
      alert('Tạo danh mục thành công!');
      navigate('/admin/categories');
    } catch (err) {
      if (err.response) {
        setError(`Lỗi khi tạo danh mục: ${JSON.stringify(err.response.data)}`);
      } else {
        setError('Lỗi khi tạo danh mục');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h3>Tạo danh mục mới</h3>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Tên"
          value={form.name}
          onChange={handleChange}
          className="form-input"
          required
        />
        <input
          name="description"
          placeholder="Mô tả"
          value={form.description}
          onChange={handleChange}
          className="form-input"
        />
        <button type="submit" disabled={loading} className="form-submit-btn">
          {loading ? 'Đang tạo...' : 'Tạo'}
        </button>
      </form>
      {error && <p className="form-error">{error}</p>}

      
      <BackButton />
    </div>
  );
};

export default CategoryCreate;
