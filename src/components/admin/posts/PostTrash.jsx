
import React from "react";


import axios from "axios";

import { useNavigate, useParams } from "react-router-dom";
import API_BASE_URL from "../../../config";

const PostTrash = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleTrash = async () => {
    try {
      await axios.put(`${API_BASE_URL}/api/Post/Trash/${id}`);
      alert("Bài viết đã được đánh dấu là xóa.");
      navigate("/posts");
    } catch (error) {
      console.error("Lỗi khi xóa bài viết:", error);
      alert("Có lỗi xảy ra khi xóa bài viết!");
    }
  };

  return (
    <div className="container">
      <h2>Đánh dấu bài viết là đã xóa</h2>
      <p>Bạn có chắc chắn muốn đánh dấu bài viết này là đã xóa?</p>
      <button className="btn btn-danger" onClick={handleTrash}>
        Đánh dấu xóa
      </button>
    </div>
  );
};

export default PostTrash;
