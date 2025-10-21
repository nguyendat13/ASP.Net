import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaBookOpen, FaCalendarAlt, FaTag } from "react-icons/fa";
import API_BASE_URL from "../../../config";

const PostDetailUser = () => {
const { id } = useParams();
const [post, setPost] = useState(null);

useEffect(() => {
axios
.get(`${API_BASE_URL}/api/Post/${id}`)
.then((res) => setPost(res.data))
.catch((err) => console.error("Lỗi khi lấy chi tiết bài viết:", err));
}, [id]);

if (!post)
return ( <div className="text-center text-muted mt-5 fs-5">
Đang tải bài viết... </div>
);

return (
<div
className="container my-5 py-5 px-4"
style={{
background: "#fff",
borderRadius: "16px",
boxShadow: "0 6px 24px rgba(0,0,0,0.08)",
maxWidth: "900px",
}}
>
{/* Nút quay lại */} <div className="d-flex justify-content-start mb-4">
<Link
to="/"
className="btn btn-success border d-flex align-items-center gap-2"
style={{
borderRadius: "8px",
color: "#fff",
fontWeight: "500",
transition: "all 0.2s ease",
}}
> <FaArrowLeft /> Quay lại </Link> </div>

  {/* Tiêu đề */}
  <h1
    className="text-center mb-4"
    style={{
      color: "#222",
      fontWeight: "700",
      fontSize: "2.2rem",
      lineHeight: "1.4",
    }}
  >
    <FaBookOpen style={{ color: "#aaa", marginRight: "10px" }} />
    {post.title}
  </h1>

  {/* Thông tin phụ */}
  <div
    className="text-center mb-4 text-muted"
    style={{ fontSize: "0.95rem" }}
  >
    <span className="me-3">
      <FaCalendarAlt className="me-1" />
      {new Date(post.publishedDate).toLocaleDateString("vi-VN")}
    </span>
    <span>
      <FaTag className="me-1" />
      {post.topicName}
    </span>
  </div>

  {/* Hình ảnh chính */}
  {post.imageUrl && (
    <div
      className="text-center mb-5"
      style={{ position: "relative", overflow: "hidden", borderRadius: "12px" }}
    >
      <img
        src={
          post.imageUrl.startsWith("http")
            ? post.imageUrl
            : `${API_BASE_URL}${post.imageUrl}`
        }
        alt={post.title}
        style={{
          width: "100%",
          maxHeight: "450px",
          objectFit: "cover",
          borderRadius: "12px",
          transition: "transform 0.3s ease",
        }}
        className="shadow-sm"
      />
    </div>
  )}

  {/* Nội dung bài viết */}
  <div
    className="post-content"
    style={{
      color: "#333",
      fontSize: "1.05rem",
      lineHeight: "1.8",
      textAlign: "justify",
    }}
    dangerouslySetInnerHTML={{ __html: post.content }}
  ></div>

  {/* Footer */}
  <div
    className="mt-5 pt-4 border-top text-center text-muted"
    style={{ fontSize: "0.95rem" }}
  >
    <p>Cảm ơn bạn đã đọc bài viết 💙</p>
    <p>Hãy theo dõi chúng tôi để xem thêm nhiều bài viết thú vị khác!</p>
  </div>

  {/* Hiệu ứng hover ảnh */}
  <style>{`
    img:hover {
      transform: scale(1.03);
    }
    .btn-light:hover {
      background: #f0f0f0;
    }
  `}</style>
</div>

);
};

export default PostDetailUser;
