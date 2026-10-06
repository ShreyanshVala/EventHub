import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AddEvent.css";

const AddEvent = () => {
  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem("eventHubAdmin"));

  const [formData, setFormData] = useState({
    title: "",
    category: "Music",
    date: "",
    time: "",
    location: "",
    price: "",
    image: "",
    description: "",
    status: "Live",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  // Admin check
  if (!admin) {
    return (
      <div className="admin-page-message">
        <h2>Admin Login Required</h2>
        <Link to="/admin/login">Go to Admin Login</Link>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Validation
    if (!formData.title.trim()) {
      setError("Please enter event name.");
      return;
    }

    if (!formData.date) {
      setError("Please select event date.");
      return;
    }

    if (!formData.time) {
      setError("Please select event time.");
      return;
    }

    if (!formData.location.trim()) {
      setError("Please enter event location.");
      return;
    }

    if (!formData.price || Number(formData.price) < 0) {
      setError("Please enter a valid event price.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Please enter event description.");
      return;
    }

    try {
      setSaving(true);

      // Send event to Backend
      const response = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          category: formData.category,
          date: formData.date,
          time: formData.time,
          location: formData.location.trim(),
          price: Number(formData.price),
          image: formData.image.trim(),
          description: formData.description.trim(),
          status: formData.status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add event");
      }

      console.log("Event created:", data);

      setSuccess("Event added successfully!");

      // Go to Admin Events page
      setTimeout(() => {
        navigate("/admin/events");
      }, 800);
    } catch (err) {
      console.error("Add event error:", err);

      setError(
        err.message ||
          "Unable to add event. Please make sure the backend is running.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="add-event-page">
      {/* Header */}
      <div className="add-event-topbar">
        <div>
          <span className="add-event-label">EVENT MANAGEMENT</span>

          <h1>Add New Event</h1>

          <p>Create a new event and publish it for users.</p>
        </div>

        <Link to="/admin/dashboard" className="back-dashboard-btn">
          ← Dashboard
        </Link>
      </div>

      {/* Form */}
      <div className="add-event-card">
        <form onSubmit={handleSubmit}>
          {/* Messages */}
          {error && <div className="add-event-error">⚠️ {error}</div>}

          {success && <div className="add-event-success">✓ {success}</div>}

          {/* Basic Information */}
          <div className="form-section">
            <div className="form-section-title">
              <span>01</span>

              <div>
                <h2>Basic Information</h2>
                <p>Enter the basic details of your event.</p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group full-width">
                <label>
                  Event Name <span>*</span>
                </label>

                <input
                  type="text"
                  name="title"
                  placeholder="Enter event name"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>
                  Category <span>*</span>
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="Music">Music</option>
                  <option value="Technology">Technology</option>
                  <option value="Sports">Sports</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Business">Business</option>
                  <option value="Education">Education</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  Ticket Price <span>*</span>
                </label>

                <div className="price-input">
                  <span>₹</span>

                  <input
                    type="number"
                    name="price"
                    placeholder="999"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Date & Location */}
          <div className="form-section">
            <div className="form-section-title">
              <span>02</span>

              <div>
                <h2>Date & Location</h2>
                <p>Tell users when and where the event happens.</p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>
                  Event Date <span>*</span>
                </label>

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>
                  Event Time <span>*</span>
                </label>

                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group full-width">
                <label>
                  Location / Place <span>*</span>
                </label>

                <input
                  type="text"
                  name="location"
                  placeholder="e.g. Ahmedabad Convention Centre"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="form-section">
            <div className="form-section-title">
              <span>03</span>

              <div>
                <h2>Event Image</h2>
                <p>Add an image URL for your event.</p>
              </div>
            </div>

            <div className="form-group">
              <label>Image URL</label>

              <input
                type="url"
                name="image"
                placeholder="https://example.com/event-image.jpg"
                value={formData.image}
                onChange={handleChange}
              />

              <small className="input-help">
                Use a public image URL from Unsplash or another image hosting
                service.
              </small>
            </div>
          </div>

          {/* Description */}
          <div className="form-section">
            <div className="form-section-title">
              <span>04</span>

              <div>
                <h2>Event Description</h2>
                <p>Give users more information about your event.</p>
              </div>
            </div>

            <div className="form-group">
              <label>
                Description <span>*</span>
              </label>

              <textarea
                name="description"
                rows="6"
                placeholder="Write a detailed description about your event..."
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          {/* Status */}
          <div className="form-section">
            <div className="form-section-title">
              <span>05</span>

              <div>
                <h2>Event Status</h2>
                <p>Choose whether the event should be visible to users.</p>
              </div>
            </div>

            <div className="status-options">
              <label
                className={`status-option ${
                  formData.status === "Live" ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="Live"
                  checked={formData.status === "Live"}
                  onChange={handleChange}
                />

                <div>
                  <strong>🟢 Live</strong>
                  <span>Event will be visible to users.</span>
                </div>
              </label>

              <label
                className={`status-option ${
                  formData.status === "Draft" ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="Draft"
                  checked={formData.status === "Draft"}
                  onChange={handleChange}
                />

                <div>
                  <strong>📝 Draft</strong>
                  <span>Event will not be shown to users.</span>
                </div>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="add-event-actions">
            <Link to="/admin/dashboard" className="cancel-event-btn">
              Cancel
            </Link>

            <button type="submit" className="save-event-btn" disabled={saving}>
              {saving ? "Saving..." : "✓ Save Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEvent;
