import React, { useEffect, useState } from "react";
import "./ManagerDashboard.css"

const AllSales = () => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    // TODO: Fetch all sales from backend
    setSales([
      {
        id: 1,
        employee: "Jane",
        item: "Airtime",
        amount: 100,
        date: "2025-07-09",
      },
      {
        id: 2,
        employee: "John",
        item: "Data",
        amount: 200,
        date: "2025-07-08",
      },
    ]);
  }, []);

  return (
    <div className="all-sales-view">
      <h2>📈 All Sales</h2>
      <table className="manager-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Employee</th>
            <th>Item</th>
            <th>Amount (KES)</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((s) => (
            <tr key={s.id}>
              <td>{s.date}</td>
              <td>{s.employee}</td>
              <td>{s.item}</td>
              <td>{s.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllSales;
