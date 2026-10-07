import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminUsers.css";

// LIVE BACKEND
const API_URL = "https://eventhub-34ok.onrender.com";

function AdminUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // ADMIN CHECK + LOAD USERS
  // =========================
  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem("eventHubAdmin"));

    if (!admin) {
      navigate("/admin/login");
      return;
    }

    loadUsers();
  }, [navigate]);

  // =========================
  // LOAD USERS FROM LIVE BACKEND
  // =========================
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/users`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load users");
      }

      console.log("Live Users:", data);

      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Load users error:", error);

      setUsers([]);

      setError(
        "Unable to load users. Please check the live backend connection.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DELETE USER
  // =========================
  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this user?",
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/api/users/${userId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete user");
      }

      // Remove user from UI
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));

      alert("User removed successfully.");
    } catch (error) {
      console.error("Delete user error:", error);

      alert(error.message || "Failed to remove user.");
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("eventHubAdmin");

    navigate("/admin/login");
  };

  // =========================
  // SEARCH
  // =========================
  const filteredUsers = users.filter((user) => {
    const searchText = search.toLowerCase();

    return (
      (user.name || "").toLowerCase().includes(searchText) ||
      (user.email || "").toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="admin-users-page">
      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className="admin-sidebar">
        <div className="admin-logo">🎟️ EventHub</div>

        <nav className="admin-nav">
          <Link to="/admin/dashboard">📊 Dashboard</Link>

          <Link to="/admin/events">🎫 Events</Link>

          <Link to="/admin/events/add">➕ Add Event</Link>

          <Link to="/admin/bookings">📋 Bookings</Link>

          <Link to="/admin/users" className="active">
            👥 Users
          </Link>
        </nav>

        <button className="admin-logout" onClick={handleLogout}>
          🚪 Logout
        </button>
      </aside>

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="admin-users-main">
        <div className="admin-users-header">
          <div>
            <h1>User Management</h1>

            <p>Manage all registered EventHub users</p>
          </div>

          <div className="user-count">
            👥 {loading ? "..." : users.length} Users
          </div>
        </div>

        {/* =========================
            SEARCH
        ========================= */}

        <div className="users-toolbar">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* =========================
            USERS TABLE
        ========================= */}

        <div className="users-table-card">
          {/* ERROR */}

          {error ? (
            <div className="users-empty">
              <div className="empty-icon">⚠️</div>

              <h2>Something Went Wrong</h2>

              <p>{error}</p>

              <button
                onClick={loadUsers}
                style={{
                  marginTop: "15px",
                  padding: "10px 20px",
                  cursor: "pointer",
                  border: "none",
                  borderRadius: "8px",
                }}
              >
                Try Again
              </button>
            </div>
          ) : loading ? (
            /* LOADING */

            <div className="users-empty">
              <div className="empty-icon">⏳</div>

              <h2>Loading Users...</h2>

              <p>Please wait while users are loading.</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            /* NO USERS */

            <div className="users-empty">
              <div className="empty-icon">👥</div>

              <h2>No Users Found</h2>

              <p>No registered users match your search.</p>
            </div>
          ) : (
            /* USERS TABLE */

            <div className="users-table-wrapper">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>#</th>

                    <th>User</th>

                    <th>Email</th>

                    <th>Phone</th>

                    <th>Status</th>

                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user, index) => {
                    const userName = user.name || "User";

                    return (
                      <tr key={user._id}>
                        <td>{index + 1}</td>

                        <td>
                          <div className="user-info">
                            <div className="user-avatar">
                              {userName.charAt(0).toUpperCase()}
                            </div>

                            <div>
                              <strong>{userName}</strong>
                            </div>
                          </div>
                        </td>

                        <td>{user.email || "No email"}</td>

                        <td>{user.phone || "Not provided"}</td>

                        <td>
                          <span className="user-status">● Active</span>
                        </td>

                        <td>
                          <button
                            className="delete-user-btn"
                            onClick={() => handleDelete(user._id)}
                          >
                            🗑️ Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminUsers;
