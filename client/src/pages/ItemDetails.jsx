import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api, { FALLBACK_IMAGE, formatPrice } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function ItemDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    api.get("/api/items/" + id).then(setItem).catch((err) => setError(err.message));
  }, [id]);

  async function requestToBorrow() {
    if (!user) {
      navigate("/login", { state: { from: "/items/" + id } });
      return;
    }
    setSending(true);
    setError("");
    setMessage("");
    try {
      await api.post("/api/requests", { itemId: id });
      setMessage("Request sent! You can follow its status under My borrowings.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  if (error && !item) return <p className="page-message">{error}</p>;
  if (!item) return <p className="page-message">Loading…</p>;

  const isOwner = user && item.owner && user._id === item.owner._id;

  return (
    <div className="container page">
      <Link to="/browse" className="link">← Back to items</Link>

      <div className="details">
        <img
          className="details-image"
          src={item.image || FALLBACK_IMAGE}
          alt={item.name}
          onError={(e) => (e.target.src = FALLBACK_IMAGE)}
        />

        <div className="details-info">
          <div className="item-card-top">
            <span className="tag">{item.category}</span>
            <span className={"status " + (item.availability ? "available" : "unavailable")}>
              {item.availability ? "Available" : "Currently borrowed"}
            </span>
          </div>
          <h1>{item.name}</h1>
          <p className="details-price">{formatPrice(item.pricePerDay)}</p>
          <p className="details-desc">{item.description}</p>

          <dl className="facts">
            <dt>Location</dt>
            <dd>{item.location}</dd>
            <dt>Owner</dt>
            <dd>{item.owner?.name}</dd>
            <dt>Owner's area</dt>
            <dd>{item.owner?.location}</dd>
          </dl>

          {message && <p className="alert alert-success">{message}</p>}
          {error && <p className="alert alert-error">{error}</p>}

          {isOwner ? (
            <div className="owner-note">
              <p>This is your item, so you can't request it.</p>
              <Link to={"/items/" + item._id + "/edit"} className="btn btn-outline">Edit listing</Link>
            </div>
          ) : (
            <button
              className="btn btn-primary btn-large"
              onClick={requestToBorrow}
              disabled={sending || !item.availability}
            >
              {item.availability ? (sending ? "Sending…" : "Request to borrow") : "Not available right now"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
