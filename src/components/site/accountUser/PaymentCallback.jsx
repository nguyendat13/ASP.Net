import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const PaymentCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    axios
      .get("https://localhost:7177/api/payment/vnpay-return", { params })
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

  return <div>Đang xử lý thanh toán...</div>;
};

export default PaymentCallback;
