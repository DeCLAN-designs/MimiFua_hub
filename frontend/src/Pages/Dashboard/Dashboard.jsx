import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return null;

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>MiMi Fua Hub</h2>
        <nav>
          <ul>
            <li>📊 Dashboard</li>
            {user.role === "manager" && (
              <>
                <li>👥 Manage Employees</li>
                <li>📈 View All Sales</li>
                <li>🧾 Reports</li>
              </>
            )}
            {user.role === "employee" && (
              <>
                <li>🛒 My Sales</li>
                <li>📦 Restock Inventory</li>
              </>
            )}
            <li onClick={handleLogout} className="logout-btn">
              🚪 Logout
            </li>
          </ul>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header>
          <h1>Welcome, {user.name}</h1>
          <p>Role: {user.role?.toUpperCase()}</p>
        </header>

        <section className="dashboard-content">
          {user.role === "manager" ? (
            <ManagerDashboard />
          ) : (
            <EmployeeDashboard />
          )}
        </section>
      </main>
    </div>
  );
};

const ManagerDashboard = () => (
  <div className="card-grid">
    <StatCard title="Total Sales" value="KES 456,000" />
    <StatCard title="Active Employees" value="14" />
    <StatCard title="Pending Reports" value="3" />
  </div>
);

const EmployeeDashboard = () => (
  <div className="card-grid">
    <StatCard title="My Sales Today" value="KES 12,400" />
    <StatCard title="Restock Requests" value="2" />
    <StatCard title="My Targets" value="KES 50,000" />
  </div>
);

const StatCard = ({ title, value }) => (
  <div className="stat-card">
    <h4>{title}</h4>
    <p>{value}</p>
  </div>
);

export default Dashboard;
