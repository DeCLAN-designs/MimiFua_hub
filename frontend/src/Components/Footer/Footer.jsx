import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* Background Watermark */}
        <div className="footer-watermark">MiMi Fua</div>

        <div className="footer-grid">
          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/solutions">Solutions</a>
              </li>
              <li>
                <a href="/about-us">About Us</a>
              </li>
              <li>
                <a href="/blogs">Blogs</a>
              </li>
              <li>
                <a href="/opportunities">Opportunities</a>
              </li>
              <li>
                <a href="/contact-us">Contact</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h3 className="footer-heading">Contact Us</h3>
            <ul className="footer-contact">
              <li className="contact-item">
                <span className="contact-icon">📍</span>
                <span>123 Service Plaza, Nairobi, Kenya</span>
              </li>
              <li className="contact-item">
                <span className="contact-icon">📞</span>
                <span>+254 700 123456</span>
              </li>
              <li className="contact-item">
                <span className="contact-icon">📧</span>
                <span>info@mimifua.com</span>
              </li>
              <li className="contact-item">
                <span className="contact-icon">⏰</span>
                <span>Mon-Sun: 7:00 AM - 8:00 PM</span>
              </li>
            </ul>
          </div>

          {/* About Section */}
          <div className="footer-section">
            <h3 className="footer-heading">MiMi Fua</h3>
            <p className="footer-about">
              Revolutionizing urban convenience with our all-in-one service hub
              combining laundry, café, and essential services under one roof.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Facebook">
                <span>📘</span>
              </a>
              <a href="#" aria-label="Twitter">
                <span>🐦</span>
              </a>
              <a href="#" aria-label="Instagram">
                <span>📷</span>
              </a>
              <a href="#" aria-label="LinkedIn">
                <span>💼</span>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="copyright">
            &copy; {new Date().getFullYear()} MiMi Fua. All rights reserved.
          </div>
          <div className="legal-links">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/faq">FAQ</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
