import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link từ react-router-dom để điều hướng.

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // Thêm lỗi khi tải dữ liệu

  // Function to fetch contacts from API
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get("https://localhost:7177/api/Contact");
      setContacts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách liên hệ:", error);
      setError("Lỗi khi tải dữ liệu");
      setLoading(false);
    }
  };

  // Function to delete contact
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xoá liên hệ này không?")) {
      try {
        await axios.delete(`https://localhost:7177/api/Contact/${id}`);
        fetchContacts(); // Reload the contacts list
      } catch (error) {
        console.error("Lỗi khi xoá liên hệ:", error);
      }
    }
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container py-4">
      <h2>Danh sách liên hệ</h2>
      <Link to="/admin/contacts/trash" className="btn btn-danger mb-3">
        Xem Thùng rác
      </Link>
      <table className="table table-bordered table-striped">
        <thead className="thead-dark">
          <tr>
            <th>#</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Thông điệp</th>
            <th>Ngày gửi</th>
            <th>Chức năng</th>
          </tr>
        </thead>
        <tbody>
          {contacts.length > 0 ? (
            contacts.map((contact, index) => (
              <tr key={contact.id}>
                <td>{index + 1}</td>
                <td>{contact.name}</td>
                <td>{contact.email}</td>
                <td>{contact.message}</td>
                <td>{new Date(contact.createdAt).toLocaleString()}</td>
                <td>
                  <Link
                    to={`/admin/contacts/detail/${contact.id}`}
                    className="btn btn-sm btn-info me-2"
                  >
                    Xem
                  </Link>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(contact.id)}
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                Không có liên hệ nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ContactList;