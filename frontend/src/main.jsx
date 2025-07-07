// Import core libraries
import React from "react";
import ReactDOM from "react-dom/client";

// Import the main App component and global CSS
import App from "./App";
import "./App.css";
import { BrowserRouter } from "react-router-dom";

// Create and render the root React application
ReactDOM.createRoot(document.getElementById("root")).render(
  
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
