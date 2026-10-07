import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./AdminBookingDetails.css";

// LIVE BACKEND
const API_URL = "https://eventhub-34ok.onrender.com";

function AdminBookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem("eventHubAdmin"));

    if (!admin) {
      navigate("/admin/login");
      return;
    }

    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        setError("");

        // Get booking from LIVE MongoDB backend using custom bookingId
        const bookingResponse = await fetch(
          `${API_URL}/api/bookings/booking-id/${encodeURIComponent(id)}`,
        );

        const bookingData = await bookingResponse.json();

        if (!bookingResponse.ok) {
          throw new Error(bookingData.message || "Booking not found");
        }

        console.log("Live Booking:", bookingData);

        setBooking(bookingData);

        // Get event details from LIVE MongoDB backend
        if (bookingData.eventId) {
          const eventResponse = await fetch(
            `${API_URL}/api/events/${bookingData.eventId}`,
          );

          if (eventResponse.ok) {
            const eventData = await eventResponse.json();

            console.log("Live Event:", eventData);

            setEvent(eventData);
          }
        }
      } catch (error) {
        console.error("Booking details error:", error);

        setBooking(null);
        setError(error.message || "Unable to load booking details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [id, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("eventHubAdmin");
    navigate("/admin/login");
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="admin-booking-details-page">
        <aside className="admin-details-sidebar">
          <div className="admin-details-logo">🎟️ EventHub</div>

          <nav className="admin-details-nav">
            <Link to="/admin/dashboard">📊 Dashboard</Link>

            <Link to="/admin/events">🎫 Events</Link>

            <Link to="/admin/events/add">➕ Add Event</Link>

            <Link to="/admin/bookings" className="active">
              📋 Bookings
            </Link>

            <Link to="/admin/users">👥 Users</Link>
          </nav>

          <button className="admin-details-logout" onClick={handleLogout}>
            🚪 Logout
          </button>
        </aside>

        <main className="admin-details-main">
          <div className="booking-not-found">
            <div className="not-found-icon">⏳</div>

            <h2>Loading Booking...</h2>

            <p>Please wait while booking details are loading.</p>
          </div>
        </main>
      </div>
    );
  }

  // =========================
  // BOOKING NOT FOUND / ERROR
  // =========================
  if (!booking) {
    return (
      <div className="admin-booking-details-page">
        <aside className="admin-details-sidebar">
          <div className="admin-details-logo">🎟️ EventHub</div>

          <nav className="admin-details-nav">
            <Link to="/admin/dashboard">📊 Dashboard</Link>

            <Link to="/admin/events">🎫 Events</Link>

            <Link to="/admin/events/add">➕ Add Event</Link>

            <Link to="/admin/bookings" className="active">
              📋 Bookings
            </Link>

            <Link to="/admin/users">👥 Users</Link>
          </nav>

          <button className="admin-details-logout" onClick={handleLogout}>
            🚪 Logout
          </button>
        </aside>

        <main className="admin-details-main">
          <div className="booking-not-found">
            <div className="not-found-icon">📋</div>

            <h2>Booking Not Found</h2>

            <p>{error || "The booking you are looking for does not exist."}</p>

            <Link to="/admin/bookings" className="back-bookings-btn">
              ← Back to Bookings
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // =========================
  // BOOKING DATA
  // =========================

  const customerName = booking.customerName || "Guest User";

  const customerEmail = booking.customerEmail || "Not available";

  const customerPhone = booking.customerPhone || "Not available";

  const eventName = booking.eventName || event?.title || "Event";

  const eventDate = booking.eventDate || event?.date || "Not available";

  const eventTime = event?.time || booking.eventTime || "Not available";

  const eventLocation =
    booking.eventLocation || event?.location || "Not available";

  const eventImage = event?.image || "";

  const eventCategory = event?.category || "";

  const quantity = Number(booking.tickets) || 1;

  const pricePerTicket = Number(booking.ticketPrice) || 0;

  const totalPrice = Number(booking.totalPrice) || quantity * pricePerTicket;

  const bookingStatus = booking.status || "Confirmed";

  return (
    <div className="admin-booking-details-page">
      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className="admin-details-sidebar">
        <div className="admin-details-logo">🎟️ EventHub</div>

        <nav className="admin-details-nav">
          <Link to="/admin/dashboard">📊 Dashboard</Link>

          <Link to="/admin/events">🎫 Events</Link>

          <Link to="/admin/events/add">➕ Add Event</Link>

          <Link to="/admin/bookings" className="active">
            📋 Bookings
          </Link>

          <Link to="/admin/users">👥 Users</Link>
        </nav>

        <button className="admin-details-logout" onClick={handleLogout}>
          🚪 Logout
        </button>
      </aside>

      {/* =========================
          MAIN
      ========================= */}

      <main className="admin-details-main">
        {/* Header */}

        <div className="admin-details-header">
          <div>
            <Link to="/admin/bookings" className="back-link">
              ← Back to Bookings
            </Link>

            <h1>Booking Details</h1>

            <p>View complete information about this booking.</p>
          </div>

          <span className="booking-status-badge">✓ {bookingStatus}</span>
        </div>

        {/* =========================
            BOOKING ID
        ========================= */}

        <div className="booking-id-card">
          <div>
            <span>Booking ID</span>

            <strong>{booking.bookingId || booking._id}</strong>
          </div>

          <div>
            <span>Booking Date</span>

            <strong>
              {booking.createdAt
                ? new Date(booking.createdAt).toLocaleDateString("en-IN")
                : "Not available"}
            </strong>
          </div>
        </div>

        {/* =========================
            DETAILS GRID
        ========================= */}

        <div className="booking-details-grid">
          {/* =========================
              EVENT CARD
          ========================= */}

          <section className="details-card event-details-card">
            <div className="details-card-title">
              <h2>🎫 Event Information</h2>
            </div>

            {eventImage && (
              <img
                src={eventImage}
                alt={eventName}
                className="details-event-image"
              />
            )}

            <div className="event-detail-content">
              <h3>{eventName}</h3>

              {eventCategory && (
                <span className="event-category">{eventCategory}</span>
              )}

              <div className="detail-row">
                <span>📅 Date</span>

                <strong>{eventDate}</strong>
              </div>

              <div className="detail-row">
                <span>⏰ Time</span>

                <strong>{eventTime}</strong>
              </div>

              <div className="detail-row">
                <span>📍 Location</span>

                <strong>{eventLocation}</strong>
              </div>
            </div>
          </section>

          {/* =========================
              CUSTOMER CARD
          ========================= */}

          <section className="details-card">
            <div className="details-card-title">
              <h2>👤 Customer Information</h2>
            </div>

            <div className="customer-profile">
              <div className="customer-avatar">
                {customerName.charAt(0).toUpperCase()}
              </div>

              <div>
                <h3>{customerName}</h3>

                <p>{customerEmail}</p>
              </div>
            </div>

            <div className="customer-info-list">
              <div className="detail-row">
                <span>Name</span>

                <strong>{customerName}</strong>
              </div>

              <div className="detail-row">
                <span>Email</span>

                <strong>{customerEmail}</strong>
              </div>

              <div className="detail-row">
                <span>Phone</span>

                <strong>{customerPhone}</strong>
              </div>

              <div className="detail-row">
                <span>User ID</span>

                <strong>{booking.customerEmail || "Not available"}</strong>
              </div>
            </div>
          </section>
        </div>

        {/* =========================
            PAYMENT SUMMARY
        ========================= */}

        <section className="details-card payment-card">
          <div className="details-card-title">
            <h2>💳 Payment & Ticket Summary</h2>
          </div>

          <div className="payment-summary">
            <div className="payment-row">
              <span>Tickets</span>

              <strong>{quantity}</strong>
            </div>

            <div className="payment-row">
              <span>Price per Ticket</span>

              <strong>₹{pricePerTicket.toLocaleString("en-IN")}</strong>
            </div>

            <div className="payment-row total-row">
              <span>Total Amount</span>

              <strong>₹{totalPrice.toLocaleString("en-IN")}</strong>
            </div>

            <div className="payment-row">
              <span>Payment Status</span>

              <span className="confirmed-badge">✓ {bookingStatus}</span>
            </div>
          </div>
        </section>

        {/* =========================
            BOTTOM BUTTON
        ========================= */}

        <div className="details-actions">
          <Link to="/admin/bookings" className="back-action-btn">
            ← Back to Bookings
          </Link>
        </div>
      </main>
    </div>
  );
}

export default AdminBookingDetails;
