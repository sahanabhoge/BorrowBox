import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import ItemCard from "../components/ItemCard.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const [myItems, setMyItems] = useState([]);
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [error, setError] = useState("");

  // Statistics are calculated from real data in MongoDB
  useEffect(() => {
    Promise.all([
      api.get("/api/items/mine"),
      api.get("/api/requests/received"),
      api.get("/api/requests/my-requests"),
    ])
      .then(([items, rec, out]) => {
        setMyItems(items);
        setReceived(rec);
        setSent(out);
      })
      .catch((err) => setError(err.message));
  }, []);

  const pending = received.filter((r) => r.status === "Pending").length;

  return (
    <div className="container page">
      <h1>Welcome back, {user.name.split(" ")[0]}</h1>
      <p className="muted">Here is what is happening with your items and requests.</p>
      {error && <p className="alert alert-error">{error}</p>}

      <div className="stats">
        <Link to="/my-items" className="card stat">
          <strong>{myItems.length}</strong>
          <span>Items listed</span>
        </Link>
        <Link to="/requests" className="card stat">
          <strong>{received.length}</strong>
          <span>Incoming requests{pending > 0 ? " (" + pending + " pending)" : ""}</span>
        </Link>
        <Link to="/my-borrowings" className="card stat">
          <strong>{sent.length}</strong>
          <span>Outgoing requests</span>
        </Link>
      </div>

      <div className="quick-actions">
        <Link to="/list" className="btn btn-primary">List a new item</Link>
        <Link to="/browse" className="btn btn-outline">Browse items</Link>
        <Link to="/requests" className="btn btn-outline">Review requests</Link>
      </div>

      <div className="section-head">
        <h2>Your recent items</h2>
        <Link to="/my-items" className="link">Manage all</Link>
      </div>
      {myItems.length === 0 ? (
        <p className="empty">You haven't listed anything yet. <Link to="/list">List your first item</Link>.</p>
      ) : (
        <div className="grid">
          {myItems.slice(0, 3).map((item) => <ItemCard key={item._id} item={item} />)}
        </div>
      )}
    </div>
  );
}
