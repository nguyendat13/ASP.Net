import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../../../css/Giognhau.css';
import BackButton from '../../../Button/BackButton';

const OrderEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState({ customerName: '', statusOrderId: '' });
  const [statuses, setStatuses] = useState([]);

  // Lấy thông tin đơn hàng
  useEffect(() => {
    axios.get(`https://localhost:7177/api/Order/${id}`).then(res => {
      setOrder({
        customerName: res.data.customerName,
        statusOrderId: res.data.statusOrderId,
      });
    });

    // Lấy danh sách trạng thái đơn hàng
    axios.get(`https://localhost:7177/api/StatusOrder`).then(res => {
      setStatuses(res.data);
    });
  }, [id]);

  const handleChange = e => {
    setOrder({ ...order, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const updateData = {
      customerName: order.customerName,
      statusOrderId: parseInt(order.statusOrderId),
      items: [] // Không thay đổi sản phẩm trong đơn hàng ở form này
    };

    try {
      await axios.put(`https://localhost:7177/api/Order/${id}`, updateData);
      alert('Cập nhật đơn hàng thành công!');
      navigate('/admin/orders');
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi cập nhật đơn hàng.');
    }
  };

  return (
    <div className="form-container">
      <h3>Chỉnh sửa đơn hàng</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tên khách hàng</label>
          <input
            name="customerName"
            value={order.customerName}
            onChange={handleChange}
            className="form-input"
            placeholder="Nhập tên khách hàng"
          />
        </div>

        <div className="form-group">
          <label>Trạng thái đơn hàng</label>
          <select
            name="statusOrderId"
            value={order.statusOrderId}
            onChange={handleChange}
            className="form-input"
          >
            <option value="">-- Chọn trạng thái --</option>
            {statuses.map(status => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="form-submit-btn">Lưu</button>
      </form>

      <BackButton />
    </div>
  );
};

export default OrderEdit;
