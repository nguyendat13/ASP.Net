import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../../config';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchOrderDetail();
  }, []);

  const fetchOrderDetail = async () => {
    try {
      const token = localStorage.getItem('jwt-token');
      const response = await axios.get(`${API_BASE_URL}/api/Order/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrder(response.data);
    } catch (error) {
      console.error('Lỗi khi tải chi tiết đơn hàng:', error);
    }
  };
  

  if (!order) return <div>Đang tải dữ liệu...</div>;

  return (
    <div className="form-container detail-container">
      <h3>Chi tiết Đơn hàng</h3>
      <form>
        <input className="form-input" type="text" value={`Mã đơn hàng: ${order.id}`} readOnly />
        <input className="form-input" type="text" value={`Tên khách hàng: ${order.customerName}`} readOnly />
        <input className="form-input" type="text" value={`Email: ${order.emailCustomer}`} readOnly />
        <input className="form-input" type="text" value={`Trạng thái: ${order.statusName}`} readOnly />
        <input className="form-input" type="text" value={`Ngày đặt: ${new Date(order.orderDate).toLocaleDateString()}`} readOnly />

        <label>Danh sách sản phẩm:</label>
        <table className="order-table">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>Số lượng</th>
              <th>Giá gốc</th>
              <th>Giảm giá</th>
              <th>Giá bán</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {order.orderDetails.map((item, index) => (
              <tr key={index}>
                <td>{item.productName}</td>
                <td>{item.quantity}</td>
                <td>{item.price?.toLocaleString()} VNĐ</td>
                <td>{item.discount}%</td>
                <td>{item.priceSale?.toLocaleString()} VNĐ</td>
                <td>{(item.priceSale * item.quantity)?.toLocaleString()} VNĐ</td>
              </tr>
            ))}
          </tbody>
        </table>

        <input
          className="form-input"
          type="text"
          value={`Tổng giá trị đơn hàng: ${order.totalPrice?.toLocaleString()} VNĐ`}
          readOnly
        />

        <button
          type="button"
          className="back-btn"
          onClick={() => navigate('/admin/orders')}
        >
          <i className="fas fa-arrow-left" /> Quay lại
        </button>
      </form>
    </div>
  );
};

export default OrderDetail;
