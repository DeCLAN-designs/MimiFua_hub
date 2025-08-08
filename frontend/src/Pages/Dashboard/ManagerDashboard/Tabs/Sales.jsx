import React, { useState, useEffect } from 'react';
import {
  SalesHeader,
  ViewModeButtons,
  SalesFilters,
  SalesSummary,
  SalesTable,
  SalesReports
} from './SalesComponents';
import './Sales.css';

const Sales = () => {
  // State management
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [viewMode, setViewMode] = useState("all");
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [salesMetrics, setSalesMetrics] = useState({});
  const [topItems, setTopItems] = useState([]);
  const [salesTrend, setSalesTrend] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch sales data from API
  const fetchSalesData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in.');
        return;
      }

      const response = await fetch('http://localhost:5000/api/sales/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSales(data.sales || []);
      
      // Extract unique employees
      const uniqueEmployees = data.sales?.reduce((acc, sale) => {
        const employeeKey = `${sale.first_name}_${sale.last_name}`;
        if (!acc.some(emp => `${emp.first_name}_${emp.last_name}` === employeeKey)) {
          acc.push({
            first_name: sale.first_name,
            last_name: sale.last_name,
            email: sale.email
          });
        }
        return acc;
      }, []) || [];
      
      setEmployees(uniqueEmployees);
    } catch (err) {
      console.error('Error fetching sales data:', err);
      setError('Failed to fetch sales data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter sales data based on selected criteria
  useEffect(() => {
    let filtered = sales;

    if (selectedEmployee) {
      filtered = filtered.filter(sale => 
        `${sale.first_name} ${sale.last_name}` === selectedEmployee
      );
    }

    if (startDate) {
      filtered = filtered.filter(sale => 
        new Date(sale.date) >= new Date(startDate)
      );
    }

    if (endDate) {
      filtered = filtered.filter(sale => 
        new Date(sale.date) <= new Date(endDate)
      );
    }

    setFilteredSales(filtered);
  }, [sales, selectedEmployee, startDate, endDate]);

  // Calculate metrics whenever filtered data changes
  useEffect(() => {
    if (filteredSales.length >= 0) {
      calculateSalesMetrics();
    }
  }, [filteredSales]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedEmployee, startDate, endDate]);

  // Initialize data on component mount
  useEffect(() => {
    fetchSalesData();
  }, []);

  // Calculate advanced sales metrics
  const calculateSalesMetrics = () => {
    const currentSales = filteredSales;
    const totalRevenue = currentSales.reduce((sum, sale) => sum + parseFloat(sale.amount), 0);
    const averageSale = currentSales.length > 0 ? totalRevenue / currentSales.length : 0;

    // Calculate growth rate (comparing to previous 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const previousSales = sales.filter(sale => {
      const saleDate = new Date(sale.date);
      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
      return saleDate >= sixtyDaysAgo && saleDate < thirtyDaysAgo;
    });

    const previousRevenue = previousSales.reduce((sum, sale) => sum + parseFloat(sale.amount), 0);
    const growthRate = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;

    setSalesMetrics({
      totalRevenue,
      averageSale,
      growthRate
    });

    // Calculate top items
    const itemCounts = currentSales.reduce((acc, sale) => {
      acc[sale.item] = (acc[sale.item] || 0) + 1;
      return acc;
    }, {});

    const topItemsArray = Object.entries(itemCounts)
      .map(([item, count]) => ({ item, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    setTopItems(topItemsArray);

    // Calculate sales trend (last 7 days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const daysSales = currentSales.filter(sale => 
        sale.date.split('T')[0] === dateStr
      );
      
      const dayAmount = daysSales.reduce((sum, sale) => sum + parseFloat(sale.amount), 0);
      
      last7Days.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        amount: dayAmount
      });
    }

    setSalesTrend(last7Days);
  };

  // Utility functions
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount).replace('KES', 'KSh');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter handlers
  const handleEmployeeFilter = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleDateFilter = (type, value) => {
    if (type === "start") {
      setStartDate(value);
    } else if (type === "end") {
      setEndDate(value);
    }
  };

  const applyDatePreset = (preset) => {
    const today = new Date();
    let start, end;

    switch (preset) {
      case "today":
        start = end = today.toISOString().split('T')[0];
        break;
      case "thisWeek":
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        start = startOfWeek.toISOString().split('T')[0];
        end = new Date().toISOString().split('T')[0];
        break;
      case "thisMonth":
        start = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        end = new Date().toISOString().split('T')[0];
        break;
      case "last30Days":
        start = new Date(today.setDate(today.getDate() - 30)).toISOString().split('T')[0];
        end = new Date().toISOString().split('T')[0];
        break;
      default:
        return;
    }

    setStartDate(start);
    setEndDate(end);
  };

  const clearAllFilters = () => {
    setSelectedEmployee("");
    setStartDate("");
    setEndDate("");
  };

  // Pagination functions
  const getTotalPages = () => {
    return Math.ceil(filteredSales.length / itemsPerPage);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Export functions
  const exportToCSV = () => {
    const csvData = filteredSales.map((sale) => ({
      ID: sale.id,
      Employee: `${sale.first_name} ${sale.last_name}`,
      Email: sale.email,
      Item: sale.item,
      Amount: sale.amount,
      Date: formatDate(sale.date),
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
      link.setAttribute("download", `sales_report_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const exportToPDF = () => {
    const printWindow = window.open('', '_blank');
    const salesData = filteredSales;
    const reportDate = new Date().toLocaleDateString();
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Sales Report - ${reportDate}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #48AECC; padding-bottom: 15px; }
            .header h1 { color: #00370F; margin: 0; }
            .header p { color: #666; margin: 5px 0; }
            .summary { display: flex; justify-content: space-around; margin: 20px 0; background: #f8fffe; padding: 15px; border-radius: 8px; }
            .summary-item { text-align: center; }
            .summary-value { font-size: 18px; font-weight: bold; color: #00370F; }
            .summary-label { font-size: 12px; color: #666; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #48AECC; color: white; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .amount { text-align: right; font-weight: bold; color: #00370F; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Sales Report</h1>
            <p>Generated on ${reportDate}</p>
            <p>Total Records: ${salesData.length}</p>
          </div>
          
          <div class="summary">
            <div class="summary-item">
              <div class="summary-value">${salesData.length}</div>
              <div class="summary-label">Total Sales</div>
            </div>
            <div class="summary-item">
              <div class="summary-value">${formatAmount(salesData.reduce((sum, sale) => sum + parseFloat(sale.amount), 0))}</div>
              <div class="summary-label">Total Revenue</div>
            </div>
            <div class="summary-item">
              <div class="summary-value">${formatAmount(salesData.length > 0 ? salesData.reduce((sum, sale) => sum + parseFloat(sale.amount), 0) / salesData.length : 0)}</div>
              <div class="summary-label">Average Sale</div>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee</th>
                <th>Email</th>
                <th>Item</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${salesData.map(sale => `
                <tr>
                  <td>${sale.id}</td>
                  <td>${sale.first_name} ${sale.last_name}</td>
                  <td>${sale.email}</td>
                  <td>${sale.item}</td>
                  <td class="amount">${formatAmount(sale.amount)}</td>
                  <td>${formatDate(sale.date)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            <p>Sales Report - MimiFua Hub Management System</p>
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  // Get employee sales summary for reports view
  const getEmployeeSalesReport = () => {
    const report = employees
      .map(employee => {
        const employeeSales = filteredSales.filter(sale => 
          `${sale.first_name} ${sale.last_name}` === `${employee.first_name} ${employee.last_name}`
        );
        
        const totalRevenue = employeeSales.reduce((sum, sale) => sum + parseFloat(sale.amount), 0);
        
        return {
          name: `${employee.first_name} ${employee.last_name}`,
          email: employee.email,
          totalSales: employeeSales.length,
          totalRevenue: totalRevenue
        };
      })
      .filter(employee => employee.totalSales > 0)
      .sort((a, b) => b.totalRevenue - a.totalRevenue);
    
    return report;
  };

  if (loading) {
    return <div className="sales-container">Loading sales data...</div>;
  }

  if (error) {
    return <div className="sales-container">Error: {error}</div>;
  }

  return (
    <div className="sales-container">
      <SalesHeader onRefresh={fetchSalesData} loading={loading} />
      
      <ViewModeButtons 
        viewMode={viewMode} 
        onViewModeChange={setViewMode} 
      />

      <SalesFilters
        employees={employees}
        selectedEmployee={selectedEmployee}
        onEmployeeFilter={handleEmployeeFilter}
        startDate={startDate}
        endDate={endDate}
        onDateFilter={handleDateFilter}
        onApplyDatePreset={applyDatePreset}
        onClearFilters={clearAllFilters}
      />

      <SalesSummary
        salesData={filteredSales}
        salesMetrics={salesMetrics}
        selectedEmployee={selectedEmployee}
        formatAmount={formatAmount}
      />

      {viewMode === "all" ? (
        <SalesTable
          salesData={filteredSales}
          formatAmount={formatAmount}
          formatDate={formatDate}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          getTotalPages={getTotalPages}
        />
      ) : (
        <SalesReports
          salesData={filteredSales}
          salesMetrics={salesMetrics}
          selectedEmployee={selectedEmployee}
          formatAmount={formatAmount}
          onExportCSV={exportToCSV}
          onExportPDF={exportToPDF}
          showAnalytics={showAnalytics}
          onToggleAnalytics={() => setShowAnalytics(!showAnalytics)}
          salesTrend={salesTrend}
          topItems={topItems}
          getEmployeeSalesReport={getEmployeeSalesReport}
        />
      )}
    </div>
  );
};

export default Sales;
