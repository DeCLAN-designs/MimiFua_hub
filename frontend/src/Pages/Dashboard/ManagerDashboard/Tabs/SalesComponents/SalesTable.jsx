import React from 'react';
import './SalesTable.css';

const SalesTable = ({ 
  salesData, 
  formatAmount, 
  formatDate,
  currentPage,
  itemsPerPage,
  onPageChange,
  getTotalPages 
}) => {
  const getPaginatedSalesData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return salesData.slice(startIndex, endIndex);
  };

  if (salesData.length === 0) {
    return (
      <p className="no-data-message">
        No sales data available.
      </p>
    );
  }

  return (
    <div className="table-container">
      <table className="sales-table">
        <thead className="table-header">
          <tr>
            <th className="table-header-cell">ID</th>
            <th className="table-header-cell">Employee</th>
            <th className="table-header-cell">Email</th>
            <th className="table-header-cell">Item</th>
            <th className="table-header-cell">Amount</th>
            <th className="table-header-cell">Date</th>
          </tr>
        </thead>
        <tbody>
          {getPaginatedSalesData().map((sale) => (
            <tr key={sale.id} className="table-row">
              <td className="table-cell">{sale.id}</td>
              <td className="table-cell">
                {sale.first_name} {sale.last_name}
              </td>
              <td className="table-cell">{sale.email}</td>
              <td className="table-cell">{sale.item}</td>
              <td className="table-cell amount-cell">
                {formatAmount(sale.amount)}
              </td>
              <td className="table-cell date-cell">
                {formatDate(sale.date)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {getTotalPages() > 1 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, salesData.length)} of {salesData.length} sales
          </div>
          <div className="pagination-controls">
            <button 
              className="pagination-btn"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            
            {Array.from({ length: getTotalPages() }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            ))}
            
            <button 
              className="pagination-btn"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === getTotalPages()}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesTable;
