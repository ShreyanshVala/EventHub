import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const events = [
  {
    id: 1,
    title: "Tech Conference 2026",
    date: "Oct 15, 2026",
    location: "Ahmedabad, Gujarat",
    category: "Technology",
    price: "₹499",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Live Music Festival",
    date: "Oct 20, 2026",
    location: "Mumbai, Maharashtra",
    category: "Music",
    price: "₹799",
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Startup & Business Summit",
    date: "Nov 05, 2026",
    location: "Bangalore, Karnataka",
    category: "Business",
    price: "₹999",
    image:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80",
  },
];

const categories = [
  {
    name: "Technology",
    icon: "💻",
  },
  {
    name: "Music",
    icon: "🎵",
  },
  {
    name: "Sports",
    icon: "⚽",
  },
  {
    name: "Business",
    icon: "💼",
  },
  {
    name: "Education",
    icon: "🎓",
  },
  {
    name: "Entertainment",
    icon: "🎬",
  },
];

function Home() {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">🎉 Discover What's Happening</span>

          <h1>
            Discover Amazing
            <span> Events Near You</span>
          </h1>

          <p>
            Find concerts, conferences, workshops, sports events and more. Book
            your tickets easily with EventHub.
          </p>

          <div className="hero-buttons">
            <Link to="/events" className="primary-btn">
              Explore Events →
            </Link>

            <a href="#categories" className="secondary-btn">
              Browse Categories
            </a>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="search-section">
        <div className="search-box">
          <div className="search-input">
            <span>🔍</span>
            <input type="text" placeholder="Search for events..." />
          </div>

          <div className="location-input">
            <span>📍</span>
            <input type="text" placeholder="City or location" />
          </div>

          <button className="search-btn">Search</button>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section" id="categories">
        <div className="section-header">
          <div>
            <span className="section-label">EXPLORE</span>
            <h2>Browse Categories</h2>
          </div>

          <Link to="/events" className="view-link">
            View All →
          </Link>
        </div>

        <div className="categories-grid">
          {categories.map((category) => (
            <Link
              to={`/events?category=${category.name}`}
              className="category-card"
              key={category.name}
            >
              <div className="category-icon">{category.icon}</div>

              <h3>{category.name}</h3>

              <span>Explore events →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Events */}
      <section className="events-section">
        <div className="section-header">
          <div>
            <span className="section-label">DON'T MISS OUT</span>
            <h2>Featured Events</h2>
          </div>

          <Link to="/events" className="view-link">
            View All Events →
          </Link>
        </div>

        <div className="events-grid">
          {events.map((event) => (
            <div className="event-card" key={event.id}>
              <div className="event-image-container">
                <img
                  src={event.image}
                  alt={event.title}
                  className="event-image"
                />

                <span className="event-category">{event.category}</span>
              </div>

              <div className="event-content">
                <h3>{event.title}</h3>

                <div className="event-info">
                  <p>📅 {event.date}</p>
                  <p>📍 {event.location}</p>
                </div>

                <div className="event-footer">
                  <div>
                    <small>Starting from</small>
                    <strong>{event.price}</strong>
                  </div>

                  <Link to={`/events/${event.id}`} className="book-btn">
                    View Event
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <span>🎟️ EVENT ORGANIZERS</span>

          <h2>Have an event to organize?</h2>

          <p>
            Create your event and reach thousands of people looking for amazing
            experiences.
          </p>

          <button className="cta-btn">Create Your Event →</button>
        </div>
      </section>
    </div>
  );
}

export default Home;
