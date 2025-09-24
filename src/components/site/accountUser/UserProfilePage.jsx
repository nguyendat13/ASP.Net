import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaVenusMars, FaArrowLeft, FaLock } from "react-icons/fa";
import API_BASE_URL from "../../../config";

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editData, setEditData] = useState({ fullname: "", email: "", phone: "", gender: "" });
  const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "" });
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token-user");

  useEffect(() => {
    if (!userId || !token) {
      setError("Vui lòng đăng nhập để xem thông tin người dùng.");
      setLoading(false);
      return;
    }

    axios
      .get(`${API_BASE_URL}/api/User/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUser(response.data);
       setEditData({
          fullname: response.data.fullname,
          email: response.data.email,
          username: response.data.username,  // ✅ set username
          phone: response.data.phone,
          gender: response.data.gender,
        });

        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy thông tin người dùng:", err);
        setError("Không thể tải thông tin người dùng.");
        setLoading(false);
      });
  }, [userId, token]);

  const handleProfileChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

 const updateProfile = async () => {
  try {
    const payload = {
      fullname: editData.fullname,
      email: editData.email,
      username: editData.username,   // ✅ thêm username
      phone: editData.phone || null,
      gender: editData.gender || null
    };

    const res = await axios.put(
      `${API_BASE_URL}/api/User/update-profile/${userId}`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setUser(res.data);
    setMessage("Cập nhật thông tin thành công!");
  } catch (err) {
    console.error(err);
    setMessage(err.response?.data?.message || "Cập nhật thông tin thất bại.");
  }
};



 const changePassword = async () => {
  try {
    const res = await axios.put(
      `${API_BASE_URL}/api/User/change-password/${userId}`,
      passwordData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Xóa token và userId khỏi localStorage
    localStorage.removeItem("token-user");
    localStorage.removeItem("userId");
    localStorage.removeItem("role-user");
    localStorage.removeItem("email-user");

    setPasswordData({ oldPassword: "", newPassword: "" });
    setMessage("Đổi mật khẩu thành công! Đang chuyển sang trang đăng nhập...");

    // Chuyển hướng sang trang login sau 1 giây
    setTimeout(() => {
      navigate("/login-user");
    }, 1000);

  } catch (err) {
    console.error(err);
    setMessage(err.response?.data?.message || "Đổi mật khẩu thất bại.");
  }
};


  if (loading) return <div className="text-center mt-5">Đang tải...</div>;
  if (error) return <div className="text-center mt-5 text-danger">{error}</div>;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg p-4 rounded-4">
            <h3 className="text-center mb-4 text-success">
              <FaUser className="me-2" /> Thông tin người dùng
            </h3>

            {message && <div className="alert alert-success">{message}</div>}

            <div className="mb-3">
              <label className="form-label">Họ và tên</label>
              <input
                type="text"
                className="form-control"
                name="fullname"
                value={editData.fullname}
                onChange={handleProfileChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={editData.email}
                onChange={handleProfileChange}
              />
            </div>
            <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              name="username"
              value={editData.username}
              onChange={handleProfileChange}
            />
          </div>

            <div className="mb-3">
              <label className="form-label">Số điện thoại</label>
              <input
                type="text"
                className="form-control"
                name="phone"
                value={editData.phone}
                onChange={handleProfileChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Giới tính</label>
              <select
                className="form-select"
                name="gender"
                value={editData.gender}
                onChange={handleProfileChange}
              >
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            <button className="btn btn-success w-100 mb-4" onClick={updateProfile}>
              Cập nhật thông tin
            </button>

            <hr />

            <h4 className="mb-3 text-success"><FaLock className="me-2" /> Đổi mật khẩu</h4>
            <div className="mb-3">
              <label className="form-label">Mật khẩu cũ</label>
              <input
                type="password"
                className="form-control"
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Mật khẩu mới</label>
              <input
                type="password"
                className="form-control"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
              />
            </div>
            <button className="btn btn-warning w-100 mb-4" onClick={changePassword}>
              Đổi mật khẩu
            </button>

            <button className="btn btn-secondary w-100" onClick={() => navigate("/")}>
              <FaArrowLeft className="me-2" /> Quay về trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
