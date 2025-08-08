import React from 'react';
import './InventoryStatus.css';

const InventoryStatus = ({ 
  inventoryData, 
  loading 
}) => {
  if (loading) {
    return <div className="inventory-loading">Loading inventory status...</div>;
  }

  if (!inventoryData || inventoryData.length === 0) {
    return (
      <div className="no-inventory-data">
        📊 No inventory data available
      </div>
    );
  }

  const getStockLevel = (quantity) => {
    if (quantity <= 10) return { level: 'low', emoji: '🔴', label: 'Low Stock' };
    if (quantity <= 50) return { level: 'medium', emoji: '🟡', label: 'Medium Stock' };
    return { level: 'high', emoji: '🟢', label: 'Good Stock' };
  };

  const getTotalItems = () => inventoryData.length;
  const getLowStockItems = () => inventoryData.filter(item => item.quantity <= 10).length;
  const getTotalQuantity = () => inventoryData.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="inventory-status-container">
      <h2 className="inventory-status-title">📊 Inventory Status</h2>
      
      {/* Summary Cards */}
      <div className="inventory-summary">
        <div className="summary-card">
          <div className="summary-value">{getTotalItems()}</div>
          <div className="summary-label">📦 Total Items</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">{getTotalQuantity()}</div>
          <div className="summary-label">📊 Total Quantity</div>
        </div>
        <div className="summary-card alert">
          <div className="summary-value">{getLowStockItems()}</div>
          <div className="summary-label">⚠️ Low Stock Items</div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="inventory-table-container">
        <table className="inventory-table">
          <thead className="inventory-table-header">
            <tr>
              <th className="inventory-header-cell">Item Name</th>
              <th className="inventory-header-cell">Quantity</th>
              <th className="inventory-header-cell">Stock Level</th>
              <th className="inventory-header-cell">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {inventoryData.map((item, index) => {
              const stockInfo = getStockLevel(item.quantity);
              return (
                <tr key={index} className="inventory-table-row">
                  <td className="inventory-table-cell item-name-cell">{item.item}</td>
                  <td className="inventory-table-cell quantity-cell">{item.quantity}</td>
                  <td className="inventory-table-cell">
                    <span className={`stock-level ${stockInfo.level}`}>
                      {stockInfo.emoji} {stockInfo.label}
                    </span>
                  </td>
                  <td className="inventory-table-cell date-cell">
                    {item.last_updated || 'N/A'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryStatus;
