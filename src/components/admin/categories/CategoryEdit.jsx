import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../../../css/Giognhau.css';  // Import CSS
import BackButton from '../../../Button/BackButton';

const CategoryEdit = () => {
  const { id } = useParams();
  const [form, setForm] = useState({ name: '', description: '' });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`https://localhost:7177/api/Category/${id}`).then(res => {
      setForm(res.data);
    });
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await axios.put(`https://localhost:7177/api/Category/${id}`, form);
    alert('Cập nhật danh mục thành công!');
    navigate('/admin/categories');
  };

  return (
    <div className="form-container">
      <h3>Chỉnh sửa danh mục</h3>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="form-input"
        />
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          className="form-input"
        />
        <button type="submit" className="form-submit-btn">Lưu</button>
      </form>
      
      <BackButton />
    </div>
  );
};

export default CategoryEdit;
