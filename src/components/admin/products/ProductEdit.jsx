import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../../../Button/BackButton';
import API_BASE_URL from '../../../config';
import { Editor } from '@tinymce/tinymce-react';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [useCloudinary, setUseCloudinary] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, categoryRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/Product/${id}`),
          axios.get(`${API_BASE_URL}/api/Category`)
        ]);

        const product = productRes.data;
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price);
        setDiscount(product.discount);
        setCategoryId(product.categoryId);
        setPreview(getImageUrl(product.avatar));
        setCategories(categoryRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu', err);
        alert('Không thể tải dữ liệu sản phẩm hoặc danh mục!');
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const getImageUrl = (avatarPath) => {
    if (!avatarPath) return null;
    const filename = avatarPath.split('/').pop();
    return `${API_BASE_URL}/api/Product/image/${filename}`;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('discount', discount);
    formData.append('categoryId', categoryId);
    if (image) formData.append('image', image);

    try {
      await axios.put(`${API_BASE_URL}/api/Product/${id}?useCloudinary=${useCloudinary}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('✅ Sản phẩm đã được cập nhật thành công!');
      navigate('/admin/products');
    } catch (err) {
      console.error('Lỗi khi cập nhật', err);
      alert('❌ Cập nhật sản phẩm thất bại!');
    }
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;

  return (
    <div className="container mt-4">
      <h2>Chỉnh sửa sản phẩm</h2>
              <BackButton />

      <form onSubmit={handleSubmit} className="mt-3">

        <div className="mb-3">
          <label className="form-label">Tên sản phẩm</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

       {/* 🆕 TinyMCE Editor cho mô tả (giống CreateProduct) */}
<label style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>
  Mô tả sản phẩm
</label>
<Editor
  apiKey="3os1l1w4sbm08aeobf8xh3yyavjus283isn3sizk9tmkbiqd"
  value={description}
  onEditorChange={(content) => setDescription(content)}
  init={{
    height: 400,
    menubar: true,
    plugins: [
      'advlist autolink lists link image charmap preview anchor',
      'searchreplace visualblocks code fullscreen',
      'insertdatetime media table help wordcount',
    ],
    toolbar:
      'undo redo | styles | bold italic underline | alignleft aligncenter alignright alignjustify | ' +
      'bullist numlist outdent indent | fontfamily fontsize forecolor backcolor | ' +
      'table image link | removeformat | help',
    font_family_formats:
      'Arial=arial,helvetica,sans-serif; Courier New=courier new,courier,monospace; Times New Roman=times new roman,times;',
    fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt',
    content_style:
      'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
  }}
/>
<br />


        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Giá (đ)</label>
            <input
              type="number"
              className="form-control"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Giảm giá (%)</label>
            <input
              type="number"
              className="form-control"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Danh mục</label>
          <select
            className="form-select"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            checked={useCloudinary}
            onChange={(e) => setUseCloudinary(e.target.checked)}
            id="cloudinaryCheck"
          />
          <label className="form-check-label" htmlFor="cloudinaryCheck">
            Lưu ảnh lên Cloudinary
          </label>
        </div>

        <div className="mb-3">
          <label className="form-label">Ảnh sản phẩm</label>
          <input type="file" className="form-control" onChange={handleImageChange} />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-2"
              width="120"
              style={{ borderRadius: '8px', objectFit: 'cover' }}
            />
          )}
        </div>

        <button type="submit" className="btn btn-primary">
          Cập nhật sản phẩm
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
