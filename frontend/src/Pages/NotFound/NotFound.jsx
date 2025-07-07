import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="error-graphic">
          <div className="error-number">4</div>
          <div className="error-icon">🧺</div>
          <div className="error-number">4</div>
        </div>

        <h1 className="error-title">Oops! Page Not Found</h1>

        <p className="error-message">
          The page you're looking for doesn't exist or has been moved.
          <br />
          Meanwhile, here's what you can do:
        </p>

        <div className="suggestions">
          <Link to="/" className="suggestion-card">
            <div className="suggestion-icon">🏠</div>
            <h3>Go to Homepage</h3>
            <p>Return to our main page</p>
          </Link>

          <Link to="/solutions" className="suggestion-card">
            <div className="suggestion-icon">🧼</div>
            <h3>Explore Solutions</h3>
            <p>Discover what we offer</p>
          </Link>

          <Link to="/contact-us" className="suggestion-card">
            <div className="suggestion-icon">📧</div>
            <h3>Contact Support</h3>
            <p>Get help from our team</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
