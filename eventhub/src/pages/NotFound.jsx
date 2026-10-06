import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-card">
        {/* 404 */}
        <div className="not-found-number">404</div>

        {/* Icon */}
        <div className="not-found-icon">🎫</div>

        {/* Content */}
        <span className="not-found-label">PAGE NOT FOUND</span>

        <h1>Oops! This page doesn't exist.</h1>

        <p>
          The page you're looking for may have been moved, deleted, or the URL
          may be incorrect.
        </p>

        {/* Buttons */}
        <div className="not-found-actions">
          <Link to="/" className="home-btn">
            ← Back to Home
          </Link>

          <Link to="/events" className="events-btn">
            Explore Events
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
