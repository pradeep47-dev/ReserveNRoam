import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";

type ApiStatus = "checking" | "online" | "offline";

export default function App() {
  const [apiStatus, setApiStatus] = useState<ApiStatus>("checking");

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
