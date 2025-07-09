import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import "./Login.css";

const Login = () => {
  const [identifier, setIdentifier] = useState(""); // email or phone
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!identifier.trim()) {
      newErrors.identifier = "Email or phone is required";
    }
    if (!password.trim()) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.error || "Login failed" });
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
// eslint-disable-next-line
    } catch (error) {
      setErrors({ general: "⚠️ Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p className="subtitle">Log in to your MiMi Fua account</p>

        <form onSubmit={handleSubmit} noValidate>
          {errors.general && (
            <div className="error-message">{errors.general}</div>
          )}

          <div className={`input-group ${errors.identifier ? "error" : ""}`}>
            <FiMail className="input-icon" />
            <input
              type="text"
              placeholder="Email or Phone"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="username"
            />
            {errors.identifier && (
              <span className="error-message">{errors.identifier}</span>
            )}
          </div>

          <div className={`input-group ${errors.password ? "error" : ""}`}>
            <FiLock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <div className="auth-options">
            <label className="remember-me">
              <input type="checkbox" /> Remember me
            </label>
            <Link to="/forgot-password" className="forgot-password">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"} <FiArrowRight />
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <div className="social-logins">
          <button className="social-button google">
            <FcGoogle /> Continue with Google
          </button>
          <button className="social-button facebook">
            <FaFacebook color="#1877F2" /> Continue with Facebook
          </button>
        </div>

        <p className="auth-footer">
          Don&apos;t have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
