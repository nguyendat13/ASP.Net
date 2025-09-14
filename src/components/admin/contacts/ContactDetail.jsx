import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";


import axios from "axios";

import API_BASE_URL from "../../../config";

const ContactDetail = () => {
  const { id } = useParams();
  const [contact, setContact] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [isResponded, setIsResponded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/Contact/${id}`)
      .then((res) => {
        setContact(res.data);
        setIsResponded(res.data.isReplied); // Cập nhật trạng thái phản hồi ban đầu
      })
      .catch((error) => {
        console.error("Lỗi khi tải thông tin liên hệ:", error);
      });
  }, [id]);

  const handleGoBack = () => {
    navigate("/admin/contacts");
  };

  const handleResponseChange = (e) => {
    setResponseMessage(e.target.value);
  };

  const handleSubmitResponse = () => {
    if (!responseMessage) {
      alert("Vui lòng nhập nội dung phản hồi.");
      return;
    }

    const updatedContact = {
      ...contact,
      response: responseMessage,
      isReplied: true,
    };

    axios
      .put(`${API_BASE_URL}/api/Contact/${id}`, updatedContact)
      .then((res) => {
        setContact(res.data);
        setIsResponded(true); // Cập nhật trạng thái đã phản hồi
        alert("Phản hồi đã được gửi.");
      })
      .catch((error) => {
        console.error("Lỗi khi gửi phản hồi:", error);
        alert("Có lỗi xảy ra khi gửi phản hồi.");
      });
  };

  if (!contact) return <p>Đang tải...</p>;

  return (
    <div className="container mt-4">
      <h2>Chi tiết liên hệ</h2>
      <ul className="list-group">
        <li className="list-group-item">Họ tên: {contact.name}</li>
        <li className="list-group-item">Email: {contact.email}</li>
        <li className="list-group-item">Chủ đề: {contact.subject}</li>
        <li className="list-group-item">Nội dung: {contact.message}</li>
        <li className="list-group-item">
          Ngày gửi: {new Date(contact.createdAt).toLocaleString()}
        </li>
        <li className="list-group-item">
          Trạng thái phản hồi: {isResponded ? "Đã phản hồi" : "Chưa phản hồi"}
        </li>
      </ul>

      {!isResponded && (
        <div className="mt-4">
          <h4>Phản hồi</h4>
          <textarea
            className="form-control"
            rows="5"
            value={responseMessage}
            onChange={handleResponseChange}
            placeholder="Nhập nội dung phản hồi..."
          ></textarea>
          <button
            className="btn btn-success mt-3"
            onClick={handleSubmitResponse}
          >
            Gửi phản hồi
          </button>
        </div>
      )}

      <button className="btn btn-secondary mt-3" onClick={handleGoBack}>
        Quay lại
      </button>
    </div>
  );
};

export default ContactDetail;