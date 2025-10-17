import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../../Button/BackButton';

import { Editor } from '@tinymce/tinymce-react';

import API_BASE_URL from '../../../config';
const AddProduct = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [discount, setDiscount] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [image, setImage] = useState(null);
    const [categories, setCategories] = useState([]); // Lấy danh sách danh mục
    const [useCloudinary, setUseCloudinary] = useState(false);

    const navigate = useNavigate();
    const token = localStorage.getItem('jwt-token');

    useEffect(() => {
        // Fetch danh mục từ API
        axios.get(`${API_BASE_URL}/api/Category`)
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }, []);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

   const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('name', name);
  formData.append('description', description);
  formData.append('price', price);
  formData.append('discount', discount);
  formData.append('categoryId', categoryId);

  if (image) {
    formData.append('image', image);
  }

  try {
    // ✅ Gửi useCloudinary qua query param
    await axios.post(`${API_BASE_URL}/api/Product?useCloudinary=${useCloudinary}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    alert('Sản phẩm đã được thêm thành công!');
    navigate('/admin/products');
  } catch (error) {
    console.error('Error adding product', error);
    alert('Có lỗi xảy ra khi thêm sản phẩm!');
  }
};


    return (
        <div className="form-container">
            <h3>Thêm Sản Phẩm</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="form-input"
                    placeholder="Tên sản phẩm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
              {/* 🆕 TinyMCE Editor cho mô tả */}
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
                <input
                    type="number"
                    className="form-input"
                    placeholder="Giá"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
                <input
                    type="number"
                    className="form-input"
                    placeholder="Giảm giá"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    required
                />
                <select
                    className="form-input"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                                type="checkbox"
                                checked={useCloudinary}
                                onChange={(e) => setUseCloudinary(e.target.checked)}
                            />
                            Lưu ảnh lên Cloudinary
                            </label>

                <input
                    type="file"
                    className="form-input"
                    onChange={handleImageChange}
                />
                <button type="submit" className="form-submit-btn">
                    Thêm Sản Phẩm
                </button>
                <BackButton/>
            </form>
        </div>
    );
};

export default AddProduct;
