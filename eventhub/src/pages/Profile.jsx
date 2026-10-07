import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Profile.css";

const API_URL = "https://eventhub-34ok.onrender.com";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // =========================
  // LOAD PROFILE + BOOKINGS
  // =========================
  useEffect(() => {
    try {
      const loggedInUser = JSON.parse(localStorage.getItem("eventHubLoggedIn"));

      if (!loggedInUser) {
        navigate("/login");
        return;
      }

      loadProfile(loggedInUser.email);
      loadBookings(loggedInUser.email);
    } catch (error) {
      console.error("Login data error:", error);
      navigate("/login");
    }
  }, [navigate]);

  // =========================
  // LOAD USER FROM MONGODB
  // =========================
  const loadProfile = async (email) => {
    try {
      setLoading(true);

      console.log(
        "PROFILE API:",
        `${API_URL}/api/users/email/${encodeURIComponent(email)}`,
      );

      const response = await fetch(
        `${API_URL}/api/users/email/${encodeURIComponent(email)}`,
      );

      const data = await response.json();

      console.log("PROFILE STATUS:", response.status);
      console.log("PROFILE RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to load profile");
      }

      setUser(data);
      setName(data.name || data.fullName || "");
      setPhone(data.phone || "");
    } catch (error) {
      console.error("Load profile error:", error);

      alert(error.message || "Failed to load profile.");

      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD BOOKINGS FROM MONGODB
  // =========================
  const loadBookings = async (email) => {
    try {
      console.log(
        "PROFILE BOOKINGS API:",
        `${API_URL}/api/bookings/user/${encodeURIComponent(email)}`,
      );

      const response = await fetch(
        `${API_URL}/api/bookings/user/${encodeURIComponent(email)}`,
      );

      const data = await response.json();

      console.log("PROFILE BOOKINGS STATUS:", response.status);
      console.log("PROFILE BOOKINGS RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to load bookings");
      }

      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Load bookings error:", error);
      setBookings([]);
    }
  };

  // =========================
  // SAVE PROFILE
  // =========================
  const handleSaveProfile = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      alert("Please enter your name.");
      return;
    }

    if (!user?._id) {
      alert("User information not found.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`${API_URL}/api/users/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          phone: phone.trim(),
        }),
      });

      const data = await response.json();

      console.log("UPDATE PROFILE STATUS:", response.status);
      console.log("UPDATE PROFILE RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      const updatedUser = data.user || data;

      // Update React state
      setUser(updatedUser);
      setName(updatedUser.name || "");
      setPhone(updatedUser.phone || "");

      // Update current login session
      const loggedInUser = JSON.parse(localStorage.getItem("eventHubLoggedIn"));

      if (loggedInUser) {
        const updatedLoggedInUser = {
          ...loggedInUser,
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone || "",
          role: updatedUser.role || "user",
        };

        localStorage.setItem(
          "eventHubLoggedIn",
          JSON.stringify(updatedLoggedInUser),
        );
      }

      setIsEditing(false);

      // Refresh Navbar
      window.dispatchEvent(new Event("authChanged"));

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Update profile error:", error);

      alert(error.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("eventHubLoggedIn");

    window.dispatchEvent(new Event("authChanged"));

    navigate("/login");
  };

  // =========================
  // LOADING
  // =========================
  if (loading || !user) {
    return (
      <div className="profile-loading">
        <div className="profile-spinner"></div>

        <p>Loading profile...</p>
      </div>
    );
  }

  const userName = user.name || user.fullName || "User";

  const userEmail = user.email || "No email";

  const totalBookings = bookings.length;

  const totalSpent = bookings.reduce(
    (total, booking) => total + (Number(booking.totalPrice) || 0),
    0,
  );

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Not available";

  const firstLetter = userName.charAt(0).toUpperCase();

  return (
    <div className="profile-page">
      {/* PAGE HEADER */}
      <section className="profile-header">
        <div className="profile-header-content">
          <span className="profile-label">EVENTHUB ACCOUNT</span>

          <h1>My Profile</h1>

          <p>Manage your account information and view your booking activity.</p>
        </div>
      </section>

      {/* PROFILE CONTENT */}
      <main className="profile-container">
        {/* PROFILE TOP CARD */}
        <div className="profile-card profile-main-card">
          <div className="profile-avatar">{firstLetter}</div>

          <div className="profile-main-info">
            <h2>{userName}</h2>

            <p>{userEmail}</p>

            <span className="profile-status">✓ Active Account</span>
          </div>

          <button
            className="edit-profile-btn"
            onClick={() => setIsEditing(!isEditing)}
          >
            ✏️ {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* EDIT PROFILE */}
        {isEditing && (
          <div className="profile-card edit-profile-card">
            <div className="section-heading">
              <div>
                <span>PERSONAL INFORMATION</span>

                <h2>Edit Profile</h2>
              </div>
            </div>

            <div className="profile-form">
              <div className="profile-form-group">
                <label>Full Name</label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>

              <div className="profile-form-group">
                <label>Email Address</label>

                <input type="email" value={userEmail} disabled />

                <small>Email address cannot be changed here.</small>
              </div>

              <div className="profile-form-group">
                <label>Phone Number</label>

                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div className="profile-form-actions">
              <button
                className="cancel-profile-btn"
                onClick={() => {
                  setName(userName);
                  setPhone(user.phone || "");
                  setIsEditing(false);
                }}
              >
                Cancel
              </button>

              <button
                className="save-profile-btn"
                onClick={handleSaveProfile}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}

        {/* INFORMATION + STATS */}
        <div className="profile-grid">
          {/* PERSONAL INFORMATION */}
          <div className="profile-card">
            <div className="section-heading">
              <div>
                <span>ACCOUNT</span>

                <h2>Personal Information</h2>
              </div>
            </div>

            <div className="info-list">
              <div className="info-item">
                <div className="info-icon">👤</div>

                <div>
                  <span>Name</span>

                  <strong>{userName}</strong>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">✉️</div>

                <div>
                  <span>Email</span>

                  <strong>{userEmail}</strong>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">📞</div>

                <div>
                  <span>Phone</span>

                  <strong>{user.phone || "Not provided"}</strong>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">📅</div>

                <div>
                  <span>Member Since</span>

                  <strong>{memberSince}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* ACCOUNT STATS */}
          <div className="profile-card">
            <div className="section-heading">
              <div>
                <span>ACTIVITY</span>

                <h2>Account Statistics</h2>
              </div>
            </div>

            <div className="profile-stats">
              <div className="profile-stat">
                <div className="stat-icon">🎫</div>

                <div>
                  <span>Total Bookings</span>

                  <strong>{totalBookings}</strong>
                </div>
              </div>

              <div className="profile-stat">
                <div className="stat-icon">💰</div>

                <div>
                  <span>Total Spent</span>

                  <strong>₹{totalSpent.toLocaleString("en-IN")}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="profile-card quick-actions-card">
          <div className="section-heading">
            <div>
              <span>QUICK ACTIONS</span>

              <h2>Manage Your Account</h2>
            </div>
          </div>

          <div className="quick-actions">
            <Link to="/my-bookings" className="quick-action">
              <div className="quick-action-icon">🎫</div>

              <div>
                <strong>My Bookings</strong>

                <span>View your event bookings</span>
              </div>

              <b>→</b>
            </Link>

            <Link to="/events" className="quick-action">
              <div className="quick-action-icon">🔍</div>

              <div>
                <strong>Explore Events</strong>

                <span>Find your next event</span>
              </div>

              <b>→</b>
            </Link>

            <button
              className="quick-action logout-action"
              onClick={handleLogout}
            >
              <div className="quick-action-icon">🚪</div>

              <div>
                <strong>Logout</strong>

                <span>Sign out of your account</span>
              </div>

              <b>→</b>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;
