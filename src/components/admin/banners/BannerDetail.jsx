
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const BannersDetail = () => {
  const { id } = useParams();
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    axios.get(`https://localhost:7177/api/Banner/${id}`)
      .then(res => setBanner(res.data))
      .catch(() => alert('Không thể tải thông tin chi tiết.'));
  }, [id]);

  if (!banner) return <p className="mt-4 text-center">Đang tải dữ liệu...</p>;

  return (
    <div className="container mt-4">
      <h2>Chi tiết Banner #{banner.id}</h2>
      <div className="mb-3">
        <strong>Link ảnh:</strong>
        <div>
          <img src={banner.imageUrl} alt="banner" width="400" height="200" style={{ objectFit: 'cover' }} />
        </div>
      </div>
      <div className="mb-3">
        <strong>Link điều hướng:</strong> <a href={banner.link} target="_blank" rel="noopener noreferrer">{banner.link}</a>
      </div>
      <div className="mb-3">
        <strong>Ngày tạo:</strong> {new Date(banner.createdAt).toLocaleString()}
      </div>
      <Link to="/admin/banners" className="btn btn-secondary">Quay lại</Link>
    </div>
  );
};

export default BannersDetail;