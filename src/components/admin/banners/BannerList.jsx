
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaTrash, FaPlus, FaEye, FaEdit } from "react-icons/fa";

const BannerList = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = () => {
    axios
      .get`API_BASE_URL}/api/Banner")
      .then((res) => {
        setBanners(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Không thể tải danh sách banner.");
        setLoading(false);
      });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xoá banner này?")) {
      try {
        await axios.delete(`${API_BASE_URL}/api/Banner/${id}`);
        setBanners(banners.filter((b) => b.id !== id));
      } catch {
        alert("Xoá banner thất bại!");
      }
    }
  };

  if (loading) return <p className="text-center mt-4">Đang tải dữ liệu...</p>;
  if (error) return <p className="text-danger text-center mt-4">{error}</p>;

  return (
    <div className="container mt-4">
      <h2>Quản lý Banner</h2>
      <div className="mb-3 text-end">
        <Link to="/admin/banners/create" className="btn btn-primary">
          <FaPlus className="me-1" /> Thêm banner
        </Link>
      </div>

      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Ảnh</th>
            <th>Link</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {banners.map((banner) => (
            <tr key={banner.id}>
              <td>{banner.id}</td>
              <td>
                {banner.imageUrl ? (
                  <img
                    src={`${API_BASE_URL}${banner.imageUrl}`}
                    alt={`Banner ${banner.id}`}
                    width="100"
                    height="60"
                    style={{ objectFit: "cover", borderRadius: "4px" }}
                  />
                ) : (
                  <span>Không có ảnh</span>
                )}
              </td>
              <td>
                <a href={banner.link} target="_blank" rel="noopener noreferrer">
                  {banner.link}
                </a>
              </td>
              <td>{new Date(banner.createdAt).toLocaleDateString("vi-VN")}</td>
              <td className="d-flex gap-2 justify-content-center">
                <Link
                  to={`/admin/banners/detail/${banner.id}`}
                  className="btn btn-info btn-sm"
                >
                  <FaEye />
                </Link>
                <Link
                  to={`/admin/banners/edit/${banner.id}`}
                  className="btn btn-warning btn-sm"
                >
                  <FaEdit />
                </Link>
                <button
                  onClick={() => handleDelete(banner.id)}
                  className="btn btn-danger btn-sm"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BannerList;