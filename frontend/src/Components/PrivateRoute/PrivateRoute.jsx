// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const isAuthenticated = () => {
  const token = localStorage.getItem("token");

  if (!token) return false;

  try {
    // Optional: Expiry validation with jwt-decode
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiry = payload.exp * 1000;
    if (Date.now() > expiry) {
      localStorage.removeItem("token");
      return false;
    }

    return true;

// eslint-disable-next-line 
  } catch (err) {
    // Invalid token structure
    return false;
  }
};

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
