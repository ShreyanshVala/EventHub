import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Check whether current page is Admin page
  const isAdminPage = location.pathname.startsWith("/admin");

  // Check logged-in user/admin
  useEffect(() => {
    const checkLoggedInUser = () => {
      if (isAdminPage) {
        // ADMIN LOGIN
        const savedAdmin = localStorage.getItem("eventHubAdmin");

        if (savedAdmin) {
          try {
            setLoggedInUser(JSON.parse(savedAdmin));
          } catch (error) {
            console.error("Invalid admin login data:", error);

            setLoggedInUser(null);
          }
        } else {
          setLoggedInUser(null);
        }
      } else {
        // NORMAL USER LOGIN
        const savedUser = localStorage.getItem("eventHubLoggedIn");

        if (savedUser) {
          try {
            setLoggedInUser(JSON.parse(savedUser));
          } catch (error) {
            console.error("Invalid user login data:", error);

            setLoggedInUser(null);
          }
        } else {
          setLoggedInUser(null);
        }
      }
    };

    checkLoggedInUser();

    window.addEventListener("authChanged", checkLoggedInUser);

    return () => {
      window.removeEventListener("authChanged", checkLoggedInUser);
    };
  }, [isAdminPage]);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Logout
  const handleLogout = () => {
    if (isAdminPage) {
      // ADMIN LOGOUT
      localStorage.removeItem("eventHubAdmin");
    } else {
      // USER LOGOUT
      localStorage.removeItem("eventHubLoggedIn");
    }

    setLoggedInUser(null);
    setMenuOpen(false);

    window.dispatchEvent(new Event("authChanged"));

    navigate(isAdminPage ? "/admin/login" : "/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          Event<span>Hub</span>
        </Link>

        {/* Navigation Menu */}
        <div className={`navbar-menu ${menuOpen ? "active" : ""}`}>
          {/* Home */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link active-link" : "nav-link"
            }
            onClick={closeMenu}
          >
            Home
          </NavLink>

          {/* Events */}
          <NavLink
            to="/events"
            className={({ isActive }) =>
              isActive ? "nav-link active-link" : "nav-link"
            }
            onClick={closeMenu}
          >
            Events
          </NavLink>

          {/* About */}
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "nav-link active-link" : "nav-link"
            }
            onClick={closeMenu}
          >
            About
          </NavLink>

          {/* Contact */}
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? "nav-link active-link" : "nav-link"
            }
            onClick={closeMenu}
          >
            Contact
          </NavLink>

          {/* My Bookings - Only User */}
          {!isAdminPage && loggedInUser && (
            <NavLink
              to="/my-bookings"
              className={({ isActive }) =>
                isActive ? "nav-link active-link" : "nav-link"
              }
              onClick={closeMenu}
            >
              My Bookings
            </NavLink>
          )}

          {/* Right Side */}
          <div className="navbar-buttons">
            {loggedInUser ? (
              <>
                {/* User / Admin Profile */}
                <button
                  className="user-profile-btn"
                  onClick={() => {
                    closeMenu();

                    if (isAdminPage) {
                      navigate("/admin/dashboard");
                    } else {
                      navigate("/profile");
                    }
                  }}
                >
                  <span className="user-icon">👤</span>

                  <span className="user-name">
                    {loggedInUser.name ||
                      loggedInUser.fullName ||
                      (isAdminPage ? "Admin" : "User")}
                  </span>
                </button>

                {/* Logout */}
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Login */}
                <Link to="/login" className="login-btn" onClick={closeMenu}>
                  Login
                </Link>

                {/* Sign Up */}
                <Link to="/signup" className="signup-btn" onClick={closeMenu}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
