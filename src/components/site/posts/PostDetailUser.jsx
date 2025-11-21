import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, BookOpen, Calendar, Tag, Heart } from "lucide-react";
import API_BASE_URL from "../../../config";

const PostDetailUser = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/Post/${id}`)
      .then((res) => {
        setPost(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy chi tiết bài viết:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div
        style={{
          background: "#1a1a1a",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#aaa",
          fontSize: "1.1rem",
        }}
      >
        Đang tải bài viết...
      </div>
    );
  }

  if (!post) {
    return (
      <div
        style={{
          background: "#1a1a1a",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ff6b6b",
          fontSize: "1.1rem",
        }}
      >
        Không tìm thấy bài viết
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div
      style={{
        background: "#1a1a1a",
        minHeight: "100vh",
        paddingTop: "20px",
        paddingBottom: "60px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #43a047 0%, #2e7d32 100%)",
          color: "#fff",
          padding: isMobile ? "30px 15px" : "40px 20px",
          marginBottom: "40px",
          borderRadius: "0 0 16px 16px",
        }}
      >
        <Link
          to="/posts"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 16px",
            background: "rgba(255,255,255,0.2)",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "8px",
            fontWeight: "600",
            transition: "all 0.3s ease",
            marginBottom: "20px",
            fontSize: "0.95rem",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "rgba(255,255,255,0.3)";
            e.target.style.transform = "translateX(-4px)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "rgba(255,255,255,0.2)";
            e.target.style.transform = "translateX(0)";
          }}
        >
          <ArrowLeft size={18} />
          Quay lại
        </Link>

        <h1
          style={{
            fontSize: isMobile ? "1.8rem" : "2.5rem",
            fontWeight: "700",
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <BookOpen size={isMobile ? 28 : 36} />
          {post.title}
        </h1>
      </div>

      {/* Main Content */}
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: isMobile ? "0 15px" : "0 20px",
        }}
      >
        {/* Meta Info */}
        <div
          style={{
            display: "flex",
            gap: isMobile ? "16px" : "24px",
            flexWrap: "wrap",
            marginBottom: "30px",
            padding: "20px",
            background: "#23272a",
            borderRadius: "12px",
            border: "1px solid rgba(67, 160, 71, 0.15)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#81c784",
              fontSize: "0.95rem",
            }}
          >
            <Calendar size={18} />
            <span>{formatDate(post.publishedDate)}</span>
          </div>

          {post.topicName && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#81c784",
                fontSize: "0.95rem",
              }}
            >
              <Tag size={18} />
              <span>{post.topicName}</span>
            </div>
          )}
        </div>

        {/* Featured Image */}
        {post.imageUrl && (
          <div
            style={{
              marginBottom: "40px",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              border: "1px solid rgba(67, 160, 71, 0.15)",
            }}
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
                height: "auto",
                maxHeight: isMobile ? "300px" : "500px",
                objectFit: "cover",
                transition: "transform 0.4s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
              }}
            />
          </div>
        )}

        {/* Post Content */}
        <div
          style={{
            background: "#23272a",
            padding: isMobile ? "20px" : "40px",
            borderRadius: "16px",
            border: "1px solid rgba(67, 160, 71, 0.15)",
            marginBottom: "40px",
          }}
        >
          <article
            style={{
              color: "#ccc",
              fontSize: "1.05rem",
              lineHeight: "1.8",
              textAlign: "justify",
            }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Footer */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(67, 160, 71, 0.1) 0%, rgba(67, 160, 71, 0.05) 100%)",
            padding: "30px",
            borderRadius: "16px",
            border: "1px solid rgba(67, 160, 71, 0.2)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              color: "#81c784",
              fontSize: "1.1rem",
              fontWeight: "600",
              marginBottom: "12px",
            }}
          >
            <Heart size={22} style={{ fill: "#e53935", color: "#e53935" }} />
            Cảm ơn bạn đã đọc bài viết
          </div>
          <p
            style={{
              color: "#aaa",
              fontSize: "0.95rem",
              margin: "12px 0 0 0",
            }}
          >
            Hãy theo dõi chúng tôi để xem thêm nhiều bài viết thú vị khác!
          </p>
        </div>

        {/* Related Actions */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            marginTop: "40px",
            flexWrap: "wrap",
          }}
        >
          <Link
            to="/posts"
            style={{
              padding: "12px 24px",
              background: "linear-gradient(135deg, #43a047 0%, #2e7d32 100%)",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "12px",
              fontWeight: "600",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 12px rgba(67, 160, 71, 0.2)",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-4px)";
              e.target.style.boxShadow = "0 8px 20px rgba(67, 160, 71, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 12px rgba(67, 160, 71, 0.2)";
            }}
          >
            Xem tất cả bài viết
          </Link>

          <Link
            to="/"
            style={{
              padding: "12px 24px",
              background: "transparent",
              color: "#43a047",
              textDecoration: "none",
              borderRadius: "12px",
              fontWeight: "600",
              border: "2px solid #43a047",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(67, 160, 71, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
            }}
          >
            Về trang chủ
          </Link>
        </div>
      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }

        article p {
          margin-bottom: 16px;
        }

        article h2 {
          color: #43a047;
          margin-top: 32px;
          margin-bottom: 16px;
          font-size: 1.5rem;
          font-weight: 700;
        }

        article h3 {
          color: #81c784;
          margin-top: 24px;
          margin-bottom: 12px;
          font-size: 1.2rem;
          font-weight: 600;
        }

        article ul,
        article ol {
          margin: 16px 0;
          padding-left: 24px;
          color: #ccc;
        }

        article li {
          margin-bottom: 8px;
        }

        article blockquote {
          border-left: 4px solid #43a047;
          padding-left: 16px;
          margin: 24px 0;
          color: #aaa;
          font-style: italic;
        }

        article a {
          color: #43a047;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        article a:hover {
          color: #81c784;
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          article {
            font-size: 1rem !important;
          }

          h1 {
            font-size: 1.5rem !important;
          }

          h2 {
            font-size: 1.2rem !important;
          }

          h3 {
            font-size: 1rem !important;
          }
        }

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #2a2f33;
        }

        ::-webkit-scrollbar-thumb {
          background: #43a047;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #2e7d32;
        }
      `}</style>
    </div>
  );
};

export default PostDetailUser;