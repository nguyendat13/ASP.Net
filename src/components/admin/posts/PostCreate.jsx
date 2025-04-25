import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PostCreate = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [topicId, setTopicId] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newPost = {
        title,
        content,
        topicId,
        publishedDate: new Date(),
      };
      const response = await axios.post("https://localhost:7177/api/Post", newPost);
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
          <input
            type="number"
            className="form-control"
            id="topicId"
            value={topicId}
            onChange={(e) => setTopicId(e.target.value)}
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

export default PostCreate;