import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaNewspaper } from "react-icons/fa";
import API_BASE_URL from "../../../config";

const PostsUser = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/Post`)
      .then((res) => setPosts(res.data))
      .catch((err) => console.error("Lỗi khi lấy danh sách bài viết:", err));
  }, []);

  return (
    <div
      className="container-fluid mt-5"
      style={{
        background: "var(--background)",
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        padding: "32px 0",
        minHeight: "80vh",
      }}
    >
      <h2
        className="text-center mb-5"
        style={{
          color: "var(--foreground)",
          fontWeight: "bold",
          fontSize: "2.5rem",
        }}
      >
        <FaNewspaper style={{ color: "#fff", marginRight: "10px" }} />
        Tin tức & Bài viết
      </h2>

      <div className="row g-4 justify-content-center px-3">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div className="col-sm-12 col-md-6 col-lg-4" key={post.id}>
              <div
                className="card h-100"
                style={{
                  background: "#fff",
                  borderRadius: "12px",
                  boxShadow: "0 6px 24px rgba(0,0,0,0.15)",
                  overflow: "hidden",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
              >
                <div
                  className="post-img-wrap"
                  style={{
                    height: "220px",
                    overflow: "hidden",
                    position: "relative",
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
                    }}
                  />
                </div>
                <div
                  className="card-body d-flex flex-column justify-content-between"
                  style={{ padding: "20px" }}
                >
                  <h5
                    className="card-title mb-2"
                    style={{
                      fontWeight: "bold",
                      fontSize: "1.4rem",
                      color: "#333",
                    }}
                  >
                    {post.title}
                  </h5>
                  <p
                    className="card-text"
                    style={{
                      color: "#666",
                      fontSize: "1rem",
                      maxHeight: "80px",
                      overflow: "hidden",
                    }}
                    dangerouslySetInnerHTML={{
                      __html:
                        post.content.length > 10
                          ? post.content.substring(0, 10) + "..."
                          : post.content,
                    }}
                  ></p>
                  <Link
                    to={`/posts/${post.id}`}
                    className="btn btn-success mt-3"
                    style={{
                      color: "#fff",
                      fontWeight: "bold",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }}
                  >
                    Đọc thêm
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted fs-5 mt-4">
            Đang tải bài viết...
          </div>
        )}
      </div>

      <style>{`
    .post-img-wrap img:hover {
      transform: scale(1.1);
    }
    .card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 32px rgba(0,0,0,0.25);
    }
  `}</style>
    </div>
  );
};

export default PostsUser;
