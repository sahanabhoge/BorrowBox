import { useState } from "react";
import { Link } from "react-router-dom";
import api, { formatDate } from "../api.js";

// Shows requests received by the owner, with Accept / Reject / Mark returned buttons.
// "requests" comes from the parent page; "onChange" reloads the data after an update.
export default function RequestList({ requests, onChange, showItemName = true }) {
  const [error, setError] = useState("");

  async function updateStatus(id, status) {
    setError("");
    try {
      await api.put("/api/requests/" + id + "/status", { status });
      onChange();
    } catch (err) {
      setError(err.message);
    }
  }

  if (requests.length === 0) {
    return <p className="empty">No requests yet.</p>;
  }

  return (
    <div className="request-list">
      {error && <p className="alert alert-error">{error}</p>}
      {requests.map((r) => (
        <div className="request-row" key={r._id}>
          <div className="request-info">
            {showItemName && r.item && (
              <Link to={"/items/" + r.item._id} className="request-item">{r.item.name}</Link>
            )}
            <p>
              <strong>{r.borrower?.name}</strong> · {r.borrower?.location}
            </p>
            <p className="muted">{r.borrower?.email} · requested on {formatDate(r.createdAt)}</p>
          </div>
          <div className="request-actions">
            <span className={"badge badge-" + r.status.toLowerCase()}>{r.status}</span>
            {r.status === "Pending" && (
              <>
                <button className="btn btn-primary btn-small" onClick={() => updateStatus(r._id, "Accepted")}>Accept</button>
                <button className="btn btn-outline btn-small" onClick={() => updateStatus(r._id, "Rejected")}>Reject</button>
              </>
            )}
            {r.status === "Accepted" && (
              <button className="btn btn-outline btn-small" onClick={() => updateStatus(r._id, "Returned")}>Mark as returned</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
