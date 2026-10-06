import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminEvents.css";

function AdminEvents() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Check Admin Login + Load Events
  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem("eventHubAdmin"));

    if (!admin) {
      navigate("/admin/login");
      return;
    }

    loadEvents();
  }, [navigate]);

  // =========================
  // LOAD EVENTS
  // =========================
  const loadEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:5000/api/events");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load events");
      }

      setEvents(data);
    } catch (err) {
      console.error("Load events error:", err);

      setError(
        "Unable to load events. Please make sure backend server is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DELETE EVENT
  // =========================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?",
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete event");
      }

      // Remove from screen
      setEvents((prevEvents) => prevEvents.filter((event) => event._id !== id));

      alert("Event deleted successfully!");
    } catch (err) {
      console.error("Delete event error:", err);

      alert("Unable to delete event.");
    }
  };

  // =========================
  // TOGGLE LIVE / DRAFT
  // =========================
  const toggleStatus = async (event) => {
    const newStatus = event.status === "Live" ? "Draft" : "Live";

    try {
      const response = await fetch(
        `http://localhost:5000/api/events/${event._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update status");
      }

      // Update screen
      setEvents((prevEvents) =>
        prevEvents.map((item) =>
          item._id === event._id ? { ...item, status: newStatus } : item,
        ),
      );
    } catch (err) {
      console.error("Status update error:", err);

      alert("Unable to update event status.");
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
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="admin-events-page">
        <main className="admin-events-content">
          <div className="no-events">
            <div className="no-events-icon">⏳</div>

            <h2>Loading Events...</h2>

            <p>Please wait while events are loading.</p>
          </div>
        </main>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================
  if (error) {
    return (
      <div className="admin-events-page">
        <main className="admin-events-content">
          <div className="no-events">
            <div className="no-events-icon">⚠️</div>

            <h2>Something Went Wrong</h2>

            <p>{error}</p>

            <button onClick={loadEvents} className="add-event-btn">
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-events-page">
      {/* =========================
          SIDEBAR
      ========================= */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          Event<span>Hub</span>
        </div>

        <nav>
          <Link to="/admin/dashboard">📊 Dashboard</Link>

          <Link to="/admin/events" className="active">
            🎫 Events
          </Link>

          <Link to="/admin/events/add">➕ Add Event</Link>
        </nav>

        <button className="admin-logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </aside>

      {/* =========================
          MAIN CONTENT
      ========================= */}
      <main className="admin-events-content">
        {/* Header */}
        <div className="admin-events-header">
          <div>
            <h1>Manage Events</h1>

            <p>View, edit, delete and manage your events</p>
          </div>

          <Link to="/admin/events/add" className="add-event-btn">
            + Add New Event
          </Link>
        </div>

        {/* Event Count */}
        <div className="event-count-box">
          <strong>{events.length}</strong>

          <span>Total Events</span>
        </div>

        {/* =========================
            NO EVENTS
        ========================= */}
        {events.length === 0 ? (
          <div className="no-events">
            <div className="no-events-icon">🎫</div>

            <h2>No Events Found</h2>

            <p>You haven't added any events yet.</p>

            <Link to="/admin/events/add" className="add-event-btn">
              + Create Your First Event
            </Link>
          </div>
        ) : (
          /* =========================
             EVENTS GRID
          ========================= */
          <div className="admin-events-grid">
            {events.map((event) => (
              <div className="admin-event-card" key={event._id}>
                {/* Image */}
                <div className="admin-event-image">
                  {event.image ? (
                    <img src={event.image} alt={event.title} />
                  ) : (
                    <div className="no-image">🎫</div>
                  )}

                  {/* Status */}
                  <span
                    className={`event-status ${
                      event.status === "Live" ? "status-live" : "status-draft"
                    }`}
                  >
                    {event.status === "Live" ? "● Live" : "● Draft"}
                  </span>
                </div>

                {/* Content */}
                <div className="admin-event-info">
                  <span className="event-category">
                    {event.category || "Other"}
                  </span>

                  <h2>{event.title}</h2>

                  <div className="event-details">
                    <p>📅 {event.date || "Date not available"}</p>

                    <p>⏰ {event.time || "Time not available"}</p>

                    <p>📍 {event.location || "Location not available"}</p>

                    <p>💰 ₹{event.price || 0}</p>
                  </div>

                  {/* Actions */}
                  <div className="event-actions">
                    {/* Edit */}
                    <Link
                      to={`/admin/events/edit/${event._id}`}
                      className="edit-btn"
                    >
                      ✏️ Edit
                    </Link>

                    {/* Live / Draft */}
                    <button
                      className={
                        event.status === "Live" ? "draft-btn" : "live-btn"
                      }
                      onClick={() => toggleStatus(event)}
                    >
                      {event.status === "Live" ? "🟡 Draft" : "🟢 Live"}
                    </button>

                    {/* Delete */}
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(event._id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminEvents;
