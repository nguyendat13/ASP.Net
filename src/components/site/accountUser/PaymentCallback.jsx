import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";


import axios from "axios";
import API_BASE_URL from "../../../config";


const PaymentCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    axios
      .get(`${API_BASE_URL}/api/payment/vnpay-return`, { params })
      .then((res) => {
        if (res.data.success) {
          // ✅ Redirect sang trang thành công
          navigate("/payment-success");
        } else {
          // ✅ Redirect sang trang thất bại
          navigate("/payment-fail");
        }
      })
      .catch(() => {
        navigate("/payment-fail");
      });
  }, [location.search, navigate]);

  return (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh', background: '#23272a' }}>
      <div className="mb-3">
        <span style={{ fontSize: 48, color: '#ff9800' }}>💳</span>
      </div>
      <h3 className="fw-bold mb-2" style={{ color: '#43a047', letterSpacing: 1 }}>
        Đang xử lý thanh toán...
      </h3>
      <div className="spinner-border" style={{ color: '#fbc02d', width: 32, height: 32 }} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default PaymentCallback;
