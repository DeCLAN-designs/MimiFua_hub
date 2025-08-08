import React from 'react';
import './SalesAnalytics.css';

const SalesAnalytics = ({ 
  salesTrend, 
  topItems, 
  formatAmount, 
  showAnalytics, 
  onToggleAnalytics 
}) => {
  if (!showAnalytics) return null;

  return (
    <div className="analytics-section">
      <h4 className="analytics-title">Sales Analytics</h4>

      {/* Sales Trend Chart */}
      <div className="chart-container">
        <h5 className="chart-title">Sales Trend (Last 7 Days)</h5>
        <div className="trend-chart">
          {salesTrend.map((day, index) => (
            <div key={index} className="trend-bar">
              <div
                className="trend-bar-fill"
                style={{
                  height: `${Math.max((day.amount / Math.max(...salesTrend.map(d => d.amount))) * 100, 5)}%`
                }}
              ></div>
              <span className="trend-bar-label">{day.date}</span>
              <span className="trend-bar-value">{formatAmount(day.amount)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Items Chart */}
      <div className="chart-container">
        <h5 className="chart-title">Top Performing Items</h5>
        <div className="items-chart">
          {topItems.slice(0, 5).map((item, index) => (
            <div key={index} className="item-bar">
              <span className="item-name">{item.item}</span>
              <div className="item-bar-container">
                <div
                  className="item-bar-fill"
                  style={{
                    width: `${(item.count / Math.max(...topItems.map(i => i.count))) * 100}%`
                  }}
                ></div>
                <span className="item-count">{item.count} sales</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesAnalytics;
