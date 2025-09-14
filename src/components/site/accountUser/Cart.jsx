import React, { useEffect, useState } from "react";


import axios from "axios";

import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaTrashAlt, FaMoneyBillWave, FaCheckCircle } from "react-icons/fa";
import API_BASE_URL from "../../../config";


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
      .get(`${API_BASE_URL}/api/Cart/user/${userId}`)
      .then((res) => {
        const updatedCartItems = res.data.items.map(item => {
          const discount = item.discount || 0;
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
    const userId = localStorage.getItem("userId");
    axios
      .delete(`${API_BASE_URL}/api/Cart/remove-item`, { // fix dấu ' và URL
        data: { userId, productId }
      })
      .then(() => {
        setCartItems(prev => prev.filter(item => item.productId !== productId));
      })
      .catch((err) => {
        console.error("Lỗi khi xoá sản phẩm khỏi giỏ hàng:", err);
      });
  };

  const handleQuantityChange = (productId, newQuantity) => {
    const userId = localStorage.getItem("userId");
    if (newQuantity <= 0) return;

    axios.put(`${API_BASE_URL}/api/Cart/update-item`, { // fix dấu `)` và URL
      userId,
      productId,
      quantity: newQuantity,
    })
    .then(() => {
      setCartItems(prev =>
        prev.map(item =>
          item.productId === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    })
    .catch(err => {
      console.error("Lỗi khi cập nhật số lượng:", err);
    });
  };

  const handleClearCart = () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    if (window.confirm("Bạn có chắc chắn muốn xoá toàn bộ giỏ hàng không?")) {
      axios.delete(`${API_BASE_URL}/api/Cart/clear/${userId}`)
        .then(() => setCartItems([]))
        .catch(err => console.error("Lỗi khi xoá toàn bộ giỏ hàng:", err));
    }
  };

  const handleCheckout = () => {
    navigate("/checkout", { state: { cartItems } });
  };

  const totalPrice = cartItems.reduce((total, item) => {
    return total + (item.priceAfterDiscount * item.quantity);
  }, 0);

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-4 d-flex align-items-center gap-2" style={{ color: '#fff', letterSpacing: 1 }}>
        <FaShoppingCart style={{ color: 'inherit', fontSize: 32 }} className="navbar-icon" /> Giỏ hàng của bạn
      </h2>
      {cartItems.length === 0 ? (
        <div className="alert alert-warning text-center fw-bold" style={{ background: '#212121', color: '#fff', border: 'none' }}>
          Không có sản phẩm nào trong giỏ.
        </div>
      ) : (
        <>
          <table className="table table-bordered mt-3" style={{ background: '#23272a', color: '#fff', borderRadius: 12 }}>
            <thead className="table-dark" style={{ background: '#212121', color: '#fff' }}>
              <tr>
                <th style={{ color: '#fff' }}>Ảnh</th>
                <th style={{ color: '#fff' }}>Tên sản phẩm</th>
                <th style={{ color: '#fff' }}>Giá</th>
                <th style={{ color: '#fff' }}>Giảm giá</th>
                <th style={{ color: '#fff' }}>Số lượng</th>
                <th style={{ color: '#fff' }}>Tổng</th>
                <th style={{ color: '#fff', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#000'} onMouseLeave={(e) => e.target.style.color = '#fff'}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.productId} style={{ background: '#23272a', color: '#fff' }}>
                  <td>
                    <img
                      src={`${API_BASE_URL}/api/Product/image/${item.avatar}`}
                      alt={item.productName}
                      width="80"
                      style={{ borderRadius: 8, border: '2px solid #43a047' }}
                    />
                  </td>
                  <td>{item.productName}</td>
                  <td style={{ color: '#e53935', fontWeight: 700 }}>{item.price.toLocaleString()} đ</td>
                  <td style={{ color: '#43a047', fontWeight: 600 }}>{item.discount}%</td>
                  <td>
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value))}
                      className="form-control"
                      style={{ width: "80px", background: '#212121', color: '#fff', border: '1px solid #43a047', borderRadius: 8 }}
                    />
                  </td>
                  <td style={{ color: '#43a047', fontWeight: 700 }}>{(item.priceAfterDiscount * item.quantity).toLocaleString()} đ</td>
                  <td>
                    <button className="btn btn-outline-danger d-flex align-items-center gap-1" style={{ borderRadius: 8, fontWeight: 500, color: '#fff', border: '1px solid #e53935' }} onClick={() => handleRemove(item.productId)}>
                      <FaTrashAlt style={{ color: 'inherit', fontSize: 16 }} className="navbar-icon" /> Xoá
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-between align-items-center mt-3">
            <button className="btn btn-outline-danger d-flex align-items-center gap-1" style={{ borderRadius: 8, fontWeight: 500, color: '#fff', border: '1px solid #e53935' }} onClick={handleClearCart}>
              <FaTrashAlt style={{ color: 'inherit', fontSize: 18 }} className="navbar-icon" /> Xoá tất cả
            </button>
            <h4 className="fw-bold d-flex align-items-center gap-2" style={{ color: '#fff' }}>
              <FaMoneyBillWave style={{ color: 'inherit', fontSize: 22 }} className="navbar-icon" /> Tổng tiền: <span style={{ color: '#43a047' }}>{totalPrice.toLocaleString()} đ</span>
            </h4>
            <button className="btn btn-success d-flex align-items-center gap-1" style={{ borderRadius: 8, fontWeight: 500, background: '#43a047', color: '#fff', border: 'none' }} onClick={handleCheckout}>
              <FaCheckCircle style={{ color: 'inherit', fontSize: 18 }} className="navbar-icon" /> Thanh toán
            </button>
          </div>
        </>
      )}
      <style>{`
        .navbar-icon {
          color: inherit !important;
          transition: color 0.2s;
        }
        .navbar-icon:hover {
          color: #fff !important;
        }
      `}</style>
    </div>
  );
};

export default Cart;
