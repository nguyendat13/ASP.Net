import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import API_BASE_URL from "../../../config";

const PostEdit = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [topicId, setTopicId] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/Post/${id}`);
        setTitle(response.data.title);
        setContent(response.data.content);
        setTopicId(response.data.topicId);

        // set ảnh preview từ backend nếu có
        if (response.data.imageUrl) {
          setPreview(`${API_BASE_URL}${response.data.imageUrl}`);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin bài viết:", error);
      }
    };
    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("topicId", parseInt(topicId, 10));

      if (imageFile) {
        formData.append("imageFile", imageFile); // key trùng với backend
      }

      await axios.put(`${API_BASE_URL}/api/Post/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

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
          <label htmlFor="topicId">Chủ đề</label>
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
