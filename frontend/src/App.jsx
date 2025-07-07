// Import necessary modules from React and React Router
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import layout components
import Navbar from "./Components/NavBar/NavBar";
import Footer from "./Components/Footer/Footer";
import PrivateRoute from "./Components/PrivateRoute/PrivateRoute"; // Make sure this is imported

// Import all page components
import HomePage from "./Pages/HomePage/HomePage";
import Solutions from "./Pages/Solutions/Solutions";
import AboutUs from "./Pages/AboutUs/AboutUs";
import Blogs from "./Pages/Blogs/Blogs";
import Opportunities from "./Pages/Opportunities/Opportunities";
import ContactUs from "./Pages/ContactUs/ContactUs";
import Login from "./Pages/Auth/Login/Login";
import SignUp from "./Pages/Auth/SignUp/SignUp";
import NotFound from "./Pages/NotFound/NotFound";
import Dashboard from "./Pages/Dashboard/Dashboard"; // Make sure this is imported

const App = () => {
  return (
    // Router wraps the entire app to enable routing
    <Router>
      {/* Navbar component appears on all pages */}
      <Navbar />

      {/* Main content of each route */}
      <main>
        <Routes>
          {/* Routes for each page */}
          <Route path="/" element={<HomePage />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignUp />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          // TODO
          <Route path="/forgot-password" element={<div>Forgot Password</div>} />
          <Route
            path="/reset-password/:token"
            element={<div>Reset Password</div>}
          />
          <Route
            path="/verify-email/:token"
            element={<div>Verify Email</div>}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Footer component appears on all pages */}
      <Footer />
    </Router>
  );
};

export default App;
