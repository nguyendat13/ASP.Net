
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrashRestore } from "react-icons/fa";

const ContactTrash = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    axios.get("https://localhost:7177/api/Contact/trash").then((res) => {
      setContacts(res.data);
    });
  }, []);

  const restoreContact = (id) => {
    axios.put(`https://localhost:7177/api/Contact/restore/${id}`).then(() => {
      setContacts(contacts.filter((c) => c.id !== id));
    });
  };

  return (
    <div className="container mt-4">
      <h2>Liên hệ đã xoá</h2>
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Chủ đề</th>
            <th>Khôi phục</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.subject}</td>
              <td>
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => restoreContact(c.id)}
                >
                  <FaTrashRestore />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContactTrash;
