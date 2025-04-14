import React from 'react';
import axios from 'axios';

const CategoryDelete = ({ id, onDeleted }) => {
  const handleDelete = async () => {
    if (window.confirm('Bạn có chắc muốn xóa danh mục này?')) {
      await axios.delete(`https://localhost:7177/api/Category/${id}`);
      alert('Xóa thành công');
      if (onDeleted) onDeleted();
    }
  };

  return <button onClick={handleDelete}>Xóa</button>;
};

export default CategoryDelete;
