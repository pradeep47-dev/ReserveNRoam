import React from "react";
import { useAuth } from "./AuthContext";

export function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="page-shell"><div className="loading">Loading...</div></div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="page-shell">
        <nav className="nav">
          <a className="brand" href="/" aria-label="ReserveNRoam home">
            <span className="brand-mark">R</span>
            <span>Reserve<span className="brand-accent">N</span>Roam</span>
          </a>
        </nav>
        <section className="hero">
          <h1>Access Denied</h1>
          <p>Please log in to access this page.</p>
          <a href="#login" className="button">Go to Login</a>
        </section>
      </div>
    );
  }

  return <>{children}</>;
}
