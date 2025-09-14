import React from "react";
import { FaTimesCircle } from "react-icons/fa";

const PaymentFail = () => (
  <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh', background: '#23272a' }}>
    <FaTimesCircle style={{ color: '#e53935', fontSize: 64 }} />
    <h2 className="fw-bold mt-3" style={{ color: '#fff', letterSpacing: 1 }}>
      Thanh toán thất bại!
    </h2>
  <p className="mt-2" style={{ color: '#fff' }}>
      Đã có lỗi xảy ra. Vui lòng thử lại hoặc liên hệ hỗ trợ.
    </p>
  </div>
);

export default PaymentFail;
