import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./EditEvent.css";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // CHECK ADMIN + LOAD EVENT
  // =========================
  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem("eventHubAdmin"));

    if (!admin) {
      navigate("/admin/login");
      return;
    }

    loadEvent();
  }, [id, navigate]);

  // =========================
  // LOAD EVENT FROM MONGODB
  // =========================
  const loadEvent = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`http://localhost:5000/api/events/${id}`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Event not found");
      }

      setFormData({
        title: data.title || "",
        category: data.category || "Music",
        date: data.date || "",
        time: data.time || "",
        location: data.location || "",
        price: data.price ?? "",
        image: data.image || "",
        description: data.description || "",
        status: data.status || "Live",
      });
    } catch (err) {
      console.error("Load event error:", err);

      setError(
        "Unable to load event. Please make sure the event exists and backend is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // =========================
  // UPDATE EVENT IN MONGODB
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

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

    if (formData.price === "" || Number(formData.price) < 0) {
      setError("Please enter a valid price.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Please enter event description.");
      return;
    }

    try {
      setUpdating(true);

      const response = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: "PUT",

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
        throw new Error(data.message || "Failed to update event");
      }

      alert("Event updated successfully!");

      navigate("/admin/events");
    } catch (err) {
      console.error("Update event error:", err);

      setError(
        err.message ||
          "Unable to update event. Please make sure backend is running.",
      );
    } finally {
      setUpdating(false);
    }
  };

  // =========================
  // LOADING SCREEN
  // =========================
  if (loading) {
    return (
      <div className="edit-event-page">
        <div className="edit-event-card">
          <h2>Loading Event...</h2>

          <p>Please wait while event details are loading.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-event-page">
      {/* =========================
          TOP BAR
      ========================= */}
      <div className="edit-event-topbar">
        <div>
          <span>EVENT MANAGEMENT</span>

          <h1>Edit Event</h1>

          <p>Update your event information and status.</p>
        </div>

        <Link to="/admin/events" className="back-events-btn">
          ← Back to Events
        </Link>
      </div>

      {/* =========================
          FORM CARD
      ========================= */}
      <div className="edit-event-card">
        <form onSubmit={handleSubmit}>
          {/* ERROR */}
          {error && <div className="edit-error">⚠️ {error}</div>}

          {/* =========================
              BASIC INFORMATION
          ========================= */}
          <div className="edit-section">
            <div className="edit-section-title">
              <span>01</span>

              <div>
                <h2>Basic Information</h2>

                <p>Update the basic details of your event.</p>
              </div>
            </div>

            <div className="edit-grid">
              {/* Event Name */}
              <div className="edit-form-group full">
                <label>
                  Event Name <b>*</b>
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Event name"
                />
              </div>

              {/* Category */}
              <div className="edit-form-group">
                <label>
                  Category <b>*</b>
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

                  <option value="Workshop">Workshop</option>

                  <option value="Education">Education</option>

                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Price */}
              <div className="edit-form-group">
                <label>
                  Ticket Price <b>*</b>
                </label>

                <div className="edit-price-input">
                  <span>₹</span>

                  <input
                    type="number"
                    name="price"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* =========================
              DATE & LOCATION
          ========================= */}
          <div className="edit-section">
            <div className="edit-section-title">
              <span>02</span>

              <div>
                <h2>Date & Location</h2>

                <p>Update when and where the event takes place.</p>
              </div>
            </div>

            <div className="edit-grid">
              {/* Date */}
              <div className="edit-form-group">
                <label>
                  Event Date <b>*</b>
                </label>

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>

              {/* Time */}
              <div className="edit-form-group">
                <label>
                  Event Time <b>*</b>
                </label>

                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                />
              </div>

              {/* Location */}
              <div className="edit-form-group full">
                <label>
                  Location <b>*</b>
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Event location"
                />
              </div>
            </div>
          </div>

          {/* =========================
              IMAGE
          ========================= */}
          <div className="edit-section">
            <div className="edit-section-title">
              <span>03</span>

              <div>
                <h2>Event Image</h2>

                <p>Update the event image URL.</p>
              </div>
            </div>

            <div className="edit-form-group">
              <label>Image URL</label>

              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />

              {formData.image && (
                <div className="image-preview">
                  <img
                    src={formData.image}
                    alt="Event Preview"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* =========================
              DESCRIPTION
          ========================= */}
          <div className="edit-section">
            <div className="edit-section-title">
              <span>04</span>

              <div>
                <h2>Description</h2>

                <p>Update information about your event.</p>
              </div>
            </div>

            <div className="edit-form-group">
              <label>
                Description <b>*</b>
              </label>

              <textarea
                name="description"
                rows="6"
                value={formData.description}
                onChange={handleChange}
                placeholder="Event description..."
              />
            </div>
          </div>

          {/* =========================
              STATUS
          ========================= */}
          <div className="edit-section">
            <div className="edit-section-title">
              <span>05</span>

              <div>
                <h2>Event Status</h2>

                <p>Choose whether users can see this event.</p>
              </div>
            </div>

            <div className="edit-status-options">
              {/* LIVE */}
              <label
                className={
                  formData.status === "Live"
                    ? "edit-status selected"
                    : "edit-status"
                }
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

                  <span>Event is visible to users.</span>
                </div>
              </label>

              {/* DRAFT */}
              <label
                className={
                  formData.status === "Draft"
                    ? "edit-status selected"
                    : "edit-status"
                }
              >
                <input
                  type="radio"
                  name="status"
                  value="Draft"
                  checked={formData.status === "Draft"}
                  onChange={handleChange}
                />

                <div>
                  <strong>🟡 Draft</strong>

                  <span>Event is hidden from users.</span>
                </div>
              </label>
            </div>
          </div>

          {/* =========================
              BUTTONS
          ========================= */}
          <div className="edit-event-actions">
            <Link to="/admin/events" className="cancel-edit-btn">
              Cancel
            </Link>

            <button
              type="submit"
              className="update-event-btn"
              disabled={updating}
            >
              {updating ? "Updating..." : "✓ Update Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;
