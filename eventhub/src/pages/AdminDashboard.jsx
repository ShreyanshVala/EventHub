import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);

  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAdmin = JSON.parse(localStorage.getItem("eventHubAdmin"));

    if (!storedAdmin) {
      navigate("/admin/login");
      return;
    }

    setAdmin(storedAdmin);

    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const [eventsResponse, bookingsResponse, usersResponse] =
        await Promise.all([
          fetch("http://localhost:5000/api/events"),
          fetch("http://localhost:5000/api/bookings"),
          fetch("http://localhost:5000/api/users"),
        ]);

      if (!eventsResponse.ok) {
        throw new Error("Failed to load events");
      }

      if (!bookingsResponse.ok) {
        throw new Error("Failed to load bookings");
      }

      if (!usersResponse.ok) {
        throw new Error("Failed to load users");
      }

      const eventsData = await eventsResponse.json();
      const bookingsData = await bookingsResponse.json();
      const usersData = await usersResponse.json();

      setEvents(eventsData);
      setBookings(bookingsData);
      setUsers(usersData);
    } catch (error) {
      console.error("Dashboard data loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("eventHubAdmin");
    navigate("/admin/login");
  };

  const liveEvents = events.filter((event) => event.status === "Live");

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "Confirmed",
  );

  const totalRevenue = confirmedBookings.reduce(
    (total, booking) => total + Number(booking.totalPrice || 0),
    0,
  );

  const recentBookings = bookings.slice(0, 5);

  return (
    <div className="admin-dashboard-page">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="admin-logo">🎟️ EventHub</div>

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

          <Link to="/admin/bookings" className="admin-nav-link">
            📋 Bookings
          </Link>

          <Link to="/admin/users" className="admin-nav-link">
            👥 Users
          </Link>
        </nav>

        <button className="admin-logout" onClick={handleLogout}>
          🚪 Logout
        </button>
      </aside>

      {/* MAIN */}
      <main className="admin-main">
        {/* TOPBAR */}
        <div className="admin-topbar">
          <div className="admin-page-label">
            <h1>Dashboard</h1>
            <p>Manage your EventHub platform</p>
          </div>

          <div className="admin-profile">
            <div className="admin-avatar">
              {(admin?.name || "Admin").charAt(0).toUpperCase()}
            </div>

            <div className="admin-profile-info">
              <strong>{admin?.name || "Admin"}</strong>

              <span>{admin?.role || "Administrator"}</span>
            </div>
          </div>
        </div>

        {/* WELCOME */}
        <div className="admin-welcome">
          <h2>Welcome back, {admin?.name || "Admin"} 👋</h2>

          <p>Here's what's happening with your EventHub today.</p>
        </div>

        {/* STATS */}
        <div className="admin-stats">
          <div className="admin-stat-card">
            <div className="stat-icon">🎫</div>

            <div>
              <span>Total Events</span>
              <h2>{loading ? "..." : events.length}</h2>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon">🟢</div>

            <div>
              <span>Live Events</span>
              <h2>{loading ? "..." : liveEvents.length}</h2>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon">📋</div>

            <div>
              <span>Total Bookings</span>
              <h2>{loading ? "..." : bookings.length}</h2>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon">👥</div>

            <div>
              <span>Total Users</span>
              <h2>{loading ? "..." : users.length}</h2>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon">💰</div>

            <div>
              <span>Total Revenue</span>
              <h2>₹{loading ? "..." : totalRevenue.toLocaleString("en-IN")}</h2>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <section className="admin-section">
          <div className="section-header">
            <div>
              <h2>Quick Actions</h2>
              <p>Quickly manage your EventHub</p>
            </div>
          </div>

          <div className="quick-actions">
            <Link to="/admin/events/add" className="quick-action-card">
              <div className="quick-action-icon">➕</div>

              <div>
                <h3>Add New Event</h3>
                <p>Create a new EventHub event</p>
              </div>
            </Link>

            <Link to="/admin/events" className="quick-action-card">
              <div className="quick-action-icon">🎫</div>

              <div>
                <h3>Manage Events</h3>
                <p>View and manage all events</p>
              </div>
            </Link>

            <Link to="/admin/bookings" className="quick-action-card">
              <div className="quick-action-icon">📋</div>

              <div>
                <h3>View Bookings</h3>
                <p>Manage customer bookings</p>
              </div>
            </Link>

            <Link to="/admin/users" className="quick-action-card">
              <div className="quick-action-icon">👥</div>

              <div>
                <h3>Manage Users</h3>
                <p>View registered users</p>
              </div>
            </Link>
          </div>
        </section>

        {/* RECENT BOOKINGS */}
        <section className="admin-section">
          <div className="section-header">
            <div>
              <h2>Recent Bookings</h2>
              <p>Latest customer bookings</p>
            </div>

            <Link to="/admin/bookings" className="view-all-btn">
              View All →
            </Link>
          </div>

          <div className="recent-bookings">
            {loading ? (
              <div className="empty-state">
                <h3>Loading bookings...</h3>
              </div>
            ) : recentBookings.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>

                <h3>No bookings yet</h3>

                <p>Customer bookings will appear here.</p>
              </div>
            ) : (
              <div className="bookings-list">
                {recentBookings.map((booking) => (
                  <div className="booking-row" key={booking._id}>
                    <div className="booking-user">
                      <div className="booking-avatar">
                        {(booking.customerName || "U").charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <strong>
                          {booking.customerName || "Unknown User"}
                        </strong>

                        <span>{booking.customerEmail || ""}</span>
                      </div>
                    </div>

                    <div className="booking-event">
                      <strong>{booking.eventName || "Event"}</strong>

                      <span>{booking.bookingId}</span>
                    </div>

                    <div className="booking-tickets">
                      🎟️ {booking.tickets || 0}
                    </div>

                    <div className="booking-price">
                      ₹{Number(booking.totalPrice || 0).toLocaleString("en-IN")}
                    </div>

                    <div>
                      <span
                        className={`booking-status ${
                          booking.status === "Confirmed"
                            ? "confirmed"
                            : "pending"
                        }`}
                      >
                        {booking.status || "Confirmed"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
