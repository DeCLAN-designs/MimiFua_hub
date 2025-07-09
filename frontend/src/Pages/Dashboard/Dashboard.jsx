import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";
import Manager from "./Manager";
import Employee from "./Employee";
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
      <Sidebar user={user} onLogout={handleLogout} />
      <main className="dashboard-main">
        <DashboardHeader
  name={user.first_name || user.name}
  role={user.role}
  
/>
        <section className="dashboard-content">
          {user.role === "manager" ? <Manager /> : <Employee />}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
