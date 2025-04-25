import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const PostEdit = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [topicId, setTopicId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`https://localhost:7177/api/Post/${id}`);
        setTitle(response.data.title);
        setContent(response.data.content);
        setTopicId(response.data.topicId);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin bài viết:", error);
      }
    };
    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedPost = {
        title,
        content,
        topicId,
        publishedDate: new Date(),
      };
      await axios.put(`https://localhost:7177/api/Post/${id}`, updatedPost);
      alert("Bài viết đã được cập nhật!");
      navigate(`/admin/posts`);
    } catch (error) {
      console.error("Lỗi khi cập nhật bài viết:", error);
      alert("Có lỗi xảy ra khi cập nhật bài viết!");
    }
  };

  return (
    <div className="container">
      <h2>Chỉnh sửa bài viết</h2>
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

export default PostEdit;