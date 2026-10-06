import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./Booking.css";

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  // =========================
  // LOAD EVENT FROM MONGODB
  // =========================
  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true);

        const response = await fetch(`http://localhost:5000/api/events/${id}`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Event not found");
        }

        // Only Live events can be booked
        if (data.status !== "Live") {
          alert("This event is not available for booking.");

          navigate("/events");
          return;
        }

        setEvent(data);
      } catch (error) {
        console.error("Load event error:", error);

        alert("Event not found!");

        navigate("/events");
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id, navigate]);

  // =========================
  // GET LOGGED-IN USER
  // =========================
  const getLoggedInUser = () => {
    try {
      const savedUser = localStorage.getItem("eventHubLoggedIn");

      if (!savedUser) {
        return null;
      }

      return JSON.parse(savedUser);
    } catch (error) {
      console.error("Login data error:", error);

      return null;
    }
  };

  const loggedInUser = getLoggedInUser();

  // =========================
  // LOADING
  // =========================
  if (loading || !event) {
    return (
      <div className="booking-loading">
        <div className="booking-spinner"></div>

        <p>Loading booking...</p>
      </div>
    );
  }

  // =========================
  // PRICE
  // =========================
  const ticketPrice = Number(event.price) || 0;

  const totalPrice = ticketPrice * quantity;

  // =========================
  // INCREASE QUANTITY
  // =========================
  const increaseQuantity = () => {
    if (quantity < 10) {
      setQuantity((prev) => prev + 1);
    }
  };

  // =========================
  // DECREASE QUANTITY
  // =========================
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // =========================
  // CREATE BOOKING
  // =========================
  const handleBooking = async () => {
    // Login check
    if (!loggedInUser) {
      alert("Please login before booking.");

      navigate("/login");

      return;
    }

    try {
      setBookingLoading(true);

      // Generate booking ID
      const bookingId = "BK" + Date.now();

      // Booking data for MongoDB
      const newBooking = {
        bookingId: bookingId,

        eventId: event._id,

        eventName: event.title,

        customerName: loggedInUser.name || loggedInUser.fullName || "User",

        customerEmail: loggedInUser.email || "",

        customerPhone:
          loggedInUser.phone || loggedInUser.mobile || "Not provided",

        tickets: quantity,

        ticketPrice: ticketPrice,

        totalPrice: totalPrice,

        eventDate: event.date,

        eventLocation: event.location || "",

        status: "Confirmed",
      };

      console.log("BOOKING DATA:", newBooking);

      // =========================
      // SAVE TO MONGODB
      // =========================
      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(newBooking),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Booking failed");
      }

      console.log("BOOKING CREATED:", data);

      // =========================
      // SUCCESS
      // =========================
      alert("Booking successful!");

      navigate(`/booking-success/${data.bookingId}`);
    } catch (error) {
      console.error("Booking Error:", error);

      alert(error.message || "Booking failed. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="booking-page">
      {/* =========================
          HEADER
      ========================= */}
      <section className="booking-header">
        <div className="booking-header-content">
          <span>EVENTHUB BOOKING</span>

          <h1>Complete Your Booking</h1>

          <p>
            Reserve your tickets and get ready for an amazing event experience.
          </p>
        </div>
      </section>

      {/* =========================
          MAIN
      ========================= */}
      <section className="booking-container">
        <div className="booking-layout">
          {/* =========================
              EVENT CARD
          ========================= */}
          <div className="booking-event-card">
            <div className="booking-event-image">
              <img
                src={
                  event.image ||
                  "https://via.placeholder.com/800x500?text=Event"
                }
                alt={event.title}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/800x500?text=Event";
                }}
              />

              <span>{event.category}</span>
            </div>

            <div className="booking-event-content">
              <h2>{event.title}</h2>

              <div className="booking-event-details">
                {/* Date */}
                <div>
                  <span>📅</span>

                  <div>
                    <small>Date</small>

                    <strong>{event.date}</strong>
                  </div>
                </div>

                {/* Time */}
                <div>
                  <span>⏰</span>

                  <div>
                    <small>Time</small>

                    <strong>{event.time || "Not available"}</strong>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <span>📍</span>

                  <div>
                    <small>Location</small>

                    <strong>{event.location || "Not available"}</strong>
                  </div>
                </div>
              </div>

              <Link to={`/events/${event._id}`} className="back-event-link">
                ← Back to Event
              </Link>
            </div>
          </div>

          {/* =========================
              BOOKING CARD
          ========================= */}
          <div className="booking-form-card">
            <h2>Booking Summary</h2>

            {/* User */}
            <div className="booking-user">
              <div className="user-avatar">👤</div>

              <div>
                <small>Booking as</small>

                <strong>
                  {loggedInUser?.name || loggedInUser?.fullName || "Guest User"}
                </strong>

                <span>{loggedInUser?.email || "Please login to continue"}</span>
              </div>
            </div>

            {/* Quantity */}
            <div className="ticket-section">
              <label>Number of Tickets</label>

              <div className="quantity-control">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={quantity === 1}
                >
                  −
                </button>

                <span>{quantity}</span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={quantity === 10}
                >
                  +
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="price-summary">
              <div>
                <span>Ticket Price</span>

                <strong>₹{ticketPrice}</strong>
              </div>

              <div>
                <span>Tickets</span>

                <strong>× {quantity}</strong>
              </div>

              <div className="total-price">
                <span>Total Amount</span>

                <strong>₹{totalPrice}</strong>
              </div>
            </div>

            {/* Confirm */}
            <button
              type="button"
              className="confirm-booking-btn"
              onClick={handleBooking}
              disabled={bookingLoading}
            >
              {bookingLoading ? "Processing..." : "Confirm Booking →"}
            </button>

            <p className="booking-security">
              🔒 Your booking information is securely stored with your account.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Booking;
