import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import API_BASE_URL from "../../../config";

const PostCreate = () => {
const [title, setTitle] = useState("");
const [content, setContent] = useState("");
const [topicId, setTopicId] = useState("");
const [topics, setTopics] = useState([]);
const [imageFile, setImageFile] = useState(null);
const [preview, setPreview] = useState(null);
const [useCloudinary, setUseCloudinary] = useState(true);
const navigate = useNavigate();

useEffect(() => {
axios
.get(`${API_BASE_URL}/api/Topic`)
.then((res) => setTopics(res.data))
.catch((err) => console.error("Lỗi khi tải chủ đề:", err));
}, []);

const handleSubmit = async (e) => {
e.preventDefault();
try {
const formData = new FormData();
formData.append("Title", title);
formData.append("Content", content);
formData.append("TopicId", parseInt(topicId, 10));
formData.append("PublishedDate", new Date().toISOString());
if (imageFile) formData.append("ImageFile", imageFile);

  await axios.post(`${API_BASE_URL}/api/Post?useCloudinary=${useCloudinary}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  alert("Bài viết đã được tạo!");
  navigate(`/admin/posts`);
} catch (error) {
  console.error("Lỗi khi tạo bài viết:", error);
  alert("Có lỗi xảy ra khi tạo bài viết!");
}


};

return ( <div className="container"> <h2 className="mb-4">📝 Tạo bài viết mới</h2> <form onSubmit={handleSubmit}> <div className="mb-3"> <label htmlFor="title" className="form-label fw-bold">Tiêu đề</label>
<input
type="text"
className="form-control"
id="title"
value={title}
onChange={(e) => setTitle(e.target.value)}
required
/> </div>

    <div className="mb-3 form-check">
      <input
        type="checkbox"
        className="form-check-input"
        checked={useCloudinary}
        onChange={(e) => setUseCloudinary(e.target.checked)}
      />
      <label className="form-check-label">Lưu ảnh lên Cloudinary</label>
    </div>

    <div className="mb-3">
      <label htmlFor="imageFile" className="form-label fw-bold">Ảnh minh họa</label>
      <input
        type="file"
        className="form-control"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
          }
        }}
      />
      {preview && (
        <img src={preview} alt="preview" style={{ width: "150px", marginTop: "10px" }} />
      )}
    </div>

    <div className="mb-3">
      <label className="fw-bold mb-2">Nội dung bài viết</label>
      <Editor
        apiKey="3os1l1w4sbm08aeobf8xh3yyavjus283isn3sizk9tmkbiqd"
        value={content}
        onEditorChange={(newContent) => setContent(newContent)}
        init={{
          height: 400,
          menubar: true,
          plugins: [
            "advlist autolink lists link image charmap preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table help wordcount",
          ],
          toolbar:
            "undo redo | styles | bold italic underline | alignleft aligncenter alignright alignjustify | " +
            "bullist numlist outdent indent | fontfamily fontsize forecolor backcolor | " +
            "table image link | removeformat | help",
          font_family_formats:
            "Arial=arial,helvetica,sans-serif; Courier New=courier new,courier,monospace; Times New Roman=times new roman,times;",
          fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />
    </div>

    <div className="mb-3">
      <label htmlFor="topicId" className="form-label fw-bold">Chọn chủ đề</label>
      <select
        className="form-select"
        id="topicId"
        value={topicId}
        onChange={(e) => setTopicId(e.target.value)}
        required
      >
        <option value="">-- Chọn chủ đề --</option>
        {topics.map((t) => (
          <option key={t.id} value={t.id}>
            {t.title}
          </option>
        ))}
      </select>
    </div>

    <button type="submit" className="btn btn-primary">Lưu bài viết</button>
  </form>
</div>


);
};

export default PostCreate;
