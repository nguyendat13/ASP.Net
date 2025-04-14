import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Giognhau.css';
import { FaArrowLeft } from 'react-icons/fa';

const BackButton = () => {
  const navigate = useNavigate();

  return (
     <button className="back-btn" onClick={() => navigate(-1)}>
         <FaArrowLeft className="back-icon" />
         <span>Trở về</span>
       </button>
  );
};

export default BackButton;
