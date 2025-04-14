import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const Dashboard = () => {
  return (
    <Container fluid style={{ padding: '30px' }}>
      <Row>
        {/* Card 1: Tổng sản phẩm */}
        <Col md={4} className="mb-4">
          <Card bg="primary" text="white" style={{ height: '200px' }}>
            <Card.Body>
              <Card.Title>Tổng sản phẩm</Card.Title>
              <Card.Text>350</Card.Text>
              <Button variant="light">Xem chi tiết</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Card 2: Tổng người dùng */}
        <Col md={4} className="mb-4">
          <Card bg="success" text="white" style={{ height: '200px' }}>
            <Card.Body>
              <Card.Title>Tổng người dùng</Card.Title>
              <Card.Text>1,250</Card.Text>
              <Button variant="light">Xem chi tiết</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Card 3: Tổng đơn hàng */}
        <Col md={4} className="mb-4">
          <Card bg="warning" text="white" style={{ height: '200px' }}>
            <Card.Body>
              <Card.Title>Tổng đơn hàng</Card.Title>
              <Card.Text>580</Card.Text>
              <Button variant="light">Xem chi tiết</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Card 4: Doanh thu */}
        <Col md={6} className="mb-4">
          <Card bg="danger" text="white" style={{ height: '200px' }}>
            <Card.Body>
              <Card.Title>Doanh thu</Card.Title>
              <Card.Text>1,200,000 VNĐ</Card.Text>
              <Button variant="light">Xem chi tiết</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Card 5: Tổng bài viết */}
        <Col md={6} className="mb-4">
          <Card bg="info" text="white" style={{ height: '200px' }}>
            <Card.Body>
              <Card.Title>Tổng bài viết</Card.Title>
              <Card.Text>120</Card.Text>
              <Button variant="light">Xem chi tiết</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
