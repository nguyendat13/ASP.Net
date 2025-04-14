import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../../../Button/BackButton';

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [discount, setDiscount] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);
    const [image, setImage] = useState(null);

    // Load product & categories song song
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productRes, categoryRes] = await Promise.all([
                    axios.get(`https://localhost:7177/api/Product/${id}`),
                    axios.get(`https://localhost:7177/api/Category`)
                ]);

                const productData = productRes.data;
                setProduct(productData);
                setName(productData.name);
                setDescription(productData.description);
                setPrice(productData.price);
                setDiscount(productData.discount);
                setCategoryId(productData.categoryId); // rất quan trọng
                setCategories(categoryRes.data);
            } catch (error) {
                console.error('Lỗi khi tải dữ liệu', error);
                alert('Không thể tải sản phẩm hoặc danh mục!');
            }
        };
        fetchData();
    }, [id]);

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
            await axios.put(`https://localhost:7177/api/Product/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Sản phẩm đã được cập nhật!');
            navigate('/admin/products');
        } catch (error) {
            console.error('Lỗi cập nhật', error);
            alert('Có lỗi khi cập nhật sản phẩm!');
        }
    };

    if (!product || categories.length === 0) {
        return <div>Đang tải dữ liệu...</div>;
    }

    return (
        <div className="form-container">
            <h3>Chỉnh Sửa Sản Phẩm</h3>
            <form onSubmit={handleSubmit}>
                <input
                    className="form-input"
                    type="text"
                    placeholder="Tên Sản Phẩm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <textarea
                    className="form-input"
                    placeholder="Mô Tả"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <input
                    className="form-input"
                    type="number"
                    placeholder="Giá"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
                <input
                    className="form-input"
                    type="number"
                    placeholder="Giảm Giá"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    required
                />

                <select className='form-input' value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                    {categories.map((cat) => (
                        <option key={cat.categoryId} value={cat.categoryId}>
                            {cat.name}
                        </option>
                    ))}
                </select>


                <input className="form-input" type="file" onChange={handleImageChange} />
                <button className="form-submit-btn" type="submit">Cập Nhật Sản Phẩm</button>
            </form>
            <BackButton/>
        </div>
    );
};

export default EditProduct;
