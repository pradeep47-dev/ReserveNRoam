import React, { useState } from "react";
import { useAuth } from "./AuthContext";

export function LoginPage({ onSuccess }: { onSuccess?: () => void }) {
  const { login, register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegisterMode) {
        await register(email, password, firstName, lastName);
      } else {
        await login(email, password);
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        // Redirect to home page after successful login
        window.location.href = "/";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-shell">
      <nav className="nav">
        <a className="brand" href="/" aria-label="ReserveNRoam home">
          <span className="brand-mark">R</span>
          <span>Reserve<span className="brand-accent">N</span>Roam</span>
        </a>
      </nav>

      <section className="hero">
        <h1>{isRegisterMode ? "Create Account" : "Login"}</h1>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegisterMode && (
            <>
              <div className="form-group">
                <label htmlFor="firstName">First Name (optional)</label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name (optional)</label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="button">
            {loading ? "Loading..." : isRegisterMode ? "Create Account" : "Login"}
          </button>
        </form>

        <div className="auth-toggle">
          <span>
            {isRegisterMode ? "Already have an account? " : "Don't have an account? "}
            <button
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setError("");
              }}
              className="link-button"
            >
              {isRegisterMode ? "Login" : "Register"}
            </button>
          </span>
        </div>
      </section>
    </main>
  );
}
