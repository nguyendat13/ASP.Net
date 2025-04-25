
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BannersCreate = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [link, setLink] = useState('');
  const [imageFile, setImageFile] = useState(null); // Trường lưu trữ ảnh tải lên
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file)); // Hiển thị ảnh đã chọn
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!link || !imageFile) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
  
    const fileName = imageFile.name;
  
    const formData = new FormData();
    formData.append('ImageFile', imageFile);  // Thêm ảnh vào formData
    formData.append('Link', link);  // Thêm link vào formData
  
    try {
      await axios.post('https://localhost:7177/api/Banner', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/admin/banners');
    } catch (error) {
      console.error(error.response?.data || error);
      alert('Tạo mới banner thất bại.');
    }
  };
  

  return (
    <div className="container mt-4">
      <h2>Thêm Banner mới</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Link ảnh:</label>
          <input type="file" className="form-control" onChange={handleImageChange} required />
          {imageUrl && (
            <img src={imageUrl} alt="Preview" width="100" height="60" style={{ objectFit: 'cover', marginTop: '10px' }} />
          )}
        </div>
        <div className="mb-3">
          <label>Link điều hướng:</label>
          <input
            type="text"
            className="form-control"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Lưu</button>
      </form>
    </div>
  );
};

export default BannersCreate;