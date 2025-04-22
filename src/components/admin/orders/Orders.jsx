import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  const token = localStorage.getItem('jwt-token');
  const email = localStorage.getItem('email');
  const role = localStorage.getItem('role');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`https://localhost:7177/api/Order`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        // Nếu backend yêu cầu email, thì dùng:
        // params: { email } 
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Lỗi khi tải đơn hàng');
    }
  };

  const deleteOrder = async (id) => {
    try {
      await axios.delete(`https://localhost:7177/api/Order/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="form-container">
      <h3>Danh sách Đơn hàng</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên khách hàng</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customerName}</td>
              <td>{order.statusName}</td>
              <td>{new Date(order.orderDate).toLocaleDateString()}</td>
              <td className="d-flex gap-2">
                <Link to={`/admin/orders/detail/${order.id}`} className="btn btn-info btn-sm">
                  <FaEye />
                </Link>
                {role === 'admin' && (
                  <>
                    <Link to={`/admin/orders/edit/${order.id}`} className="btn btn-warning btn-sm">
                      <FaEdit />
                    </Link>
                    <button onClick={() => deleteOrder(order.id)} className="btn btn-danger btn-sm">
                      <FaTrash />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;
