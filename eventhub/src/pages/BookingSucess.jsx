import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./BookingSuccess.css";

const BookingSuccess = () => {
  const { id } = useParams();

  const [booking, setBooking] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // GET BOOKING + EVENT
  // =========================
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        setError("");

        // Get booking using bookingId (BK...)
        const bookingResponse = await fetch(
          `http://localhost:5000/api/bookings/booking-id/${id}`,
        );

        const bookingData = await bookingResponse.json();

        if (!bookingResponse.ok) {
          throw new Error(bookingData.message || "Booking not found");
        }

        setBooking(bookingData);

        // Get related event from MongoDB
        if (bookingData.eventId) {
          try {
            const eventResponse = await fetch(
              `http://localhost:5000/api/events/${bookingData.eventId}`,
            );

            const eventData = await eventResponse.json();

            if (eventResponse.ok) {
              setEvent(eventData);
            }
          } catch (eventError) {
            console.error("Event fetch error:", eventError);
          }
        }
      } catch (err) {
        console.error("Booking details error:", err);

        setError(err.message || "Unable to load booking details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBookingDetails();
    }
  }, [id]);

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="booking-success-page">
        <div className="booking-not-found">
          <div className="not-found-icon">⏳</div>

          <h2>Loading Ticket...</h2>

          <p>Please wait while we load your booking details.</p>
        </div>
      </div>
    );
  }

  // =========================
  // BOOKING NOT FOUND
  // =========================
  if (!booking || error) {
    return (
      <div className="booking-success-page">
        <div className="booking-not-found">
          <div className="not-found-icon">!</div>

          <h2>Booking Not Found</h2>

          <p>
            We couldn't find your booking details. Please make another booking.
          </p>

          <Link to="/events" className="success-btn">
            Browse Events
          </Link>
        </div>
      </div>
    );
  }

  // =========================
  // EVENT INFORMATION
  // =========================

  const eventTitle = booking.eventName || event?.title || "Event";

  const eventDate = booking.eventDate || event?.date || "Not available";

  const eventTime = event?.time || "Not available";

  const eventLocation =
    booking.eventLocation || event?.location || "Not available";

  const eventCategory = event?.category || "Event";

  const eventImage =
    event?.image ||
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80";

  const bookingId = booking.bookingId || "EH00000000";

  const quantity = Number(booking.tickets) || 1;

  const pricePerTicket = Number(booking.ticketPrice) || 0;

  const totalPrice = Number(booking.totalPrice) || pricePerTicket * quantity;

  const customerName = booking.customerName || "Guest User";

  const customerEmail = booking.customerEmail || "Not available";

  const paymentStatus = booking.status || "Confirmed";

  return (
    <div className="booking-success-page">
      <div className="success-container">
        {/* =========================
            SUCCESS HEADER
        ========================= */}
        <div className="success-header">
          <div className="success-check">✓</div>

          <h1>Booking Confirmed!</h1>

          <p>
            Your ticket has been successfully booked. We hope you have an
            amazing experience!
          </p>
        </div>

        {/* =========================
            TICKET
        ========================= */}
        <div className="ticket-card">
          {/* Ticket Header */}
          <div className="ticket-header">
            <div>
              <span className="ticket-label">EVENT TICKET</span>

              <h2>
                Event<span>Hub</span>
              </h2>
            </div>

            <div className="booking-status">
              <span className="status-dot"></span>

              {booking.status || "Confirmed"}
            </div>
          </div>

          {/* Event Image */}
          <div className="ticket-event-image">
            <img src={eventImage} alt={eventTitle} />

            <div className="image-overlay">
              <span>{eventCategory}</span>
            </div>
          </div>

          {/* Event Information */}
          <div className="ticket-event-info">
            <h2>{eventTitle}</h2>

            <div className="event-info-grid">
              {/* Date */}
              <div className="event-info-item">
                <div className="info-icon">📅</div>

                <div>
                  <span>Date</span>

                  <strong>{eventDate}</strong>
                </div>
              </div>

              {/* Time */}
              <div className="event-info-item">
                <div className="info-icon">⏰</div>

                <div>
                  <span>Time</span>

                  <strong>{eventTime}</strong>
                </div>
              </div>

              {/* Location */}
              <div className="event-info-item">
                <div className="info-icon">📍</div>

                <div>
                  <span>Location</span>

                  <strong>{eventLocation}</strong>
                </div>
              </div>

              {/* Tickets */}
              <div className="event-info-item">
                <div className="info-icon">🎟️</div>

                <div>
                  <span>Tickets</span>

                  <strong>
                    {quantity} Ticket
                    {quantity > 1 ? "s" : ""}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="ticket-divider">
            <span className="divider-circle left"></span>

            <span className="divider-line"></span>

            <span className="divider-circle right"></span>
          </div>

          {/* Customer + QR */}
          <div className="ticket-bottom">
            <div className="customer-details">
              <div className="detail-row">
                <span>Booking ID</span>

                <strong>{bookingId}</strong>
              </div>

              <div className="detail-row">
                <span>Customer Name</span>

                <strong>{customerName}</strong>
              </div>

              <div className="detail-row">
                <span>Email</span>

                <strong>{customerEmail}</strong>
              </div>

              <div className="detail-row">
                <span>Tickets</span>

                <strong>{quantity}</strong>
              </div>

              <div className="detail-row">
                <span>Payment</span>

                <strong className="payment-confirmed">✓ {paymentStatus}</strong>
              </div>
            </div>

            {/* QR Code */}
            <div className="qr-section">
              <div className="qr-code">
                <div className="qr-box qr-top-left">
                  <span></span>
                </div>

                <div className="qr-box qr-top-right">
                  <span></span>
                </div>

                <div className="qr-box qr-bottom-left">
                  <span></span>
                </div>

                <div className="qr-pattern">
                  {Array.from({ length: 16 }, (_, index) => (
                    <i key={index}></i>
                  ))}
                </div>
              </div>

              <p>Scan at entry</p>
            </div>
          </div>

          {/* Price */}
          <div className="ticket-price-section">
            <div>
              <span>Ticket Price</span>

              <strong>
                ₹{pricePerTicket} × {quantity}
              </strong>
            </div>

            <div className="total-price">
              <span>Total Paid</span>

              <strong>₹{totalPrice}</strong>
            </div>
          </div>
        </div>

        {/* =========================
            BUTTONS
        ========================= */}
        <div className="success-actions">
          <button className="print-btn" onClick={() => window.print()}>
            🖨️ Print Ticket
          </button>

          <Link to="/my-bookings" className="my-bookings-btn">
            🎟️ My Bookings
          </Link>

          <Link to="/events" className="browse-btn">
            Explore More Events
          </Link>
        </div>

        {/* =========================
            IMPORTANT INFORMATION
        ========================= */}
        <div className="important-info">
          <h3>Important Information</h3>

          <div className="important-grid">
            <div>
              <span>✓</span>

              <p>Please carry a valid ID proof along with your ticket.</p>
            </div>

            <div>
              <span>✓</span>

              <p>Show your booking ticket at the event entrance.</p>
            </div>

            <div>
              <span>✓</span>

              <p>Please arrive at least 30 minutes before the event starts.</p>
            </div>

            <div>
              <span>✓</span>

              <p>This ticket is valid only for the selected event and date.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
