import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const adminEmail = "admin@eventhub.com";
    const adminPassword = "admin123";

    if (formData.email === adminEmail && formData.password === adminPassword) {
      localStorage.setItem(
        "eventHubAdmin",
        JSON.stringify({
          email: adminEmail,
          role: "admin",
        }),
      );

      navigate("/admin/dashboard");
    } else {
      setError("Invalid admin email or password.");
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-icon">🛡️</div>

        <div className="admin-login-header">
          <span>EVENTHUB ADMIN</span>
          <h1>Admin Login</h1>
          <p>Login to manage your events</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="admin-error">{error}</div>}

          <div className="admin-form-group">
            <label>Email Address</label>

            <input
              type="email"
              name="email"
              placeholder="admin@eventhub.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter admin password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="admin-login-btn">
            Login to Dashboard
          </button>
        </form>

        <div className="admin-login-footer">
          <p>EventHub Admin Panel</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
