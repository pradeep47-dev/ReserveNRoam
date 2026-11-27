import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { ProtectedRoute } from "./ProtectedRoute";

export function ProfilePage() {
  const { user, logout, updateProfile } = useAuth();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await updateProfile(firstName, lastName);
      setSuccess("Profile updated successfully!");
      setEditing(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    logout();
    window.location.href = "/";
  }

  return (
    <ProtectedRoute>
      <main className="page-shell">
        <nav className="nav">
          <a className="brand" href="/" aria-label="ReserveNRoam home">
            <span className="brand-mark">R</span>
            <span>Reserve<span className="brand-accent">N</span>Roam</span>
          </a>
          <span className="nav-caption">Your Profile</span>
        </nav>

        <section className="hero">
          <div className="profile-container">
            <h1>Welcome, {user?.firstName || user?.email}!</h1>

            {success && <div className="success-message">{success}</div>}
            {error && <div className="error-message">{error}</div>}

            <div className="profile-card">
              <div className="profile-info">
                <div className="info-row">
                  <span className="label">Email:</span>
                  <span className="value">{user?.email}</span>
                </div>

                <div className="info-row">
                  <span className="label">First Name:</span>
                  <span className="value">{user?.firstName || "Not set"}</span>
                </div>

                <div className="info-row">
                  <span className="label">Last Name:</span>
                  <span className="value">{user?.lastName || "Not set"}</span>
                </div>

                <div className="info-row">
                  <span className="label">Member Since:</span>
                  <span className="value">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>

              {editing ? (
                <form className="profile-form" onSubmit={handleSave}>
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter first name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter last name"
                    />
                  </div>

                  <div className="form-actions">
                    <button
                      type="submit"
                      disabled={loading}
                      className="button button-primary"
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setFirstName(user?.firstName || "");
                        setLastName(user?.lastName || "");
                        setError("");
                      }}
                      className="button button-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="profile-actions">
                  <button
                    onClick={() => setEditing(true)}
                    className="button button-primary"
                  >
                    Edit Profile
                  </button>
                </div>
              )}
            </div>

            <div className="profile-footer">
              <button
                onClick={handleLogout}
                className="button button-danger"
              >
                Logout
              </button>
            </div>
          </div>
        </section>

        <footer className="footer">
          <span>ReserveNRoam · Discover more outside.</span>
        </footer>
      </main>
    </ProtectedRoute>
  );
}
