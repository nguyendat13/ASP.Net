import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RelatedProducts = ({ productId }) => {
  const [related, setRelated] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const response = await fetch(`https://localhost:7177/api/Product/related?productId=${productId}`);
        const data = await response.json();
        setRelated(data);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm liên quan:", error);
      }
    };

    if (productId) fetchRelated();
  }, [productId]);

  const handleAddToCart = (product) => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("⚠️ Vui lòng đăng nhập để thêm vào giỏ hàng.");
      navigate("/login-user");
      return;
    }

    axios.post(`https://localhost:7177/api/Cart/add-item`, {
      userId: parseInt(userId),
      productId: product.id,
      quantity: 1,
    })
    .then(() => {
      alert("✅ Đã thêm vào giỏ hàng!");
    })
    .catch((err) => {
      console.error("❌ Lỗi khi thêm vào giỏ hàng:", err);
      alert("❌ Không thể thêm vào giỏ hàng.");
    });
  };

  if (related.length === 0) return null;

  return (
    <div className="mt-5">
      <h4>Sản phẩm liên quan</h4>
      <div className="row">
        {related.map((product) => (
          <div className="col-md-3 mb-3" key={product.id}>
            <div className="card h-100 shadow-sm">
              <img
                src={`https://localhost:7177${product.avatar}`}
                className="card-img-top"
                alt={product.name}
                style={{ height: 150, objectFit: "cover" }}
              />
              <div className="card-body d-flex flex-column">
                <h6 className="card-title">{product.name}</h6>
                <p className="text-success mb-2">{product.price.toLocaleString()} VND</p>
                <div className="mt-auto d-flex flex-column gap-2">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    Xem chi tiết
                  </button>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleAddToCart(product)}
                  >
                    Thêm vào giỏ hàng
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
