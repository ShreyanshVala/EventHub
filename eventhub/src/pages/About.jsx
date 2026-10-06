import React from "react";
import { Link } from "react-router-dom";
import "./About.css";

const About = () => {
  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-content">
          <span className="about-badge">ABOUT EVENTHUB</span>

          <h1>
            Making Every Event
            <span> Memorable</span>
          </h1>

          <p>
            EventHub is a modern event discovery and booking platform designed
            to help people discover amazing events and book their tickets
            easily.
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="about-content">
        <div className="about-text">
          <span className="section-label">WHO WE ARE</span>

          <h2>
            Your One-Stop Event
            <span> Platform</span>
          </h2>

          <p>
            EventHub makes it simple to discover events happening around you.
            From technology conferences and business summits to music festivals,
            sports events and workshops, everything is available in one place.
          </p>

          <p>
            Our goal is to provide a simple, fast and user-friendly experience
            for event attendees.
          </p>

          <Link to="/events" className="about-btn">
            Explore Events →
          </Link>
        </div>

        <div className="about-image">
          <div className="about-image-card">
            <div className="big-icon">🎉</div>

            <h3>Discover. Book. Enjoy.</h3>

            <p>Find your next unforgettable experience with EventHub.</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="about-features">
        <div className="section-heading">
          <span className="section-label">WHY EVENTHUB</span>

          <h2>Everything You Need</h2>

          <p>We make event discovery and booking simple.</p>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">🔎</div>

            <h3>Discover Events</h3>

            <p>
              Easily find events based on category, location and your interests.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎟️</div>

            <h3>Easy Booking</h3>

            <p>
              Book tickets through a simple and convenient booking experience.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>

            <h3>Fast Experience</h3>

            <p>
              Enjoy a clean and responsive platform built for a smooth user
              experience.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔐</div>

            <h3>Secure Account</h3>

            <p>Manage your EventHub account and booking information easily.</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="about-stats">
        <div className="stat-card">
          <h2>100+</h2>
          <p>Events</p>
        </div>

        <div className="stat-card">
          <h2>10K+</h2>
          <p>Users</p>
        </div>

        <div className="stat-card">
          <h2>50+</h2>
          <p>Locations</p>
        </div>

        <div className="stat-card">
          <h2>4.9</h2>
          <p>User Rating</p>
        </div>
      </section>
    </div>
  );
};

export default About;
