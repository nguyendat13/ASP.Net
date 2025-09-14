// TopicCreate.jsx
import React, { useState } from "react";


import axios from "axios";

import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../../config";

const TopicCreate = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newTopic = { title, description };
      await axios.post(`${API_BASE_URL}/api/Topic`, newTopic);
      alert("Tạo chủ đề thành công!");
      navigate("/admin/topics");
    } catch (error) {
      console.error("Lỗi khi tạo chủ đề:", error);
      alert("Có lỗi xảy ra khi tạo chủ đề!");
    }
  };

  return (
    <div className="container">
      <h2>Tạo chủ đề mới</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Tiêu đề</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Mô tả</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Lưu
        </button>
      </form>
    </div>
  );
};

export default TopicCreate;