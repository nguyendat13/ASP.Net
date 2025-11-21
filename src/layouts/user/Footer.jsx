// layouts/user/Footer.jsx
import React, { useState, useEffect } from "react";
import API_BASE_URL from "../../config";

const Footer = () => {
  const [categories, setCategories] = useState([]);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    // Lấy danh mục
    fetch(`${API_BASE_URL}/api/Category`)
      .then(res => res.ok && res.json())
      .then(data => setCategories(data?.slice(0, 5) || []))
      .catch(err => console.error("Lỗi lấy danh mục:", err));

    // Lấy thông tin liên hệ
    fetch(`${API_BASE_URL}/api/Contact`)
      .then(res => res.ok && res.json())
      .then(data => setContacts(data || []))
      .catch(err => console.error("Lỗi lấy liên hệ:", err));
  }, []);

  const getContactInfo = (type) => {
    const contact = contacts.find(c => c.type === type);
    return contact ? contact.value : null;
  };

  return (
    <footer
      style={{
        background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
        color: "#fff",
        paddingTop: "60px",
        paddingBottom: "20px",
        marginTop: "100px",
        borderTop: "3px solid #43a047",
      }}
    >
      {/* Main Footer Content */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 20px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "40px",
            marginBottom: "40px",
          }}
        >
          {/* Company Info */}
          <div>
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                marginBottom: "16px",
                color: "#43a047",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Phát Đạt Store
            </h3>
            <p
              style={{
                fontSize: "0.95rem",
                lineHeight: "1.6",
                color: "#ccc",
                marginBottom: "20px",
              }}
            >
              Cửa hàng bán sản phẩm chất lượng cao với giá cả cạnh tranh. Đồng hành cùng bạn trong mọi lúc.
            </p>
            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "16px",
              }}
            >
              {[
                { icon: "f", label: "Facebook" },
                { icon: "in", label: "LinkedIn" },
                { icon: "tw", label: "Twitter" },
                { icon: "ig", label: "Instagram" },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "linear-gradient(135deg, #43a047 0%, #2e7d32 100%)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: "700",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                    transform: "translateY(0)",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-4px)";
                    e.target.style.boxShadow = "0 8px 20px rgba(67, 160, 71, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "none";
                  }}
                  title={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4
              style={{
                fontSize: "1.1rem",
                fontWeight: "700",
                marginBottom: "20px",
                color: "#43a047",
                textTransform: "uppercase",
              }}
            >
              Danh mục
            </h4>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
              }}
            >
              {categories.length > 0 ? (
                categories.map((category) => (
                  <li key={category.id} style={{ marginBottom: "12px" }}>
                    <a
                      href={`/products?category=${category.id}`}
                      style={{
                        color: "#ccc",
                        textDecoration: "none",
                        fontSize: "0.95rem",
                        transition: "all 0.3s ease",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = "#43a047";
                        e.target.style.transform = "translateX(8px)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = "#ccc";
                        e.target.style.transform = "translateX(0)";
                      }}
                    >
                      <span style={{ fontSize: "1.2rem" }}>→</span>
                      {category.name}
                    </a>
                  </li>
                ))
              ) : (
                <li style={{ color: "#999" }}>Không có danh mục</li>
              )}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              style={{
                fontSize: "1.1rem",
                fontWeight: "700",
                marginBottom: "20px",
                color: "#43a047",
                textTransform: "uppercase",
              }}
            >
              Liên kết nhanh
            </h4>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
              }}
            >
              {[
                { name: "Trang chủ", href: "/" },
                { name: "Cửa hàng", href: "/products" },
                { name: "Blog", href: "/posts" },
                { name: "Giới thiệu", href: "/about" },
                { name: "Chính sách", href: "/policy" },
              ].map((link) => (
                <li key={link.name} style={{ marginBottom: "12px" }}>
                  <a
                    href={link.href}
                    style={{
                      color: "#ccc",
                      textDecoration: "none",
                      fontSize: "0.95rem",
                      transition: "all 0.3s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "#43a047";
                      e.target.style.transform = "translateX(8px)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "#ccc";
                      e.target.style.transform = "translateX(0)";
                    }}
                  >
                    <span style={{ fontSize: "1.2rem" }}>→</span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4
              style={{
                fontSize: "1.1rem",
                fontWeight: "700",
                marginBottom: "20px",
                color: "#43a047",
                textTransform: "uppercase",
              }}
            >
              Liên hệ
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                }}
              >
                <span style={{ fontSize: "1.3rem" }}>📍</span>
                <div>
                  <p style={{ margin: "0", fontSize: "0.9rem", color: "#999" }}>Địa chỉ:</p>
                  <p style={{ margin: "0", fontSize: "0.95rem", color: "#ccc" }}>
                    {getContactInfo("address") || "123 Đường ABC, TP.HCM"}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <span style={{ fontSize: "1.3rem" }}>📞</span>
                <div>
                  <p style={{ margin: "0", fontSize: "0.9rem", color: "#999" }}>Điện thoại:</p>
                  <a
                    href={`tel:${getContactInfo("phone") || "1900123456"}`}
                    style={{
                      margin: "0",
                      fontSize: "0.95rem",
                      color: "#43a047",
                      textDecoration: "none",
                      fontWeight: "600",
                    }}
                  >
                    {getContactInfo("phone") || "1900 123 456"}
                  </a>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <span style={{ fontSize: "1.3rem" }}>✉️</span>
                <div>
                  <p style={{ margin: "0", fontSize: "0.9rem", color: "#999" }}>Email:</p>
                  <a
                    href={`mailto:${getContactInfo("email") || "info@phatdat.com"}`}
                    style={{
                      margin: "0",
                      fontSize: "0.95rem",
                      color: "#43a047",
                      textDecoration: "none",
                      fontWeight: "600",
                    }}
                  >
                    {getContactInfo("email") || "info@phatdat.com"}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background: "rgba(67, 160, 71, 0.2)",
            margin: "40px 0",
          }}
        />

        {/* Bottom Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "0.9rem",
              color: "#999",
            }}
          >
            © 2025 Phát Đạt Store. All rights reserved.
          </p>

          <div
            style={{
              display: "flex",
              gap: "20px",
            }}
          >
            {["Bảo mật", "Điều khoản", "Cookie", "Sitemap"].map((item) => (
              <a
                key={item}
                href="#"
                style={{
                  fontSize: "0.85rem",
                  color: "#999",
                  textDecoration: "none",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#43a047")}
                onMouseLeave={(e) => (e.target.style.color = "#999")}
              >
                {item}
              </a>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              gap: "8px",
            }}
          >
            {["Visa", "Mastercard", "PayPal", "COD"].map((payment) => (
              <span
                key={payment}
                style={{
                  padding: "6px 12px",
                  background: "rgba(67, 160, 71, 0.1)",
                  border: "1px solid rgba(67, 160, 71, 0.3)",
                  borderRadius: "6px",
                  fontSize: "0.8rem",
                  color: "#43a047",
                  fontWeight: "600",
                }}
              >
                {payment}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          width: "50px",
          height: "50px",
          background: "linear-gradient(135deg, #43a047 0%, #2e7d32 100%)",
          border: "none",
          borderRadius: "50%",
          color: "#fff",
          fontSize: "1.5rem",
          cursor: "pointer",
          boxShadow: "0 4px 16px rgba(67, 160, 71, 0.3)",
          transition: "all 0.3s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 999,
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "translateY(-6px)";
          e.target.style.boxShadow = "0 8px 24px rgba(67, 160, 71, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "translateY(0)";
          e.target.style.boxShadow = "0 4px 16px rgba(67, 160, 71, 0.3)";
        }}
        title="Cuộn lên trên"
      >
        ↑
      </button>

      <style>{`
        @media (max-width: 768px) {
          footer {
            padding-top: 40px !important;
          }

          h3 {
            font-size: 1.2rem !important;
          }

          h4 {
            font-size: 1rem !important;
          }

          a[href] {
            font-size: 0.85rem !important;
          }

          button {
            width: 40px !important;
            height: 40px !important;
            bottom: 20px !important;
            right: 20px !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;