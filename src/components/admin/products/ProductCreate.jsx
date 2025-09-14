import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../../Button/BackButton';
import API_BASE_URL from '../../../../config';
const AddProduct = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [discount, setDiscount] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [image, setImage] = useState(null);
    const [categories, setCategories] = useState([]); // Lấy danh sách danh mục
    const navigate = useNavigate();

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
            await axios.post(`${API_BASE_URL}/Product`, formData, {
                headers: {
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
                <textarea
                    className="form-input"
                    placeholder="Mô tả"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
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
