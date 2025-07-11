import React, { useEffect, useState } from "react";
import "./EmployeeDashboard.css";

const MySales = () => {
  const [groupedSales, setGroupedSales] = useState({});

  useEffect(() => {
    // TODO: Replace with real backend call (GET /api/sales?userId=...)
    const sales = [
      { id: 1, item: "Airtime", amount: 100, date: "2025-07-09" }, // Today
      { id: 2, item: "Data", amount: 250, date: "2025-07-08" }, // Yesterday
      { id: 3, item: "Bundle", amount: 150, date: "2025-07-07" }, // This Week
      { id: 4, item: "Sim Card", amount: 200, date: "2025-07-03" }, // Older
      { id: 5, item: "SMS Pack", amount: 80, date: "2025-06-15" }, // June
      { id: 6, item: "Minutes", amount: 300, date: "2025-05-22" }, // May
    ];

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday

    const grouped = {
      "📅 Today": [],
      "📆 Yesterday": [],
      "📊 This Week": [],
      "📦 Older": [],
    };

    sales.forEach((sale) => {
      const saleDate = new Date(sale.date);

      if (sale.date === todayStr) {
        grouped["📅 Today"].push(sale);
      } else if (sale.date === yesterdayStr) {
        grouped["📆 Yesterday"].push(sale);
      } else if (saleDate >= startOfWeek && saleDate < new Date(todayStr)) {
        grouped["📊 This Week"].push(sale);
      } else if (
        saleDate.getMonth() === now.getMonth() &&
        saleDate.getFullYear() === now.getFullYear()
      ) {
        grouped["📦 Older"].push(sale);
      } else {
        const monthYear = saleDate.toLocaleString("default", {
          month: "long",
          year: "numeric",
        });

        if (!grouped[monthYear]) grouped[monthYear] = [];
        grouped[monthYear].push(sale);
      }
    });

    setGroupedSales(grouped);
  }, []);

  return (
    <div className="employee-sales-view">
      <h2 className="sales-title">💰 My Sales</h2>
      {Object.entries(groupedSales).map(([section, sales]) => (
        <div key={section} className="sales-section">
          <h3 className="section-header">{section}</h3>
          <table className="sales-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Item</th>
                <th>Amount (KES)</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.id}>
                  <td>{sale.date}</td>
                  <td>{sale.item}</td>
                  <td>{sale.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default MySales;
