import React from "react";
import "./SalesTable.css";

const SalesTable = ({
  salesData,
  formatAmount,
  formatDate,
  currentPage,
  itemsPerPage,
  onPageChange,
  getTotalPages,
}) => {
  const getPaginatedSalesData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return salesData.slice(startIndex, endIndex);
  };

  if (salesData.length === 0) {
    return (
      <div className="no-data-container">
        <div className="no-data-icon">📊</div>
        <p className="no-data-message">
          No sales data available for the selected filters.
        </p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <div className="table-responsive">
        <table className="sales-table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">ID</th>
              <th className="table-header-cell">Employee</th>
              <th className="table-header-cell">Email</th>
              <th className="table-header-cell">Item</th>
              <th className="table-header-cell">Quantity</th>
              <th className="table-header-cell">Unit</th>
              <th className="table-header-cell">Amount</th>
              <th className="table-header-cell">Date</th>
            </tr>
          </thead>
          <tbody>
            {getPaginatedSalesData().map((sale) => (
              <tr key={sale.id} className="table-row">
                <td className="table-cell id-cell">{sale.id}</td>
                <td className="table-cell employee-cell">
                  {sale.first_name} {sale.last_name}
                </td>
                <td className="table-cell email-cell">{sale.email}</td>
                <td className="table-cell item-cell">{sale.item}</td>
                <td className="table-cell quantity-cell">
                  {sale.quantity || "N/A"}
                </td>
                <td className="table-cell unit-cell">
                  {sale.unit_name || "N/A"}
                </td>
                <td className="table-cell amount-cell">
                  {formatAmount(sale.amount)}
                </td>
                <td className="table-cell date-cell">
                  {formatDate(sale.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {getTotalPages() > 1 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, salesData.length)} of{" "}
            {salesData.length} entries
          </div>
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &laquo; Previous
            </button>

            {Array.from({ length: getTotalPages() }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  className={`pagination-btn ${
                    currentPage === page ? "active" : ""
                  }`}
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </button>
              )
            )}

            <button
              className="pagination-btn"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === getTotalPages()}
            >
              Next &raquo;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesTable;
