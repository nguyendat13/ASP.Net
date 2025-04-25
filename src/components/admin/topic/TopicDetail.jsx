// TopicDetail.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const TopicDetail = () => {
  const { id } = useParams();
  const [topic, setTopic] = useState(null);

  useEffect(() => {
    axios.get(`https://localhost:7177/api/Topic/${id}`)
      .then((res) => setTopic(res.data))
      .catch((err) => {
        console.error("Lỗi khi lấy chủ đề:", err);
        alert("Không tìm thấy chủ đề!");
      });
  }, [id]);

  if (!topic) return <div>Đang tải...</div>;

  return (
    <div className="container">
      <h2>Chi tiết chủ đề</h2>
      <p><strong>Tiêu đề:</strong> {topic.title}</p>
      <p><strong>Mô tả:</strong> {topic.description}</p>
      <Link className="btn btn-secondary ms-2" to="/admin/topics">Quay lại</Link>
    </div>
  );
};

export default TopicDetail;