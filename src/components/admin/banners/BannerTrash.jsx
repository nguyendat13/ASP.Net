
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUndo } from 'react-icons/fa';

const BannersTrash = () => {
  const [deletedBanners, setDeletedBanners] = useState([]);

  useEffect(() => {
    axios.get('https://localhost:7177/api/Banner/trash')
      .then(res => setDeletedBanners(res.data))
      .catch(() => alert('Không thể tải danh sách banner đã xoá.'));
  }, []);

  const handleRestore = async (id) => {
    try {
      await axios.put(`https://localhost:7177/api/Banner/restore/${id}`);
      setDeletedBanners(deletedBanners.filter(b => b.id !== id));
    } catch {
      alert('Khôi phục thất bại.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Thùng rác Banner</h2>
      <table className="table table-bordered table-hover mt-3">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Ảnh</th>
            <th>Khôi phục</th>
          </tr>
        </thead>
        <tbody>
          {deletedBanners.map(banner => (
            <tr key={banner.id}>
              <td>{banner.id}</td>
              <td>
                <img src={banner.imageUrl} alt="" width="100" height="60" style={{ objectFit: 'cover' }} />
              </td>
              <td>
                <button className="btn btn-success btn-sm" onClick={() => handleRestore(banner.id)}>
                  <FaUndo /> Khôi phục
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BannersTrash;