import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { FALLBACK_IMAGE, formatDate, formatPrice } from "../api.js";

const STATUS_HELP = {
  Pending: "Waiting for the owner to respond.",
  Accepted: "Approved. Contact the owner to collect the item.",
  Rejected: "The owner declined this request.",
  Returned: "You returned this item. Thank you!",
};

export default function MyBorrowings() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/requests/my-requests")
      .then(setRequests)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="page-message">Loading…</p>;

  return (
    <div className="container page">
      <h1>My borrowings</h1>
      <p className="muted">Items you have asked to borrow.</p>
      {error && <p className="alert alert-error">{error}</p>}

      {requests.length === 0 ? (
        <p className="empty">You haven't requested anything yet. <Link to="/browse">Browse items</Link>.</p>
      ) : (
        <div className="borrowings">
          {requests.map((r) => (
            <div className="card borrowing" key={r._id}>
              {r.item ? (
                <img
                  src={r.item.image || FALLBACK_IMAGE}
                  alt={r.item.name}
                  onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                />
              ) : (
                <img src={FALLBACK_IMAGE} alt="Removed item" />
              )}
              <div className="borrowing-info">
                <h3>{r.item ? <Link to={"/items/" + r.item._id}>{r.item.name}</Link> : "Item removed"}</h3>
                {r.item && <p className="muted">{r.item.category} · {formatPrice(r.item.pricePerDay)}</p>}
                <p>
                  Owner: <strong>{r.owner?.name}</strong> · {r.owner?.location}
                </p>
                <p className="muted">{r.owner?.email} · requested on {formatDate(r.createdAt)}</p>
              </div>
              <div className="borrowing-status">
                <span className={"badge badge-" + r.status.toLowerCase()}>{r.status}</span>
                <p className="muted">{STATUS_HELP[r.status]}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
