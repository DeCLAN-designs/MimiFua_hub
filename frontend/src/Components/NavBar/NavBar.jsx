import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiUser,
  FiLogIn,
  FiMoon,
  FiSun,
  FiChevronDown,
  FiLogOut,
  FiSettings,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import "./NavBar.css";

const NavBar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navRef = useRef(null);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10;
      if (scrolled !== isScrolled) {
        setIsScrolled(scrolled);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isScrolled]);

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("theme", newDarkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newDarkMode);
  }, [darkMode]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { to: "/solutions", label: "Solutions" },
    { to: "/about-us", label: "About Us" },
    { to: "/blogs", label: "Blogs" },
    { to: "/opportunities", label: "Opportunities" },
    { to: "/contact-us", label: "Contact Us" },
  ];

  const userMenuItems = [
    { to: "/profile", label: "Profile", icon: <FiUser /> },
    { to: "/settings", label: "Settings", icon: <FiSettings /> },
    { label: "Logout", icon: <FiLogOut />, onClick: onLogout },
  ];

  return (
    <header
      ref={navRef}
      className={`navbar ${isScrolled ? "navbar-scrolled" : ""} ${
        darkMode ? "dark" : ""
      }`}
      role="banner"
    >
      <div className="navbar-container">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="navbar-logo"
          aria-label="Home"
        >
          <Link to="/" className="logo-link">
            <img
              src={darkMode ? "/mmf-logo-dark.png" : "/mmf-logo.png"}
              alt="MiMi Fua Logo"
              className="logo-image"
              width="160"
              height="42"
            />
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="navbar-links" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${
                location.pathname === link.to ? "active" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="navbar-right">
          {/* Dark Mode Toggle */}
          <button
            className="dark-mode-toggle"
            onClick={toggleDarkMode}
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>

          {/* User Menu / Auth Buttons */}
          {user ? (
            <div className="user-menu-container">
              <button
                className="user-menu-button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                aria-expanded={isUserMenuOpen}
                aria-haspopup="true"
                aria-label="User menu"
              >
                <div className="user-avatar">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name || "User"}
                      width="32"
                      height="32"
                    />
                  ) : (
                    <FiUser size={20} />
                  )}
                </div>
                <span className="user-name">{user.name || "Account"}</span>
                <FiChevronDown
                  className={`dropdown-chevron ${isUserMenuOpen ? "open" : ""}`}
                />
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    className="user-dropdown"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {userMenuItems.map((item) =>
                      item.to ? (
                        <Link
                          key={item.label}
                          to={item.to}
                          className="dropdown-item"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </Link>
                      ) : (
                        <button
                          key={item.label}
                          className="dropdown-item"
                          onClick={() => {
                            item.onClick?.();
                            setIsUserMenuOpen(false);
                          }}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </button>
                      )
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="auth-buttons">
              <button
                className="button button-login"
                onClick={() => navigate("/login")}
                aria-label="Log in"
              >
                <FiLogIn className="icon" />
                <span>Login</span>
              </button>
              <button
                className="button button-signup"
                onClick={() => navigate("/register")}
                aria-label="Sign up"
              >
                <FiUser className="icon" />
                <span>Sign Up</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="mobile-menu-overlay"
          >
            <nav className="mobile-menu">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`mobile-nav-link ${
                    location.pathname === link.to ? "active" : ""
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="mobile-auth-section">
                <button
                  className="mobile-dark-mode-toggle"
                  onClick={toggleDarkMode}
                >
                  {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
                </button>
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      className="logout-button"
                      onClick={() => {
                        onLogout?.();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        navigate("/login");
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        navigate("/register");
                        setIsMobileMenuOpen(false);
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
