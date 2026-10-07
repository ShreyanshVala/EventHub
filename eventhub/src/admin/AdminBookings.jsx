import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminBookings.css";

// LIVE BACKEND
const API_URL = "https://eventhub-34ok.onrender.com";

function AdminBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // ADMIN CHECK + LOAD
  // =========================
  useEffect(() => {
    const admin = localStorage.getItem("eventHubAdmin");

    if (!admin) {
      navigate("/admin/login");
      return;
    }

    loadBookings();
  }, [navigate]);

  // =========================
  // LOAD BOOKINGS FROM LIVE BACKEND
  // =========================
  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/bookings`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load bookings");
      }

      console.log("Live Bookings:", data);

      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Load bookings error:", error);

      setBookings([]);

      setError(
        "Unable to load bookings. Please check the live backend connection.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DELETE BOOKING
  // =========================
  const handleDelete = async (mongoId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this booking?",
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/api/bookings/${mongoId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete booking");
      }

      // Remove deleted booking from UI
      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking._id !== mongoId),
      );

      alert("Booking deleted successfully!");
    } catch (error) {
      console.error("Delete booking error:", error);

      alert(error.message || "Failed to delete booking.");
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("eventHubAdmin");

    navigate("/admin/login");
  };

  // =========================
  // FILTER BOOKINGS
  // =========================
  const filteredBookings = bookings.filter((booking) => {
    const searchText = search.toLowerCase();

    const bookingId = String(booking.bookingId || "").toLowerCase();

    const eventName = String(booking.eventName || "").toLowerCase();

    const customerName = String(booking.customerName || "").toLowerCase();

    const customerEmail = String(booking.customerEmail || "").toLowerCase();

    const matchesSearch =
      bookingId.includes(searchText) ||
      eventName.includes(searchText) ||
      customerName.includes(searchText) ||
      customerEmail.includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      (booking.status || "Confirmed") === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // =========================
  // STATS
  // =========================
  const totalBookings = bookings.length;

  const confirmedBookings = bookings.filter(
    (booking) => (booking.status || "Confirmed") === "Confirmed",
  ).length;

  const totalRevenue = bookings.reduce(
    (total, booking) => total + (Number(booking.totalPrice) || 0),
    0,
  );

  return (
    <div className="admin-bookings-page">
      {/* ================= SIDEBAR ================= */}

      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h2>
            Event<span>Hub</span>
          </h2>

          <p>Admin Panel</p>
        </div>

        <nav className="admin-nav">
          <Link to="/admin/dashboard">📊 Dashboard</Link>

          <Link to="/admin/events">🎫 Events</Link>

          <Link to="/admin/events/add">➕ Add Event</Link>

          <Link to="/admin/bookings" className="active">
            📋 Bookings
          </Link>

          <Link to="/admin/users">👥 Users</Link>
        </nav>

        <button className="admin-logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </aside>

      {/* ================= MAIN ================= */}

      <main className="admin-bookings-main">
        {/* Header */}

        <div className="admin-bookings-header">
          <div>
            <span className="admin-page-label">EVENTHUB ADMIN</span>

            <h1>Booking Management</h1>

            <p>Manage and monitor all event bookings.</p>
          </div>

          <Link to="/admin/dashboard" className="back-dashboard-btn">
            ← Dashboard
          </Link>
        </div>

        {/* ================= STATS ================= */}

        <div className="booking-stats">
          <div className="booking-stat-card">
            <div className="stat-icon">📋</div>

            <div>
              <span>Total Bookings</span>

              <strong>{loading ? "..." : totalBookings}</strong>
            </div>
          </div>

          <div className="booking-stat-card">
            <div className="stat-icon">✓</div>

            <div>
              <span>Confirmed</span>

              <strong>{loading ? "..." : confirmedBookings}</strong>
            </div>
          </div>

          <div className="booking-stat-card">
            <div className="stat-icon">₹</div>

            <div>
              <span>Total Revenue</span>

              <strong>
                {loading ? "..." : `₹${totalRevenue.toLocaleString("en-IN")}`}
              </strong>
            </div>
          </div>
        </div>

        {/* ================= FILTERS ================= */}

        <div className="booking-filters">
          <div className="booking-search">
            <span>🔍</span>

            <input
              type="text"
              placeholder="Search booking, user or event..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>

            <option value="Confirmed">Confirmed</option>

            <option value="Cancelled">Cancelled</option>

            <option value="Pending">Pending</option>
          </select>
        </div>

        {/* ================= BOOKINGS TABLE ================= */}

        <div className="admin-bookings-card">
          <div className="bookings-card-header">
            <div>
              <h2>All Bookings</h2>

              <p>
                {filteredBookings.length} booking
                {filteredBookings.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>

          {/* ERROR */}

          {error ? (
            <div className="no-bookings">
              <div className="no-bookings-icon">⚠️</div>

              <h3>Something Went Wrong</h3>

              <p>{error}</p>

              <button
                onClick={loadBookings}
                className="view-booking-btn"
                style={{
                  border: "none",
                  cursor: "pointer",
                  padding: "10px 18px",
                  marginTop: "10px",
                }}
              >
                Try Again
              </button>
            </div>
          ) : loading ? (
            /* LOADING */

            <div className="no-bookings">
              <div className="no-bookings-icon">⏳</div>

              <h3>Loading Bookings...</h3>

              <p>Please wait while bookings are loading.</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            /* NO BOOKINGS */

            <div className="no-bookings">
              <div className="no-bookings-icon">📭</div>

              <h3>No Bookings Found</h3>

              <p>There are no bookings matching your search criteria.</p>
            </div>
          ) : (
            /* BOOKINGS TABLE */

            <div className="bookings-table-wrapper">
              <table className="bookings-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Customer</th>
                    <th>Event</th>
                    <th>Date</th>
                    <th>Tickets</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr key={booking._id}>
                      {/* Booking ID */}

                      <td>
                        <strong className="booking-id">
                          {booking.bookingId || booking._id}
                        </strong>
                      </td>

                      {/* Customer */}

                      <td>
                        <div className="customer-cell">
                          <div className="customer-avatar">
                            {(booking.customerName || "U")
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div className="customer-info">
                            <strong>
                              {booking.customerName || "Guest User"}
                            </strong>

                            <span>{booking.customerEmail || "No email"}</span>
                          </div>
                        </div>
                      </td>

                      {/* Event */}

                      <td>
                        <div className="event-cell">
                          <strong>{booking.eventName || "Event"}</strong>

                          <span>Event</span>
                        </div>
                      </td>

                      {/* Date */}

                      <td>
                        <div className="date-cell">
                          <strong>
                            {booking.eventDate || "Date unavailable"}
                          </strong>

                          <span>{eventTimeFromBooking(booking)}</span>
                        </div>
                      </td>

                      {/* Tickets */}

                      <td>
                        <span className="ticket-count">
                          {booking.tickets || 1}
                        </span>
                      </td>

                      {/* Amount */}

                      <td>
                        <strong className="amount">
                          ₹
                          {(Number(booking.totalPrice) || 0).toLocaleString(
                            "en-IN",
                          )}
                        </strong>
                      </td>

                      {/* Status */}

                      <td>
                        <span className="booking-status-badge">
                          ✓ {booking.status || "Confirmed"}
                        </span>
                      </td>

                      {/* Actions */}

                      <td>
                        <div className="booking-actions">
                          {/* View */}

                          <Link
                            to={`/admin/bookings/${
                              booking.bookingId || booking._id
                            }`}
                            className="view-booking-btn"
                            title="View Booking"
                          >
                            👁️
                          </Link>

                          {/* Delete */}

                          <button
                            className="delete-booking-btn"
                            onClick={() => handleDelete(booking._id)}
                            title="Delete Booking"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// =========================
// EVENT TIME HELPER
// =========================

const eventTimeFromBooking = (booking) => {
  return booking.eventTime || "Time unavailable";
};

export default AdminBookings;
