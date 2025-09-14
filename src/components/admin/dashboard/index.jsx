import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../../../config';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    revenue: 0,
    totalPosts: 0
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/Dashboard`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => alert('Không thể tải dữ liệu thống kê.'));
  }, []);

  return (
    <Container fluid style={{ padding: '30px' }}>
      <Row>
        <Col md={4} className="mb-4">
          <Card bg="primary" text="white" style={{ height: '200px' }}>
            <Card.Body>
              <Card.Title>Tổng sản phẩm</Card.Title>
              <Card.Text>{stats.totalProducts}</Card.Text>
              <Button variant="light">
                <Link to="/admin/products" style={{ textDecoration: 'none' }}>Xem chi tiết</Link>
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card bg="success" text="white" style={{ height: '200px' }}>
            <Card.Body>
              <Card.Title>Tổng người dùng</Card.Title>
              <Card.Text>{stats.totalUsers}</Card.Text>
              <Button variant="light">
                <Link to="/admin/users" style={{ textDecoration: 'none' }}>Xem chi tiết</Link>
              </Button>
             </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card bg="warning" text="white" style={{ height: '200px' }}>
            <Card.Body>
              <Card.Title>Tổng đơn hàng</Card.Title>
              <Card.Text>{stats.totalOrders}</Card.Text>
              <Button variant="light">
                <Link to="/admin/orders" style={{ textDecoration: 'none' }}>Xem chi tiết</Link>
              </Button>            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6} className="mb-4">
          <Card bg="danger" text="white" style={{ height: '200px' }}>
            <Card.Body>
              <Card.Title>Doanh thu</Card.Title>
              <Card.Text>{stats.revenue.toLocaleString('vi-VN')} VNĐ</Card.Text>
              <Button variant="light">Xem chi tiết</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card bg="info" text="white" style={{ height: '200px' }}>
            <Card.Body>
              <Card.Title>Tổng bài viết</Card.Title>
              <Card.Text>{stats.totalPosts}</Card.Text>
              <Button variant="light">
                <Link to="/admin/posts" style={{ textDecoration: 'none' }}>Xem chi tiết</Link>
              </Button>            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
