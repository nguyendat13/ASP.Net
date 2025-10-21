import React from 'react';

const LoadingSpinner = () => (
  <div className="loading-spinner d-flex justify-content-center align-items-center p-4">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

export default LoadingSpinner;