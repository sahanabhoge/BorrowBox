import { useEffect, useState } from "react";
import api from "../api.js";
import RequestList from "../components/RequestList.jsx";

// All borrowing requests that other people sent for my items
export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  function loadData() {
    api
      .get("/api/requests/received")
      .then(setRequests)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(loadData, []);

  const shown = filter === "All" ? requests : requests.filter((r) => r.status === filter);

  return (
    <div className="container page">
      <h1>Requests received</h1>
      <p className="muted">People who want to borrow your items.</p>
      {error && <p className="alert alert-error">{error}</p>}

      <div className="chips">
        {["All", "Pending", "Accepted", "Rejected", "Returned"].map((s) => (
          <button key={s} className={"chip" + (filter === s ? " active" : "")} onClick={() => setFilter(s)}>
            {s}
          </button>
        ))}
      </div>

      <div className="card">
        {loading ? <p className="empty">Loading…</p> : <RequestList requests={shown} onChange={loadData} />}
      </div>
    </div>
  );
}
