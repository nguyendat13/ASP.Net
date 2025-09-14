import React, { useState, useEffect } from "react";


import axios from "axios";

import { useParams, useNavigate } from "react-router-dom";
import API_BASE_URL from "../../../config";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/Post/${id}`);
        setPost(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy bài viết:", error);
      }
    };
    fetchPost();
  }, [id]);

  if (!post) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>{post.title}</h2>
      <p><strong>Chủ đề:</strong> {post.topicId}</p>
      <p>{post.content}</p>
      <p><strong>Ngày đăng:</strong> {new Date(post.publishedDate).toLocaleDateString()}</p>

      <button className="btn btn-secondary mt-3" onClick={() => navigate("/admin/posts")}>
        Quay lại
      </button>
    </div>
  );
};

export default PostDetail;