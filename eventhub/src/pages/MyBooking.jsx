import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./MyBooking.css";

const MyBooking = () => {
  const navigate = useNavigate();

  const [loggedInUser, setLoggedInUser] = useState(null);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // GET LOGGED IN USER
  // =========================
  useEffect(() => {
    try {
      const userData = localStorage.getItem("eventHubLoggedIn");

      if (userData) {
        setLoggedInUser(JSON.parse(userData));
      }
    } catch (err) {
      console.error("Login data error:", err);
    }
  }, []);

  // =========================
  // GET USER BOOKINGS
  // =========================
  useEffect(() => {
    const fetchMyBookings = async () => {
      if (!loggedInUser?.email) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/api/bookings/user/${encodeURIComponent(
            loggedInUser.email,
          )}`,
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load bookings");
        }

        setMyBookings(data);
      } catch (err) {
        console.error("Fetch bookings error:", err);
        setError("Unable to load your bookings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, [loggedInUser]);

  // =========================
  // VIEW TICKET
  // =========================
  const handleViewTicket = (bookingId) => {
    navigate(`/booking-success/${bookingId}`);
  };

  // =========================
  // LOGIN REQUIRED
  // =========================
  if (!loggedInUser) {
    return (
      <div className="my-booking-page">
        <div className="booking-empty-card">
          <div className="empty-icon">🔐</div>

          <h2>Login Required</h2>

          <p>Please login to your EventHub account to view your bookings.</p>

          <Link to="/login" className="empty-action-btn">
            Login
          </Link>
        </div>
      </div>
    );
  }

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="my-booking-page">
        <div className="booking-empty-card">
          <div className="empty-icon">⏳</div>

          <h2>Loading Bookings...</h2>

          <p>Please wait while we fetch your bookings.</p>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================
  if (error) {
    return (
      <div className="my-booking-page">
        <div className="booking-empty-card">
          <div className="empty-icon">⚠️</div>

          <h2>Something went wrong</h2>

          <p>{error}</p>

          <Link to="/events" className="empty-action-btn">
            Browse Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="my-booking-page">
      <div className="my-booking-container">
        {/* =========================
            HEADER
        ========================= */}
        <div className="my-booking-header">
          <div>
            <span className="page-label">MY ACCOUNT</span>

            <h1>My Bookings</h1>

            <p>
              Welcome back, <strong>{loggedInUser.name}</strong>
            </p>
          </div>

          <Link to="/events" className="browse-events-btn">
            + Browse Events
          </Link>
        </div>

        {/* =========================
            BOOKING COUNT
        ========================= */}
        {myBookings.length > 0 && (
          <div className="booking-count">
            <span>Your Bookings</span>

            <strong>{myBookings.length}</strong>
          </div>
        )}

        {/* =========================
            NO BOOKINGS
        ========================= */}
        {myBookings.length === 0 ? (
          <div className="booking-empty-card">
            <div className="empty-icon">🎟️</div>

            <h2>No Bookings Yet</h2>

            <p>
              You haven't booked any events yet. Explore our events and reserve
              your tickets today.
            </p>

            <Link to="/events" className="empty-action-btn">
              Explore Events
            </Link>
          </div>
        ) : (
          /* =========================
             BOOKING LIST
          ========================= */
          <div className="booking-list">
            {myBookings.map((booking) => (
              <div className="booking-card" key={booking._id}>
                {/* TOP */}
                <div className="booking-card-top">
                  <div className="booking-id-box">
                    <span>BOOKING ID</span>

                    <strong>{booking.bookingId}</strong>
                  </div>

                  <span className="confirmed-badge">
                    ✓ {booking.status || "Confirmed"}
                  </span>
                </div>

                {/* CONTENT */}
                <div className="booking-card-content">
                  {/* EVENT IMAGE */}
                  <div className="booking-event-image">
                    {booking.eventImage ? (
                      <img src={booking.eventImage} alt={booking.eventName} />
                    ) : (
                      <div className="fallback-event-image">🎫</div>
                    )}
                  </div>

                  {/* EVENT DETAILS */}
                  <div className="booking-event-details">
                    <span className="event-category">
                      {booking.eventCategory || "Event"}
                    </span>

                    <h2>{booking.eventName}</h2>

                    <div className="booking-info-grid">
                      {/* DATE */}
                      <div className="booking-info-item">
                        <span className="info-icon">📅</span>

                        <div>
                          <small>Date</small>

                          <strong>
                            {booking.eventDate || "Not available"}
                          </strong>
                        </div>
                      </div>

                      {/* TIME */}
                      <div className="booking-info-item">
                        <span className="info-icon">🕐</span>

                        <div>
                          <small>Time</small>

                          <strong>
                            {booking.eventTime || "Not available"}
                          </strong>
                        </div>
                      </div>

                      {/* LOCATION */}
                      <div className="booking-info-item">
                        <span className="info-icon">📍</span>

                        <div>
                          <small>Location</small>

                          <strong>
                            {booking.eventLocation || "Not available"}
                          </strong>
                        </div>
                      </div>

                      {/* TICKETS */}
                      <div className="booking-info-item">
                        <span className="info-icon">🎟️</span>

                        <div>
                          <small>Tickets</small>

                          <strong>{booking.tickets || 1}</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PRICE */}
                  <div className="booking-price">
                    <span>Total Paid</span>

                    <strong>₹{booking.totalPrice}</strong>
                  </div>
                </div>

                {/* BOTTOM */}
                <div className="booking-card-bottom">
                  <div className="payment-info">
                    <span>Payment Status</span>

                    <strong>✓ {booking.status || "Confirmed"}</strong>
                  </div>

                  <button
                    className="view-ticket-btn"
                    onClick={() => handleViewTicket(booking.bookingId)}
                  >
                    View Ticket →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBooking;
