import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTags, FaFolderOpen, FaPercent, FaMoneyBillWave } from "react-icons/fa";
import { Link } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("https://localhost:7177/api/Product") // Đổi port nếu cần
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy sản phẩm:", err);
      });
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Danh sách sản phẩm</h2>
      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-sm-6 col-md-4 col-lg-3 mb-4">
            <div className="card h-100 shadow-sm rounded">
              <img
                src={`https://localhost:7177${product.avatar}`}
                className="card-img-top"
                alt={product.name}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title text-primary">
                  <FaTags className="me-2" />
                  {product.name}
                </h5>
                <p className="card-text flex-grow-1">
                  {product.description?.length > 100
                    ? product.description.substring(0, 100) + "..."
                    : product.description}
                </p>
                <p className="mb-1">
                  <FaMoneyBillWave className="me-2 text-success" />
                  <strong>{product.price.toLocaleString()} đ</strong>
                </p>
                {product.discount > 0 && (
                  <p className="mb-1 text-danger">
                    <FaPercent className="me-2" />
                    Giảm giá: {product.discount}%
                  </p>
                )}
                <p className="mb-0 text-muted">
                  <FaFolderOpen className="me-2" />
                  {product.categoryName}
                </p>
                <Link to={`/products/${product.id}`} className="btn btn-outline-primary mt-3">
                  Xem chi tiết
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
