import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "./AuthContext";
import { LoginPage } from "./LoginPage";
import { ProfilePage } from "./ProfilePage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";

type ApiStatus = "checking" | "online" | "offline";
type Page = "home" | "login" | "profile";

function HomePage() {
  const [apiStatus, setApiStatus] = useState<ApiStatus>("checking");
  const { user, logout } = useAuth();

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/health`)
      .then((response) => {
        if (!response.ok) throw new Error("API unavailable");
        return response.json();
      })
      .then(() => setApiStatus("online"))
      .catch(() => setApiStatus("offline"));
  }, []);

  return (
    <main className="page-shell">
      <nav className="nav">
        <a className="brand" href="/" aria-label="ReserveNRoam home">
          <span className="brand-mark">R</span>
          <span>Reserve<span className="brand-accent">N</span>Roam</span>
        </a>
        <span className="nav-caption">Your next outdoor escape starts here</span>
        <div className="nav-actions">
          {user ? (
            <>
              <a href="#profile" className="nav-link">My Profile</a>
              <button onClick={logout} className="nav-link">Logout</button>
            </>
          ) : (
            <a href="#login" className="nav-link">Login</a>
          )}
        </div>
      </nav>

      <section className="hero">
        <p className="eyebrow">THE OUTDOORS, MADE BOOKABLE</p>
        <h1>Find your spot.<br /><span>Book your escape.</span></h1>
        <p className="intro">
          Discover campsites, cabins, parks, and recreation areas.
          Find a place that fits your plans.
        </p>

        <form className="search-panel" onSubmit={(event) => event.preventDefault()}>
          <label>
            Where
            <input type="text" placeholder="Location, park, or destination" />
          </label>
          <label>
            Check in
            <input type="date" aria-label="Check-in date" />
          </label>
          <label>
            Check out
            <input type="date" aria-label="Check-out date" />
          </label>
          <button type="submit">Explore spots</button>
        </form>

        <div className="categories" aria-label="Explore accommodation types">
          {["Campsites", "Cabins", "Parks", "Recreation areas"].map((item) => (
            <span className="category" key={item}>{item}</span>
          ))}
        </div>
      </section>

      <footer className="footer">
        <span>ReserveNRoam · Discover more outside.</span>
        <span className={`api-status ${apiStatus}`}>
          <span className="status-dot" />
          API {apiStatus}
        </span>
      </footer>
    </main>
  );
}

function AppRouter() {
  const [page, setPage] = useState<Page>(() => {
    // Determine initial page from URL hash or pathname
    const hash = window.location.hash.slice(1) || "home";
    if (hash === "login") return "login";
    if (hash === "profile") return "profile";
    return "home";
  });

  // Handle browser navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || "home";
      if (hash === "login") setPage("login");
      else if (hash === "profile") setPage("profile");
      else setPage("home");
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Update URL when page changes
  useEffect(() => {
    if (page === "home") {
      window.location.hash = "";
    } else {
      window.location.hash = page;
    }
  }, [page]);

  return (
    <>
      {page === "home" && <HomePage />}
      {page === "login" && (
        <LoginPage
          onSuccess={() => {
            setPage("home");
            window.location.hash = "";
          }}
        />
      )}
      {page === "profile" && <ProfilePage />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
