// TopicTrash.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const TopicTrash = () => {
  const [deletedTopics, setDeletedTopics] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/Topic`)
      .then((res) => {
        const deleted = res.data.filter(t => t.isDeleted); // nếu có trường isDeleted
        setDeletedTopics(deleted);
      })
      .catch((err) => console.error("Lỗi khi tải chủ đề:", err));
  }, []);

  return (
    <div className="container">
      <h2>Thùng rác chủ đề</h2>
      {deletedTopics.length === 0 ? (
        <p>Không có chủ đề nào đã bị xóa.</p>
      ) : (
        <ul className="list-group">
          {deletedTopics.map((topic) => (
            <li key={topic.id} className="list-group-item">
              <strong>{topic.title}</strong> - {topic.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TopicTrash;