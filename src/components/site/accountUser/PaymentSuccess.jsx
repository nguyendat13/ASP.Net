import React from "react";
import { FaCheckCircle } from "react-icons/fa";

const PaymentSuccess = () => (
  <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh', background: '#23272a' }}>
    <FaCheckCircle style={{ color: '#43a047', fontSize: 64 }} />
    <h2 className="fw-bold mt-3" style={{ color: '#fff', letterSpacing: 1 }}>
      Thanh toán thành công!
    </h2>
  <p className="mt-2" style={{ color: '#fff' }}>
      Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xác nhận.
    </p>
    <div className="d-flex gap-3 mt-4">
      <a href="/" className="btn btn-dark d-flex align-items-center gap-2 shadow-sm" style={{ borderRadius: 8, fontWeight: 500, background: '#23272a', color: '#fff', border: 'none' }}>
        <FaCheckCircle style={{ color: '#43a047', fontSize: 20 }} /> Về trang chủ
      </a>
      <a href="/orders" className="btn btn-success d-flex align-items-center gap-2 shadow-sm" style={{ borderRadius: 8, fontWeight: 500, background: '#43a047', color: '#fff', border: 'none' }}>
        <FaCheckCircle style={{ color: '#fff', fontSize: 20 }} /> Xem đơn hàng
      </a>
    </div>
  </div>
);

export default PaymentSuccess;
