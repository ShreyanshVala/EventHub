import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Events.css";

const API_URL =
  import.meta.env.VITE_API_BASE_URL || "https://eventhub-34ok.onrender.com";

const categories = [
  "All",
  "Technology",
  "Music",
  "Sports",
  "Business",
  "Education",
  "Entertainment",
];

function Events() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load events from Render Backend + MongoDB
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/events`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        console.log("Events received from backend:", data);

        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          setEvents([]);
          throw new Error("Invalid events data received from backend");
        }
      } catch (err) {
        console.error("Error loading events:", err);

        setError("Unable to load events from server. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // Retry
  const handleRetry = () => {
    window.location.reload();
  };

  // Only Live Events
  const liveEvents = events.filter((event) => event.status === "Live");

  // Search + Category Filter
  const filteredEvents = liveEvents.filter((event) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      event.title?.toLowerCase().includes(searchText) ||
      event.location?.toLowerCase().includes(searchText) ||
      event.category?.toLowerCase().includes(searchText);

    const matchesCategory = category === "All" || event.category === category;

    return matchesSearch && matchesCategory;
  });

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
  };

  // Loading UI
  if (loading) {
    return (
      <div className="events-page">
        <section className="events-loading">
          <div className="loading-spinner"></div>

          <h2>Loading Events...</h2>

          <p>Please wait while we load the latest events.</p>
        </section>
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
      <div className="events-page">
        <section className="events-error">
          <div className="error-icon">⚠️</div>

          <h2>Something Went Wrong</h2>

          <p>{error}</p>

          <button onClick={handleRetry} className="retry-btn">
            Try Again
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="events-page">
      {/* Header */}
      <section className="events-header">
        <div className="events-header-content">
          <span>EVENTHUB EVENTS</span>

          <h1>Discover Events</h1>

          <p>
            Find the best events, concerts, workshops and experiences happening
            near you.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="filters-section">
        <div className="filters-container">
          {/* Search */}
          <div className="events-search">
            <span>🔍</span>

            <input
              type="text"
              placeholder="Search events or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Category */}
          <div className="category-filter">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="all-events-section">
        <div className="events-top">
          <h2>{category === "All" ? "All Events" : `${category} Events`}</h2>

          <span>{filteredEvents.length} events found</span>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="all-events-grid">
            {filteredEvents.map((event) => (
              <div className="event-card" key={event._id}>
                {/* Image */}
                <div className="event-image-container">
                  <img
                    src={
                      event.image ||
                      "https://via.placeholder.com/800x500?text=Event"
                    }
                    alt={event.title}
                    className="event-image"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/800x500?text=Event";
                    }}
                  />

                  <span className="event-category">{event.category}</span>
                </div>

                {/* Content */}
                <div className="event-content">
                  <h3>{event.title}</h3>

                  <div className="event-info">
                    <p>📅 {event.date || "Date not available"}</p>

                    <p>⏰ {event.time || "Time not available"}</p>

                    <p>📍 {event.location || "Location not available"}</p>
                  </div>

                  {/* Footer */}
                  <div className="event-footer">
                    <div className="price">
                      <small>Starting from</small>

                      <strong>₹{Number(event.price || 0)}</strong>
                    </div>

                    <Link
                      to={`/events/${event._id}`}
                      className="view-event-btn"
                    >
                      View Event
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-events">
            <div>🔎</div>

            <h3>No Events Found</h3>

            <p>Try searching for another event or category.</p>

            <button onClick={clearFilters}>Clear Filters</button>
          </div>
        )}
      </section>
    </div>
  );
}

export default Events;
