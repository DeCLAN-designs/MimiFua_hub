import React, { useEffect, useState } from "react";
import "./EmployeeDashboard.css";

const MySales = () => {
  const [mySales, setMySales] = useState([]);

  useEffect(() => {
    // TODO: Fetch sales for the logged-in employee
    setMySales([
      { id: 1, item: "Airtime", amount: 100, date: "2025-07-09" },
      { id: 2, item: "Data", amount: 250, date: "2025-07-08" },
    ]);
  }, []);

  return (
    <div className="employee-sales-view">
      <h2>💰 My Sales</h2>
      <table className="sales-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Item</th>
            <th>Amount (KES)</th>
          </tr>
        </thead>
        <tbody>
          {mySales.map((sale) => (
            <tr key={sale.id}>
              <td>{sale.date}</td>
              <td>{sale.item}</td>
              <td>{sale.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MySales;
