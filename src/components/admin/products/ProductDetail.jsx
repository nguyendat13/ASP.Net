import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import API_BASE_URL from '../../../config';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/Product/${id}`).then((res) => setProduct(res.data));
  }, [id]);
  // const getImageUrl = (avatarPath) => {
  //   if (!avatarPath) return null;
  //   const filename = avatarPath.split('/').pop();
  //   return `${API_BASE_URL}/api/Product/image/${filename}`;
  // };
  const getImageUrl = (avatarPath) => {
  if (!avatarPath) return "https://via.placeholder.com/200x200?text=No+Image";

  // Nếu là link đầy đủ (bắt đầu bằng http hoặc https)
  if (avatarPath.startsWith("http")) {
    return avatarPath;
  }

  // Nếu là đường dẫn tương đối, xử lý để gọi API backend
  const filename = avatarPath.replace("/images/", "").split("/").pop();
  return `${API_BASE_URL}/api/Product/image/${filename}`;
};
  if (!product) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Chi tiết Sản phẩm</h2>
        <Link to="/admin/products" className="btn btn-secondary">
          <FaArrowLeft /> Trở về
        </Link>
      </div>
      <ul className="list-group">
        <li className="list-group-item">
          <strong>ID:</strong> {product.id}
        </li>
        <li className="list-group-item">
          <strong>Tên:</strong> {product.name}
        </li>
        <li className="list-group-item">
          <strong>Mô tả:</strong>   <div dangerouslySetInnerHTML={{ __html: product.description }}></div>

        </li>
        <li className="list-group-item">
          <strong>Giá:</strong> {product.price.toLocaleString()} đ
        </li>
        <li className="list-group-item">
          <strong>Giảm giá:</strong> {product.discount}%
        </li>
        <li className="list-group-item">
          <strong>Ảnh:</strong>{' '}
          {getImageUrl(product.avatar) ? (
            <img src={getImageUrl(product.avatar)} alt={product.name} width="100" />
          ) : (
            'Không có ảnh'
          )}
        </li>
        <li className="list-group-item">
          <strong>Danh mục:</strong> {product.categoryName}
        </li>
      </ul>
    </div>
  );
};

export default ProductDetail;