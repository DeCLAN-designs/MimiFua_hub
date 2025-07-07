/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiUser, FiLogIn, FiMoon, FiSun } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import "./NavBar.css";

const NavBar = ({ user }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <header
      className={`navbar ${isScrolled ? "navbar-scrolled" : ""} ${
        darkMode ? "dark" : ""
      }`}
    >
      <div className="navbar-container">
        <motion.div whileHover={{ scale: 1.05 }} className="navbar-logo">
          <Link to="/" onClick={handleLinkClick}>
            <img
              src={darkMode ? "/mmf-logo-dark.png" : "/mmf-logo.png"}
              alt="MiMi Fua Logo"
              className="logo-image"
            />
          </Link>
        </motion.div>

        <nav className="navbar-links">
          <Link to="/solutions">Solutions</Link>
          <Link to="/about-us">About Us</Link>
          <Link to="/blogs">Blogs</Link>
          <Link to="/opportunities">Opportunities</Link>
          <Link to="/contact-us">Contact Us</Link>
        </nav>

        <div className="navbar-right">
          <button
            className="dark-mode-toggle"
            onClick={() => setDarkMode(!darkMode)}
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>

          {user ? (
            <div className="user-menu">
              <button className="user-avatar">
                <img src={user.avatar} alt={user.name} />
              </button>
              <div className="user-dropdown">
                <Link to="/profile">Profile</Link>
                <Link to="/settings">Settings</Link>
                <button className="logout-button">Log Out</button>
              </div>
            </div>
          ) : (
            <div className="navbar-buttons">
              <button
                className="button-login"
                onClick={() => navigate("/login")}
              >
                <FiLogIn className="icon" /> Login
              </button>
              <button
                className="button-signup"
                onClick={() => navigate("/register")}
              >
                <FiUser className="icon" /> Sign Up
              </button>
            </div>
          )}
        </div>

        <button
          className="mobile-menu-button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="mobile-menu-overlay"
          >
            <nav className="mobile-menu">
              <Link to="/laundry" onClick={handleLinkClick}>
                Solutions
              </Link>
              <Link to="/about-us" onClick={handleLinkClick}>
                About Us
              </Link>
              <Link to="/blogs" onClick={handleLinkClick}>
                Blogs
              </Link>
              <Link to="/opportunities" onClick={handleLinkClick}>
                Opportunities
              </Link>
              <Link to="/contact-us" onClick={handleLinkClick}>
                Contact Us
              </Link>
              <div className="mobile-auth-section">
                <button
                  className="mobile-dark-mode-toggle"
                  onClick={() => setDarkMode(!darkMode)}
                >
                  {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
                </button>
                {user ? (
                  <>
                    <Link to="/profile">Profile</Link>
                    <button className="logout-button">Log Out</button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        navigate("/login");
                        handleLinkClick();
                      }}
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        navigate("/register");
                        handleLinkClick();
                      }}
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default NavBar;
