import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./EventDetails.css";

const API_URL = "https://eventhub-34ok.onrender.com";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_URL}/api/events/${id}`);

        if (!response.ok) {
          throw new Error("Event not found");
        }

        const data = await response.json();

        // Draft event should not be visible to users
        if (data.status !== "Live") {
          navigate("/events");
          return;
        }

        setEvent(data);
      } catch (error) {
        console.error("Error loading event:", error);
        navigate("/events");
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="event-loading">
        <div className="loading-spinner"></div>
        <p>Loading event...</p>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  return (
    <div className="event-details-page">
      {/* Hero Image */}
      <section className="event-details-hero">
        <img
          src={event.image || "https://via.placeholder.com/1200x600?text=Event"}
          alt={event.title}
          className="event-details-image"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/1200x600?text=Event";
          }}
        />

        <div className="event-details-overlay"></div>

        <div className="event-details-hero-content">
          <span className="details-category">{event.category}</span>

          <h1>{event.title}</h1>

          <p>Discover an amazing experience with EventHub.</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="event-details-container">
        <div className="event-details-main">
          {/* Left Side */}
          <div className="event-details-content">
            {/* About */}
            <div className="details-section">
              <h2>About This Event</h2>

              <p>
                {event.description ||
                  "Join us for an amazing event experience. Get your tickets and enjoy this special event with EventHub."}
              </p>
            </div>

            {/* Event Information */}
            <div className="details-section">
              <h2>Event Information</h2>

              <div className="event-info-grid">
                <div className="info-box">
                  <div className="info-icon">📅</div>

                  <div>
                    <span>Date</span>
                    <strong>{event.date}</strong>
                  </div>
                </div>

                <div className="info-box">
                  <div className="info-icon">⏰</div>

                  <div>
                    <span>Time</span>
                    <strong>{event.time || "Time not available"}</strong>
                  </div>
                </div>

                <div className="info-box">
                  <div className="info-icon">📍</div>

                  <div>
                    <span>Location</span>
                    <strong>{event.location}</strong>
                  </div>
                </div>

                <div className="info-box">
                  <div className="info-icon">🎫</div>

                  <div>
                    <span>Category</span>
                    <strong>{event.category}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="details-section">
              <h2>Event Location</h2>

              <div className="location-box">
                <div className="location-icon">📍</div>

                <div>
                  <h3>{event.location}</h3>

                  <p>Please reach the venue before the event starts.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <aside className="booking-card">
            <div className="booking-card-header">
              <span>Ticket Price</span>

              <strong>₹{event.price}</strong>

              <small>per person</small>
            </div>

            <div className="booking-divider"></div>

            <div className="booking-summary">
              <div>
                <span>Event</span>
                <strong>{event.title}</strong>
              </div>

              <div>
                <span>Date</span>
                <strong>{event.date}</strong>
              </div>

              <div>
                <span>Location</span>
                <strong>{event.location}</strong>
              </div>
            </div>

            <Link to={`/events/${event._id}/book`} className="book-now-btn">
              Book Now →
            </Link>

            <p className="secure-text">🔒 Secure booking through EventHub</p>
          </aside>
        </div>

        {/* Back Button */}
        <Link to="/events" className="back-events-link">
          ← Back to All Events
        </Link>
      </section>
    </div>
  );
}

export default EventDetails;
