import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const BannersEdit = () => {
  const { id } = useParams();
  const [banner, setBanner] = useState({ imageUrl: '', link: '' });
  const [image, setImage] = useState(null); // Ảnh mới
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`https://localhost:7177/api/Banner/${id}`)
      .then(res => setBanner(res.data))
      .catch(() => alert('Không thể tải thông tin banner.'));
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    // Tạo URL preview cho ảnh mới
    if (file) {
      const imagePreview = URL.createObjectURL(file);
      setBanner(prev => ({ ...prev, imageUrl: imagePreview }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('Link', banner.link);

    // Nếu có ảnh mới thì thêm vào formData
    if (image) {
      formData.append('ImageFile', image); // Phải trùng tên với DTO trong backend
    }

    try {
      await axios.put(`https://localhost:7177/api/Banner/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/admin/banners');
    } catch {
      alert('Cập nhật banner thất bại.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Chỉnh sửa Banner</h2>
      <form onSubmit={handleSubmit}>
        {/* Hiển thị ảnh hiện tại hoặc ảnh mới chọn */}
        <div className="mb-3">
          <label>Ảnh hiện tại / mới:</label>
          <br />
          {banner.imageUrl && (
            <img
              src={banner.imageUrl}
              alt="Banner preview"
              width="200"
              height="100"
              style={{ objectFit: 'cover', marginBottom: '10px' }}
            />
          )}
        </div>

        <div className="mb-3">
          <label>Link điều hướng:</label>
          <input
            type="text"
            className="form-control"
            value={banner.link}
            onChange={(e) => setBanner({ ...banner, link: e.target.value })}
            required
          />
        </div>

        {/* Upload ảnh mới */}
        <div className="mb-3">
          <label>Chọn ảnh mới (nếu muốn thay đổi):</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <button type="submit" className="btn btn-success">Cập nhật</button>
      </form>
    </div>
  );
};

export default BannersEdit;
