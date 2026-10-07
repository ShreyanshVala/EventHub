import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./Booking.css";

const API_URL =
  import.meta.env.VITE_API_BASE_URL || "https://eventhub-34ok.onrender.com";

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  // =========================
  // LOAD EVENT
  // =========================
  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true);

        console.log("================================");
        console.log("BOOKING EVENT ID:", id);
        console.log("BOOKING API URL:", `${API_URL}/api/events/${id}`);
        console.log("================================");

        if (!id) {
          throw new Error("Event ID is missing from URL");
        }

        const response = await fetch(`${API_URL}/api/events/${id}`);

        const data = await response.json();

        console.log("EVENT API STATUS:", response.status);
        console.log("EVENT API RESPONSE:", data);

        if (!response.ok) {
          throw new Error(data.message || "Unable to load event");
        }

        if (!data || !data._id) {
          throw new Error("Invalid event data received");
        }

        if (data.status !== "Live") {
          alert("This event is not available for booking.");
          navigate("/events");
          return;
        }

        setEvent(data);
      } catch (error) {
        console.error("LOAD EVENT ERROR:", error);

        alert(error.message || "Event could not be loaded. Please try again.");

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
      console.error("LOGIN DATA ERROR:", error);
      return null;
    }
  };

  const loggedInUser = getLoggedInUser();

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="booking-loading">
        <div className="booking-spinner"></div>
        <p>Loading booking...</p>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  // =========================
  // PRICE
  // =========================
  const ticketPrice = Number(event.price) || 0;
  const totalPrice = ticketPrice * quantity;

  // =========================
  // QUANTITY
  // =========================
  const increaseQuantity = () => {
    if (quantity < 10) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // =========================
  // CREATE BOOKING
  // =========================
  const handleBooking = async () => {
    if (!loggedInUser) {
      alert("Please login before booking.");
      navigate("/login");
      return;
    }

    try {
      setBookingLoading(true);

      const bookingId = "BK" + Date.now();

      const newBooking = {
        bookingId,
        eventId: event._id,
        eventName: event.title,

        customerName: loggedInUser.name || loggedInUser.fullName || "User",

        customerEmail: loggedInUser.email || "",

        customerPhone:
          loggedInUser.phone || loggedInUser.mobile || "Not provided",

        tickets: quantity,
        ticketPrice,
        totalPrice,

        eventDate: event.date,
        eventLocation: event.location || "",

        status: "Confirmed",
      };

      console.log("================================");
      console.log("BOOKING DATA:", newBooking);
      console.log("BOOKING API:", `${API_URL}/api/bookings`);
      console.log("================================");

      const response = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBooking),
      });

      const data = await response.json();

      console.log("BOOKING RESPONSE STATUS:", response.status);
      console.log("BOOKING RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.message || "Booking failed");
      }

      console.log("BOOKING CREATED:", data);

      alert("Booking successful!");

      navigate(`/booking-success/${data.bookingId}`);
    } catch (error) {
      console.error("BOOKING ERROR:", error);

      alert(error.message || "Booking failed. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="booking-page">
      {/* HEADER */}
      <section className="booking-header">
        <div className="booking-header-content">
          <span>EVENTHUB BOOKING</span>

          <h1>Complete Your Booking</h1>

          <p>
            Reserve your tickets and get ready for an amazing event experience.
          </p>
        </div>
      </section>

      {/* MAIN */}
      <section className="booking-container">
        <div className="booking-layout">
          {/* EVENT CARD */}
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
                <div>
                  <span>📅</span>

                  <div>
                    <small>Date</small>
                    <strong>{event.date}</strong>
                  </div>
                </div>

                <div>
                  <span>⏰</span>

                  <div>
                    <small>Time</small>
                    <strong>{event.time || "Not available"}</strong>
                  </div>
                </div>

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

          {/* BOOKING CARD */}
          <div className="booking-form-card">
            <h2>Booking Summary</h2>

            {/* USER */}
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

            {/* QUANTITY */}
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

            {/* PRICE */}
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

            {/* CONFIRM */}
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
