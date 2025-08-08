import React, { useState, useEffect } from 'react';
import {
  InventoryHeader,
  InventoryViewModeButtons,
  RestockRequests,
  InventoryStatus
} from './InventoryComponents';
import './Inventory.css';

const Inventory = () => {
  // State management
  const [restockData, setRestockData] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("requests");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch restock requests from API
  const fetchRestockData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in.');
        return;
      }

      const response = await fetch('http://localhost:5000/api/restocks/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRestockData(data.restocks || []);
    } catch (err) {
      console.error('Error fetching restock data:', err);
      setError('Failed to fetch restock data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch inventory status (mock data for now)
  const fetchInventoryData = async () => {
    try {
      // Enhanced mock inventory data - replace with actual API call when available
      const mockInventory = [
        { item: 'Coffee Beans', quantity: 45, last_updated: '2024-01-15', category: 'Beverages', supplier: 'Coffee Co.' },
        { item: 'Tea Leaves', quantity: 8, last_updated: '2024-01-14', category: 'Beverages', supplier: 'Tea Masters' },
        { item: 'Sugar', quantity: 120, last_updated: '2024-01-16', category: 'Sweeteners', supplier: 'Sweet Supply' },
        { item: 'Milk', quantity: 25, last_updated: '2024-01-15', category: 'Dairy', supplier: 'Fresh Dairy' },
        { item: 'Cups', quantity: 5, last_updated: '2024-01-13', category: 'Supplies', supplier: 'Cup World' },
        { item: 'Napkins', quantity: 200, last_updated: '2024-01-16', category: 'Supplies', supplier: 'Paper Plus' },
        { item: 'Straws', quantity: 15, last_updated: '2024-01-12', category: 'Supplies', supplier: 'Eco Straws' },
        { item: 'Chocolate Syrup', quantity: 3, last_updated: '2024-01-11', category: 'Syrups', supplier: 'Flavor Town' },
      ];
      setInventoryData(mockInventory);
    } catch (err) {
      console.error('Error fetching inventory data:', err);
    }
  };

  // Filter and sort restock data
  const getFilteredRestockData = () => {
    let filtered = restockData;

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter(request => request.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(request => 
        request.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${request.first_name} ${request.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort data
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'item':
          aValue = a.item.toLowerCase();
          bValue = b.item.toLowerCase();
          break;
        case 'employee':
          aValue = `${a.first_name} ${a.last_name}`.toLowerCase();
          bValue = `${b.first_name} ${b.last_name}`.toLowerCase();
          break;
        case 'quantity':
          aValue = parseInt(a.quantity);
          bValue = parseInt(b.quantity);
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default: // date
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  // Get paginated data
  const getPaginatedData = (data) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  // Get total pages
  const getTotalPages = (data) => {
    return Math.ceil(data.length / itemsPerPage);
  };

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, searchTerm, sortBy, sortOrder]);

  // Initialize data on component mount
  useEffect(() => {
    fetchRestockData();
    fetchInventoryData();
  }, []);

  // Handle approve restock request
  const handleApproveRequest = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/restocks/${requestId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Refresh data
        fetchRestockData();
      }
    } catch (err) {
      console.error('Error approving request:', err);
    }
  };

  // Handle reject restock request
  const handleRejectRequest = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/restocks/${requestId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Refresh data
        fetchRestockData();
      }
    } catch (err) {
      console.error('Error rejecting request:', err);
    }
  };

  // Export to CSV functionality
  const exportRestockToCSV = () => {
    const filteredData = getFilteredRestockData();
    const csvData = filteredData.map((request) => ({
      ID: request.id,
      Employee: `${request.first_name} ${request.last_name}`,
      Email: request.email,
      Item: request.item,
      Quantity: request.quantity,
      Status: request.status,
      Date: formatDate(request.created_at),
    }));

    const csvHeaders = Object.keys(csvData[0] || {});
    const csvRows = [
      csvHeaders.join(","),
      ...csvData.map((row) =>
        csvHeaders.map((header) => `"${row[header]}"`).join(",")
      ),
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `restock_requests_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Export inventory to CSV
  const exportInventoryToCSV = () => {
    const csvData = inventoryData.map((item) => ({
      Item: item.item,
      Quantity: item.quantity,
      Category: item.category,
      Supplier: item.supplier,
      'Last Updated': item.last_updated,
      'Stock Level': item.quantity <= 10 ? 'Low' : item.quantity <= 50 ? 'Medium' : 'High'
    }));

    const csvHeaders = Object.keys(csvData[0] || {});
    const csvRows = [
      csvHeaders.join(","),
      ...csvData.map((row) =>
        csvHeaders.map((header) => `"${row[header]}"`).join(",")
      ),
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `inventory_status_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Get inventory analytics
  const getInventoryAnalytics = () => {
    const totalItems = inventoryData.length;
    const lowStockItems = inventoryData.filter(item => item.quantity <= 10).length;
    const outOfStockItems = inventoryData.filter(item => item.quantity === 0).length;
    const totalQuantity = inventoryData.reduce((sum, item) => sum + item.quantity, 0);
    
    const categoryBreakdown = inventoryData.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});

    return {
      totalItems,
      lowStockItems,
      outOfStockItems,
      totalQuantity,
      categoryBreakdown
    };
  };

  // Get restock analytics
  const getRestockAnalytics = () => {
    const totalRequests = restockData.length;
    const pendingRequests = restockData.filter(req => req.status === 'pending').length;
    const approvedRequests = restockData.filter(req => req.status === 'approved').length;
    const rejectedRequests = restockData.filter(req => req.status === 'rejected').length;
    
    const mostRequestedItems = restockData.reduce((acc, req) => {
      acc[req.item] = (acc[req.item] || 0) + 1;
      return acc;
    }, {});

    const topRequestedItems = Object.entries(mostRequestedItems)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([item, count]) => ({ item, count }));

    return {
      totalRequests,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
      topRequestedItems
    };
  };

  // Utility functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && viewMode === "requests") {
    return <div className="inventory-container">Loading inventory data...</div>;
  }

  if (error) {
    return <div className="inventory-container">Error: {error}</div>;
  }

  // Get filtered and paginated data
  const filteredRestockData = getFilteredRestockData();
  const paginatedRestockData = getPaginatedData(filteredRestockData);
  const totalPages = getTotalPages(filteredRestockData);
  const restockAnalytics = getRestockAnalytics();
  const inventoryAnalytics = getInventoryAnalytics();

  return (
    <div className="inventory-container">
      <InventoryHeader onRefresh={fetchRestockData} loading={loading} />
      
      <InventoryViewModeButtons 
        viewMode={viewMode} 
        onViewModeChange={setViewMode} 
      />

      {/* Enhanced Filters and Controls */}
      {viewMode === "requests" && (
        <div className="inventory-controls">
          <div className="search-filter-section">
            <input
              type="text"
              placeholder="🔍 Search by item or employee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="status-filter"
            >
              <option value="all">All Status</option>
              <option value="pending">⏳ Pending</option>
              <option value="approved">✅ Approved</option>
              <option value="rejected">❌ Rejected</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="date">Sort by Date</option>
              <option value="item">Sort by Item</option>
              <option value="employee">Sort by Employee</option>
              <option value="quantity">Sort by Quantity</option>
              <option value="status">Sort by Status</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="sort-order-btn"
            >
              {sortOrder === 'asc' ? '⬆️ Ascending' : '⬇️ Descending'}
            </button>

            <button
              onClick={exportRestockToCSV}
              className="export-btn"
              disabled={filteredRestockData.length === 0}
            >
              📊 Export CSV
            </button>
          </div>

          {/* Analytics Summary */}
          <div className="analytics-summary">
            <div className="analytics-card">
              <span className="analytics-value">{restockAnalytics.totalRequests}</span>
              <span className="analytics-label">📋 Total Requests</span>
            </div>
            <div className="analytics-card pending">
              <span className="analytics-value">{restockAnalytics.pendingRequests}</span>
              <span className="analytics-label">⏳ Pending</span>
            </div>
            <div className="analytics-card approved">
              <span className="analytics-value">{restockAnalytics.approvedRequests}</span>
              <span className="analytics-label">✅ Approved</span>
            </div>
            <div className="analytics-card rejected">
              <span className="analytics-value">{restockAnalytics.rejectedRequests}</span>
              <span className="analytics-label">❌ Rejected</span>
            </div>
          </div>
        </div>
      )}

      {viewMode === "status" && (
        <div className="inventory-controls">
          <div className="inventory-actions">
            <button
              onClick={exportInventoryToCSV}
              className="export-btn"
              disabled={inventoryData.length === 0}
            >
              📊 Export Inventory CSV
            </button>
          </div>

          {/* Inventory Analytics Summary */}
          <div className="analytics-summary">
            <div className="analytics-card">
              <span className="analytics-value">{inventoryAnalytics.totalItems}</span>
              <span className="analytics-label">📦 Total Items</span>
            </div>
            <div className="analytics-card">
              <span className="analytics-value">{inventoryAnalytics.totalQuantity}</span>
              <span className="analytics-label">📊 Total Quantity</span>
            </div>
            <div className="analytics-card warning">
              <span className="analytics-value">{inventoryAnalytics.lowStockItems}</span>
              <span className="analytics-label">⚠️ Low Stock</span>
            </div>
            <div className="analytics-card danger">
              <span className="analytics-value">{inventoryAnalytics.outOfStockItems}</span>
              <span className="analytics-label">🚫 Out of Stock</span>
            </div>
          </div>
        </div>
      )}

      {viewMode === "requests" ? (
        <>
          <RestockRequests
            restockData={paginatedRestockData}
            formatDate={formatDate}
            onApproveRequest={handleApproveRequest}
            onRejectRequest={handleRejectRequest}
            loading={loading}
          />
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <div className="pagination-info">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredRestockData.length)} of {filteredRestockData.length} requests
              </div>
              <div className="pagination-controls">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  ← Previous
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + Math.max(1, currentPage - 2);
                  if (page <= totalPages) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                      >
                        {page}
                      </button>
                    );
                  }
                  return null;
                })}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Top Requested Items */}
          {restockAnalytics.topRequestedItems.length > 0 && (
            <div className="top-requested-section">
              <h3 className="section-title">🔥 Most Requested Items</h3>
              <div className="top-items-grid">
                {restockAnalytics.topRequestedItems.map((item, index) => (
                  <div key={index} className="top-item-card">
                    <span className="item-rank">#{index + 1}</span>
                    <span className="item-name">{item.item}</span>
                    <span className="item-requests">{item.count} requests</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <InventoryStatus
            inventoryData={inventoryData}
            loading={loading}
          />
          
          {/* Category Breakdown */}
          {Object.keys(inventoryAnalytics.categoryBreakdown).length > 0 && (
            <div className="category-breakdown-section">
              <h3 className="section-title">📊 Inventory by Category</h3>
              <div className="category-grid">
                {Object.entries(inventoryAnalytics.categoryBreakdown).map(([category, count]) => (
                  <div key={category} className="category-card">
                    <span className="category-name">{category}</span>
                    <span className="category-count">{count} items</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Inventory;
