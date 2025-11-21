import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Newspaper, Calendar, User, ArrowRight } from "lucide-react";
import API_BASE_URL from "../../../config";

const PostsUser = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/Post`)
      .then((res) => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy danh sách bài viết:", err);
        setLoading(false);
      });
  }, []);

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
          textAlign: "center",
          marginBottom: "40px",
          borderRadius: "0 0 16px 16px",
        }}
      >
        <h2
          style={{
            fontSize: isMobile ? "1.5rem" : "2.5rem",
            fontWeight: "700",
            margin: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            letterSpacing: "-0.5px",
          }}
        >
          <Newspaper size={isMobile ? 28 : 36} />
          Tin tức & Bài viết
        </h2>
        <p
          style={{
            marginTop: "12px",
            fontSize: "1rem",
            opacity: 0.9,
          }}
        >
          Khám phá những bài viết hữu ích và tin tức mới nhất
        </p>
      </div>

      {/* Main Content */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: isMobile ? "0 15px" : "0 20px",
        }}
      >
        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#aaa",
              fontSize: "1.1rem",
            }}
          >
            Đang tải bài viết...
          </div>
        ) : posts.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? "150px" : "300px"}, 1fr))`,
              gap: "24px",
            }}
          >
            {posts.map((post) => (
              <div
                key={post.id}
                onMouseEnter={() => setHoveredCard(post.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  background: "#23272a",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: hoveredCard === post.id
                    ? "0 20px 40px rgba(67, 160, 71, 0.15)"
                    : "0 8px 24px rgba(0,0,0,0.3)",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: hoveredCard === post.id ? "translateY(-8px)" : "translateY(0)",
                  border: "1px solid rgba(67, 160, 71, 0.15)",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                {/* Image Section */}
                <div
                  style={{
                    height: "200px",
                    overflow: "hidden",
                    position: "relative",
                    background: "linear-gradient(135deg, #2a2f33 0%, #1e1e1e 100%)",
                  }}
                >
                  <img
                    src={
                      post.imageUrl
                        ? post.imageUrl.startsWith("http")
                          ? post.imageUrl
                          : `${API_BASE_URL}${post.imageUrl}`
                        : "https://via.placeholder.com/400x250?text=No+Image"
                    }
                    alt={post.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.4s ease",
                      transform: hoveredCard === post.id ? "scale(1.1)" : "scale(1)",
                    }}
                  />
                </div>

                {/* Content Section */}
                <div
                  style={{
                    padding: "20px",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Title */}
                  <h5
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "600",
                      color: "#fff",
                      marginBottom: "12px",
                      lineHeight: "1.4",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {post.title}
                  </h5>

                  {/* Meta Info */}
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      fontSize: "0.8rem",
                      color: "#81c784",
                      marginBottom: "12px",
                      flexWrap: "wrap",
                    }}
                  >
                    {post.publishedDate && (
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <Calendar size={14} />
                        {formatDate(post.publishedDate)}
                      </div>
                    )}
                    {post.topicName && (
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <User size={14} />
                        {post.topicName}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p
                    style={{
                      color: "#aaa",
                      fontSize: "0.9rem",
                      lineHeight: "1.6",
                      marginBottom: "16px",
                      flex: 1,
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                    dangerouslySetInnerHTML={{
                      __html:
                        post.excerpt ||
                        (post.content?.length > 100
                          ? post.content.substring(0, 100) + "..."
                          : post.content),
                    }}
                  />

                  {/* Read More Button */}
                  <Link
                    to={`/posts/${post.id}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      padding: "12px 16px",
                      background: "linear-gradient(135deg, #43a047 0%, #2e7d32 100%)",
                      color: "#fff",
                      textDecoration: "none",
                      borderRadius: "12px",
                      fontWeight: "600",
                      fontSize: "0.95rem",
                      transition: "all 0.3s ease",
                      boxShadow: hoveredCard === post.id
                        ? "0 8px 20px rgba(67, 160, 71, 0.3)"
                        : "0 4px 12px rgba(67, 160, 71, 0.15)",
                      transform: hoveredCard === post.id ? "translateX(2px)" : "translateX(0)",
                    }}
                  >
                    Đọc thêm
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#aaa",
              fontSize: "1.1rem",
            }}
          >
            😔 Không có bài viết nào
          </div>
        )}
      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }

        @media (max-width: 768px) {
          h2 {
            font-size: 1.3rem !important;
          }

          p {
            font-size: 0.9rem !important;
          }
        }

        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
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

export default PostsUser;