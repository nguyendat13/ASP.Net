import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams,useNavigate } from 'react-router-dom';
import '../../../css/Giognhau.css';  // Import CSS
import BackButton from '../../../Button/BackButton';

const CategoryDetail = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`https://localhost:7177/api/Category/${id}`)
      .then((res) => {
        setCategory(res.data);
      })
      .catch((error) => {
        console.error("Đã xảy ra lỗi khi tải dữ liệu", error);
      });
  }, [id]);

  if (!category) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="detail-container">
      <h3>Chi tiết danh mục</h3>
      <p><strong>Tên danh mục:</strong> {category.name}</p>
      <p><strong>Mô tả:</strong> {category.description}</p>
      
      <h4>Sản phẩm trong danh mục</h4>
      {category.products && category.products.length > 0 ? (
        <ul>
          {category.products.map(product => (
            <li key={product.id} className="detail-item">
              <p><strong>Tên sản phẩm:</strong> {product.name}</p>
              <p><strong>Mô tả:</strong> {product.description}</p>
              <p><strong>Giá:</strong> {product.price}</p>
              <p><strong>Ảnh:</strong> <img src={product.avatar} alt={product.name} className="product-image" /></p>
              <p><strong>Giảm giá:</strong> {product.discount}</p>
              <p><strong>Ngày tạo:</strong> {new Date(product.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Không có sản phẩm nào trong danh mục này.</p>
      )}
        <BackButton />

    </div>
  );
};

export default CategoryDetail;
