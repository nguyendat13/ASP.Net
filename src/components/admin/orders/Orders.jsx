import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';

const OrderList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('https://localhost:7177/api/Order');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const deleteOrder = async (id) => {
    try {
      await axios.delete(`https://localhost:7177/api/Order/${id}`);
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

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
                <Link to={`/admin/orders/edit/${order.id}`} className="btn btn-warning btn-sm">
                  <FaEdit />
                </Link>
                <button onClick={() => deleteOrder(order.id)} className="btn btn-danger btn-sm">
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

export default OrderList;
