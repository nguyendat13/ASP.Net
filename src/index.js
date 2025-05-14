import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './css/Giognhau.css'; // đảm bảo đã import file CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import GoogleOAuthProvider

// Đảm bảo rằng clientId đã được thay thế bằng client ID thực tế từ Google Developer Console
const clientId = '48825899039-8rpdgbdtpsbbo4vdb1gahh331it05jqp.apps.googleusercontent.com'; // Thay YOUR_GOOGLE_CLIENT_ID bằng clientId của bạn

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Bao bọc ứng dụng của bạn trong GoogleOAuthProvider */}
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);

// Nếu bạn muốn bắt đầu đo hiệu suất trong ứng dụng của mình, hãy truyền một hàm
// để ghi lại kết quả (ví dụ: reportWebVitals(console.log))
// hoặc gửi đến một endpoint phân tích. Tìm hiểu thêm: https://bit.ly/CRA-vitals
reportWebVitals();
