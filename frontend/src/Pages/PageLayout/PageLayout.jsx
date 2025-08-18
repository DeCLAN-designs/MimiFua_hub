import React from 'react';
import './PageLayout.css';

const PageLayout = ({ children, title, subtitle, className = '' }) => {
  return (
    <div className={`page-layout ${className}`}>
      <div className="page-header">
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      <div className="page-content">
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
