import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../../config";

const PostCreate = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [topicId, setTopicId] = useState("");
  const [topics, setTopics] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/Topic`)
      .then((res) => setTopics(res.data))
      .catch((err) => console.error("Lỗi khi tải chủ đề:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("Title", title);
      formData.append("Content", content);
      formData.append("TopicId", parseInt(topicId, 10));
      formData.append("PublishedDate", new Date().toISOString());

      if (imageFile) {
        formData.append("ImageFile", imageFile); // ✅ trùng với backend DTO
      }

      await axios.post(`${API_BASE_URL}/api/Post`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Bài viết đã được tạo!");
      navigate(`/admin/posts`);
    } catch (error) {
      console.error("Lỗi khi tạo bài viết:", error);
      alert("Có lỗi xảy ra khi tạo bài viết!");
    }
  };

  return (
    <div className="container">
      <h2>Tạo bài viết mới</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title">Tiêu đề</label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="imageFile">Ảnh minh họa</label>
          <input
            type="file"
            className="form-control"
            id="imageFile"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setImageFile(file);
                setPreview(URL.createObjectURL(file));
              }
            }}
          />
          {preview && (
            <img
              src={preview}
              alt="preview"
              style={{ width: "150px", marginTop: "10px" }}
            />
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="content">Nội dung</label>
          <textarea
            className="form-control"
            id="content"
            rows="5"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="topicId">Chọn chủ đề</label>
          <select
            className="form-select"
            id="topicId"
            value={topicId}
            onChange={(e) => setTopicId(e.target.value)}
            required
          >
            <option value="">-- Chọn chủ đề --</option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Lưu
        </button>
      </form>
    </div>
  );
};

export default PostCreate;
