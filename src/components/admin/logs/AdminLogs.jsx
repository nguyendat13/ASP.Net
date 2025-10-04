import { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import API_BASE_URL from "../../../config";

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("jwt-token");

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const res = await axios.get(`${API_BASE_URL}/api/ActivityLog`, {
        params: {
          Page: 1,
          PageSize: 25,
          From: today,
          To: today
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(res.data.items || []);
    } catch (error) {
      console.error("Lỗi khi load logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const deleteAllLogs = async () => {
    if (!window.confirm("Bạn có chắc muốn xóa tất cả logs?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/ActivityLog/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Đã xóa tất cả logs!");
      fetchLogs();
    } catch (error) {
      console.error("Xóa logs thất bại:", error);
      alert("Xóa logs thất bại!");
    }
  };

  const deleteLog = async (id) => {
    if (!window.confirm(`Bạn có chắc muốn xóa log #${id}?`)) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/ActivityLog/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(`Đã xóa log #${id}!`);
      setLogs(logs.filter(log => log.id !== id)); // xóa khỏi state
    } catch (error) {
      console.error(`Xóa log #${id} thất bại:`, error);
      alert(`Xóa log #${id} thất bại!`);
    }
  };

  if (loading) return <p>Đang tải logs...</p>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Activity Logs</h2>
        <button
          onClick={deleteAllLogs}
          className="bg-red-500 text-danger px-4 py-2 rounded hover:bg-red-600"
        >
          <FaTrash/> Xóa tất cả logs
        </button>
      </div>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-3 py-2">ID</th>
            <th className="border px-3 py-2">User</th>
            <th className="border px-3 py-2">Action</th>
            <th className="border px-3 py-2">Entity</th>
            <th className="border px-3 py-2">EntityId</th>
            <th className="border px-3 py-2">Details</th>
            <th className="border px-3 py-2">IP</th>
            <th className="border px-3 py-2">Time</th>
            <th className="border px-3 py-2">Hành động</th> {/* cột nút xóa */}
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 ? (
            <tr>
              <td colSpan="9" className="text-center p-4">Không có log nào</td>
            </tr>
          ) : (
            logs.map((log) => (
              <tr key={log.id}>
                <td className="border px-3 py-2">{log.id}</td>
                <td className="border px-3 py-2">{log.userId || "Guest"}</td>
                <td className="border px-3 py-2">{log.action}</td>
                <td className="border px-3 py-2">{log.entityType}</td>
                <td className="border px-3 py-2">{log.entityId}</td>
                <td className="border px-3 py-2">
                  <pre className="whitespace-pre-wrap">{log.details}</pre>
                </td>
                <td className="border px-3 py-2">{log.ipAddress}</td>
                <td className="border px-3 py-2">
                  {new Date(log.createdAt).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}
                </td>
                <td className="border px-5 py-2">
                  <button
                    onClick={() => deleteLog(log.id)}
                    className=" text-danger px-3 py-1 rounded hover:bg-red-600"
                  >
                      <FaTrash /> 

                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminLogs;
