// TopicEdit.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const TopicEdit = () => {
  const { id } = useParams();
  const [topic, setTopic] = useState({ title: "", description: "" });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`https://localhost:7177/api/Topic/${id}`)
      .then((res) => setTopic(res.data))
      .catch((err) => {
        console.error("Lỗi khi tải dữ liệu:", err);
        alert("Không tìm thấy chủ đề!");
      });
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://localhost:7177/api/Topic/${id}`, topic);
      alert("Cập nhật thành công!");
      navigate("/admin/topics");
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      alert("Cập nhật thất bại!");
    }
  };

  return (
    <div className="container">
      <h2>Chỉnh sửa chủ đề</h2>
      <form onSubmit={handleUpdate}>
        <div className="mb-3">
          <label>Tiêu đề</label>
          <input
            type="text"
            className="form-control"
            value={topic.title}
            onChange={(e) => setTopic({ ...topic, title: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label>Mô tả</label>
          <textarea
            className="form-control"
            value={topic.description}
            onChange={(e) =>
              setTopic({ ...topic, description: e.target.value })
            }
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Cập nhật
        </button>
      </form>
    </div>
  );
};

export default TopicEdit;