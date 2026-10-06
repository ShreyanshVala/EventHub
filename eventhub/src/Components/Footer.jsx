import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand */}
        <div className="footer-column footer-brand">
          <Link to="/" className="footer-logo">
            Event<span>Hub</span>
          </Link>

          <p>
            Discover amazing events, book your tickets and create unforgettable
            experiences with EventHub.
          </p>

          <div className="social-links">
            <a href="#" aria-label="Facebook">
              f
            </a>

            <a href="#" aria-label="Instagram">
              ◎
            </a>

            <a href="#" aria-label="Twitter">
              𝕏
            </a>

            <a href="#" aria-label="LinkedIn">
              in
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-column">
          <h3>Quick Links</h3>

          <Link to="/">Home</Link>
          <Link to="/events">Events</Link>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </div>

        {/* Event Categories */}
        <div className="footer-column">
          <h3>Categories</h3>

          <Link to="/events?category=Technology">Technology</Link>

          <Link to="/events?category=Music">Music</Link>

          <Link to="/events?category=Sports">Sports</Link>

          <Link to="/events?category=Business">Business</Link>
        </div>

        {/* Contact */}
        <div className="footer-column">
          <h3>Contact</h3>

          <p>📧 support@eventhub.com</p>
          <p>📞 +91 98765 43210</p>
          <p>📍 Ahmedabad, Gujarat, India</p>
        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} EventHub. All rights reserved.</p>

        <div>
          <span>Privacy Policy</span>
          <span>Terms & Conditions</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
