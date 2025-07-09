// src/Pages/Auth/SignUp.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import "./SignUp.css";

const SignUp = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "employee",
    termsAccepted: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!form.email && !form.phone)
      newErrors.email = "Email or phone number is required";
    if (form.email && !/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Invalid email format";
    if (form.phone && !/^\d{10,15}$/.test(form.phone))
      newErrors.phone = "Invalid phone number";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 8)
      newErrors.password = "Minimum 8 characters required";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!form.termsAccepted)
      newErrors.termsAccepted = "Accept terms to continue";
    return Object.keys(newErrors).length ? (setErrors(newErrors), false) : true;
  };

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleCheckbox = (e) =>
    setForm((prev) => ({ ...prev, termsAccepted: e.target.checked }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: form.firstName,
          last_name: form.lastName,
          email: form.email,
          phone: form.phone,
          password: form.password,
          role: form.role,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setErrors({ general: data.error || "Registration failed" });
        return;
      }

      navigate("/login");
// eslint-disable-next-line
    } catch (err) {
      setErrors({ general: "Server error. Try again later." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="subtitle">Join MiMi Fua today</p>

        <form onSubmit={handleSubmit}>
          {errors.general && (
            <div className="error-message">{errors.general}</div>
          )}

          <div className={`input-group ${errors.firstName ? "error" : ""}`}>
            <FiUser className="input-icon" />
            <input
              type="text"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange("firstName")}
            />
            {errors.firstName && (
              <span className="error-message">{errors.firstName}</span>
            )}
          </div>

          <div className={`input-group ${errors.lastName ? "error" : ""}`}>
            <FiUser className="input-icon" />
            <input
              type="text"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange("lastName")}
            />
            {errors.lastName && (
              <span className="error-message">{errors.lastName}</span>
            )}
          </div>

          <div className={`input-group ${errors.email ? "error" : ""}`}>
            <FiMail className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange("email")}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className={`input-group ${errors.phone ? "error" : ""}`}>
            <FiPhone className="input-icon" />
            <input
              type="tel"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange("phone")}
            />
            {errors.phone && (
              <span className="error-message">{errors.phone}</span>
            )}
          </div>

          <div className={`input-group ${errors.password ? "error" : ""}`}>
            <FiLock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={handleChange("password")}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((p) => !p)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <div
            className={`input-group ${errors.confirmPassword ? "error" : ""}`}
          >
            <FiLock className="input-icon" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange("confirmPassword")}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword((p) => !p)}
              aria-label="Toggle confirm password visibility"
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </button>
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="role">Select Role</label>
            <select id="role" value={form.role} onChange={handleChange("role")}>
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          <div className={`terms ${errors.termsAccepted ? "error" : ""}`}>
            <input
              type="checkbox"
              id="terms"
              checked={form.termsAccepted}
              onChange={handleCheckbox}
            />
            <label htmlFor="terms">
              I agree to the <Link to="/terms">Terms</Link> and{" "}
              <Link to="/privacy">Privacy Policy</Link>
            </label>
            {errors.termsAccepted && (
              <span className="error-message">{errors.termsAccepted}</span>
            )}
          </div>

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Sign Up"} <FiArrowRight />
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <div className="social-logins">
          <button type="button" className="social-button google">
            <FcGoogle /> Continue with Google
          </button>
          <button type="button" className="social-button facebook">
            <FaFacebook color="#1877F2" /> Continue with Facebook
          </button>
        </div>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
