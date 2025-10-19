import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import API_BASE_URL from "../../../config";

const PostEdit = () => {
const { id } = useParams();
const [title, setTitle] = useState("");
const [content, setContent] = useState("");
const [topicId, setTopicId] = useState("");
const [imageFile, setImageFile] = useState(null);
const [preview, setPreview] = useState(null);
const [useCloudinary, setUseCloudinary] = useState(true);
const navigate = useNavigate();

useEffect(() => {
const fetchPost = async () => {
try {
const res = await axios.get(`${API_BASE_URL}/api/Post/${id}`);
setTitle(res.data.title);
setContent(res.data.content);
setTopicId(res.data.topicId);
if (res.data.imageUrl) setPreview(`${API_BASE_URL}${res.data.imageUrl}`);
} catch (err) {
console.error("Lỗi khi lấy bài viết:", err);
}
};
fetchPost();
}, [id]);

const handleSubmit = async (e) => {
e.preventDefault();
try {
const formData = new FormData();
formData.append("title", title);
formData.append("content", content);
formData.append("topicId", parseInt(topicId, 10));
if (imageFile) formData.append("imageFile", imageFile);

  await axios.put(`${API_BASE_URL}/api/Post/${id}?useCloudinary=${useCloudinary}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  alert("Bài viết đã được cập nhật!");
  navigate(`/admin/posts`);
} catch (error) {
  console.error("Lỗi khi cập nhật bài viết:", error);
  alert("Có lỗi xảy ra khi cập nhật bài viết!");
}

};

return ( <div className="container"> <h2 className="mb-4">✏️ Chỉnh sửa bài viết</h2> <form onSubmit={handleSubmit}> <div className="mb-3"> <label htmlFor="title" className="form-label fw-bold">Tiêu đề</label>
<input
type="text"
className="form-control"
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
      {preview && <img src={preview} alt="preview" style={{ width: "150px", marginTop: "10px" }} />}
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
      <label htmlFor="topicId" className="form-label fw-bold">Chủ đề</label>
      <input
        type="number"
        className="form-control"
        value={topicId}
        onChange={(e) => setTopicId(e.target.value)}
        required
      />
    </div>

    <button type="submit" className="btn btn-primary">Cập nhật bài viết</button>
  </form>
</div>

);
};

export default PostEdit;
