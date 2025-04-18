import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Bạn cần đăng nhập để xem giỏ hàng!");
      navigate("/login-user");
      return;
    }

    axios
      .get(`https://localhost:7177/api/Cart/user/${userId}`)
      .then((res) => {
        console.log("Dữ liệu giỏ hàng:", res.data);
        // Giả sử bạn có thông tin discount từ API, bạn sẽ tính giá sau giảm
        const updatedCartItems = res.data.items.map(item => {
          const discount = item.discount || 0; // Giảm giá mặc định là 0 nếu không có
          const priceAfterDiscount = item.price - (item.price * discount / 100);
          return {
            ...item,
            priceAfterDiscount,
          };
        });
        setCartItems(updatedCartItems);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy giỏ hàng:", err);
      });
  }, [navigate]);

  const handleRemove = (productId) => {
    const userId = localStorage.getItem('userId'); 

    axios
      .delete('https://localhost:7177/api/Cart/remove-item', {
        data: {
          userId: userId,
          productId: productId
        }
      })
      .then(() => {
        setCartItems(cartItems.filter(item => item.productId !== productId));
      })
      .catch((err) => {
        console.error("Lỗi khi xoá sản phẩm khỏi giỏ hàng:", err);
      });
  };

  const handleCheckout = () => {
    navigate("/checkout", { state: { cartItems } });
  };

  // Tính tổng tiền sau khi áp dụng discount cho tất cả các sản phẩm trong giỏ hàng
  const totalPrice = cartItems.reduce((total, item) => {
    return total + (item.priceAfterDiscount * item.quantity);
  }, 0);

  return (
    <div className="container mt-4">
      <h2>🛒 Giỏ hàng của bạn</h2>
      {cartItems.length === 0 ? (
        <p>Không có sản phẩm nào trong giỏ.</p>
      ) : (
        <>
          <table className="table table-bordered mt-3">
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Giá</th>
                <th>Giảm giá</th>
                <th>Số lượng</th>
                <th>Tổng</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.productId}>
                  <td><img src={`https://localhost:7177${item.avatar}`} alt={item.productName} width="80" /></td>
                  <td>{item.productName}</td>
                  <td>{item.price.toLocaleString()} đ</td>
                  <td>{item.discount}%</td>
                  <td>{item.quantity}</td>
                  <td>{(item.priceAfterDiscount * item.quantity).toLocaleString()} đ</td>
                  <td>
                    <button className="btn btn-danger" onClick={() => handleRemove(item.productId)}>
                      Xoá
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-end">
            <h4>Tổng tiền: {totalPrice.toLocaleString()} đ</h4>
            <button className="btn btn-success" onClick={handleCheckout}>
              Thanh toán
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
