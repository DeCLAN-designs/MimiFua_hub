import React from 'react';
import './SalesSummary.css';

const SalesSummary = ({ 
  salesData, 
  salesMetrics, 
  selectedEmployee, 
  formatAmount,
  title = "📊 Sales Summary" 
}) => {
  return (
    <div className="summary-section">
      <h4 className="summary-title">{title}</h4>
      <div className="metrics-grid">
        <div className="metric-card">
          <span className="metric-label">🛒 Total Sales</span>
          <span className="metric-value">{salesData.length}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">💰 Total Revenue</span>
          <span className="metric-value">
            {formatAmount(salesMetrics.totalRevenue || 0)}
          </span>
        </div>
        <div className="metric-card">
          <span className="metric-value">
            <span className="metric-label">📈 Average Sale</span>
            {formatAmount(salesMetrics.averageSale || 0)}
          </span>
        </div>
        <div className="metric-card">
          <span className="metric-label">📊 Growth Rate</span>
          <span
            className={`metric-value ${
              salesMetrics.growthRate >= 0 ? "positive" : "negative"
            }`}
          >
            {salesMetrics.growthRate
              ? `${salesMetrics.growthRate.toFixed(1)}%`
              : "0%"}
          </span>
        </div>
      </div>
      {selectedEmployee && (
        <p className="summary-item">
          <span className="summary-label">👤 Showing sales for:</span>{" "}
          {selectedEmployee}
        </p>
      )}
    </div>
  );
};

export default SalesSummary;
