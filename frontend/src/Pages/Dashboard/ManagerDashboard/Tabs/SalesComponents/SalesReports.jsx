import React from 'react';
import './SalesReports.css';
import SalesSummary from './SalesSummary';
import SalesAnalytics from './SalesAnalytics';
import ExportButtons from './ExportButtons';

const SalesReports = ({ 
  salesData,
  salesMetrics,
  selectedEmployee,
  formatAmount,
  onExportCSV,
  onExportPDF,
  showAnalytics,
  onToggleAnalytics,
  salesTrend,
  topItems,
  getEmployeeSalesReport
}) => {
  return (
    <div className="reports-container">
      <div className="reports-header">
        <h3 className="reports-title">📈 Sales Reports & Analytics</h3>
        <ExportButtons
          onExportCSV={onExportCSV}
          onExportPDF={onExportPDF}
          disabled={salesData.length === 0}
          showAnalyticsToggle={true}
          showAnalytics={showAnalytics}
          onToggleAnalytics={onToggleAnalytics}
        />
      </div>

      {/* Sales Summary Section with Emojis */}
      <SalesSummary
        salesData={salesData}
        salesMetrics={salesMetrics}
        selectedEmployee={selectedEmployee}
        formatAmount={formatAmount}
        title="📊 Sales Overview"
      />

      {/* Analytics Section in Reports */}
      <SalesAnalytics
        salesTrend={salesTrend}
        topItems={topItems}
        formatAmount={formatAmount}
        showAnalytics={showAnalytics}
        onToggleAnalytics={onToggleAnalytics}
      />

      {/* Employee Performance Cards */}
      <div className="employee-performance-section">
        <h4 className="section-title">Employee Sales Performance</h4>
        {getEmployeeSalesReport().length === 0 ? (
          <p className="no-data-message">No sales reports available.</p>
        ) : (
          <div className="reports-grid">
            {getEmployeeSalesReport().map((employee, index) => (
              <div key={index} className="employee-report-card">
                <div className="employee-report-header">
                  <h4 className="employee-report-name">{employee.name}</h4>
                  <span className="employee-report-email">
                    {employee.email}
                  </span>
                </div>
                <div className="employee-report-stats">
                  <div className="stat-item">
                    <span className="stat-label">Total Sales:</span>
                    <span className="stat-value">{employee.totalSales}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Total Revenue:</span>
                    <span className="stat-value revenue">
                      {formatAmount(employee.totalRevenue)}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Avg. Sale:</span>
                    <span className="stat-value">
                      {employee.totalSales > 0
                        ? formatAmount(
                            employee.totalRevenue / employee.totalSales
                          )
                        : formatAmount(0)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesReports;
