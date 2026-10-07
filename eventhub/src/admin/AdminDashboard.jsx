import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

// LIVE BACKEND
const API_URL = "https://eventhub-34ok.onrender.com";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);

  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const admin = JSON.parse(localStorage.getItem("eventHubAdmin"));

  // =========================
  // ADMIN LOGIN CHECK
  // =========================
  useEffect(() => {
    if (!admin) {
      navigate("/admin/login");
      return;
    }

    loadEvents();
    loadBookings();
    loadUsers();
  }, [navigate]);

  // =========================
  // LOAD EVENTS FROM LIVE MONGODB
  // =========================
  const loadEvents = async () => {
    try {
      setLoadingEvents(true);

      const response = await fetch(`${API_URL}/api/events`);

      if (!response.ok) {
        throw new Error("Failed to load events");
      }

      const data = await response.json();

      console.log("Live Events:", data);

      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Dashboard events error:", error);
      setEvents([]);
    } finally {
      setLoadingEvents(false);
    }
  };

  // =========================
  // LOAD BOOKINGS FROM LIVE MONGODB
  // =========================
  const loadBookings = async () => {
    try {
      setLoadingBookings(true);

      const response = await fetch(`${API_URL}/api/bookings`);

      if (!response.ok) {
        throw new Error("Failed to load bookings");
      }

      const data = await response.json();

      console.log("Live Bookings:", data);

      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Dashboard bookings error:", error);
      setBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  };

  // =========================
  // LOAD USERS FROM LIVE MONGODB
  // =========================
  const loadUsers = async () => {
    try {
      setLoadingUsers(true);

      const response = await fetch(`${API_URL}/api/users`);

      if (!response.ok) {
        throw new Error("Failed to load users");
      }

      const data = await response.json();

      console.log("Live Users:", data);

      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Dashboard users error:", error);
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  // =========================
  // LIVE EVENTS
  // =========================
  const liveEvents = events.filter(
    (event) => event.status?.toLowerCase() === "live",
  );

  // =========================
  // RECENT BOOKINGS
  // =========================
  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("eventHubAdmin");
    navigate("/admin/login");
  };

  return (
    <div className="admin-dashboard-page">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          Event<span>Hub</span>
          <small>ADMIN PANEL</small>
        </div>

        <nav className="admin-nav">
          <Link to="/admin/dashboard" className="admin-nav-link active">
            📊 Dashboard
          </Link>

          <Link to="/admin/events" className="admin-nav-link">
            🎫 Events
          </Link>

          <Link to="/admin/events/add" className="admin-nav-link">
            ➕ Add Event
          </Link>

          <Link to="/admin/bookings">📋 Bookings</Link>

          <Link to="/admin/users">👥 Users</Link>
        </nav>

        <button className="admin-logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Header */}
        <div className="admin-topbar">
          <div>
            <span className="admin-page-label">ADMIN PANEL</span>

            <h1>Dashboard</h1>

            <p>Welcome back, Admin 👋</p>
          </div>

          <Link to="/admin/events/add" className="add-event-top-btn">
            + Add Event
          </Link>
        </div>

        {/* Statistics */}
        <div className="admin-stats">
          {/* Total Events */}
          <div className="admin-stat-card">
            <div className="stat-icon purple">🎫</div>

            <div>
              <span>Total Events</span>

              <strong>{loadingEvents ? "..." : events.length}</strong>
            </div>
          </div>

          {/* Live Events */}
          <div className="admin-stat-card">
            <div className="stat-icon green">🟢</div>

            <div>
              <span>Live Events</span>

              <strong>{loadingEvents ? "..." : liveEvents.length}</strong>
            </div>
          </div>

          {/* Total Bookings */}
          <div className="admin-stat-card">
            <div className="stat-icon orange">🎟️</div>

            <div>
              <span>Total Bookings</span>

              <strong>{loadingBookings ? "..." : bookings.length}</strong>
            </div>
          </div>

          {/* Total Users */}
          <div className="admin-stat-card">
            <div className="stat-icon blue">👥</div>

            <div>
              <span>Total Users</span>

              <strong>{loadingUsers ? "..." : users.length}</strong>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <section className="admin-section">
          <div className="section-header">
            <div>
              <span>MANAGEMENT</span>

              <h2>Quick Actions</h2>
            </div>
          </div>

          <div className="quick-actions">
            <Link to="/admin/events/add" className="quick-action-card">
              <div className="quick-icon">➕</div>

              <div>
                <h3>Add New Event</h3>

                <p>Create and publish a new event</p>
              </div>

              <span>→</span>
            </Link>

            <Link to="/admin/events" className="quick-action-card">
              <div className="quick-icon">🎫</div>

              <div>
                <h3>Manage Events</h3>

                <p>Edit, delete or publish events</p>
              </div>

              <span>→</span>
            </Link>

            <Link to="/admin/bookings" className="quick-action-card">
              <div className="quick-icon">📋</div>

              <div>
                <h3>Manage Bookings</h3>

                <p>View and manage customer bookings</p>
              </div>

              <span>→</span>
            </Link>
          </div>
        </section>

        {/* Recent Bookings */}
        <section className="admin-section">
          <div className="section-header">
            <div>
              <span>ACTIVITY</span>

              <h2>Recent Bookings</h2>
            </div>

            <Link to="/admin/bookings" className="view-all-link">
              View All →
            </Link>
          </div>

          {loadingBookings ? (
            <div className="admin-empty">
              <div>⏳</div>

              <h3>Loading Bookings...</h3>

              <p>Please wait while bookings are loading.</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="admin-empty">
              <div>🎟️</div>

              <h3>No Bookings Yet</h3>

              <p>Bookings will appear here when users book events.</p>
            </div>
          ) : (
            <div className="recent-bookings">
              {recentBookings.map((booking) => (
                <div className="recent-booking" key={booking._id}>
                  <div className="booking-user-icon">👤</div>

                  <div className="recent-booking-info">
                    <strong>{booking.customerName || "Guest User"}</strong>

                    <span>{booking.eventName || "Event"}</span>
                  </div>

                  <div className="booking-amount">
                    ₹{Number(booking.totalPrice || 0).toLocaleString("en-IN")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
