import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { FALLBACK_IMAGE, formatPrice } from "../api.js";
import RequestList from "../components/RequestList.jsx";

export default function MyItems() {
  const [items, setItems] = useState([]);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  function loadData() {
    Promise.all([api.get("/api/items/mine"), api.get("/api/requests/received")])
      .then(([itemData, requestData]) => {
        setItems(itemData);
        setRequests(requestData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(loadData, []);

  async function toggleAvailability(item) {
    try {
      await api.put("/api/items/" + item._id, { availability: !item.availability });
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteItem(item) {
    if (!window.confirm('Delete "' + item.name + '"? Its requests will be removed too.')) return;
    try {
      await api.del("/api/items/" + item._id);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p className="page-message">Loading…</p>;

  return (
    <div className="container page">
      <div className="section-head">
        <h1>My items</h1>
        <Link to="/list" className="btn btn-primary">List an item</Link>
      </div>
      {error && <p className="alert alert-error">{error}</p>}

      {items.length === 0 ? (
        <p className="empty">You haven't listed any items yet. <Link to="/list">List your first item</Link>.</p>
      ) : (
        <div className="my-items">
          {items.map((item) => {
            const itemRequests = requests.filter((r) => r.item && r.item._id === item._id);
            return (
              <div className="card my-item" key={item._id}>
                <div className="my-item-top">
                  <img
                    src={item.image || FALLBACK_IMAGE}
                    alt={item.name}
                    onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                  />
                  <div className="my-item-info">
                    <h3><Link to={"/items/" + item._id}>{item.name}</Link></h3>
                    <p className="muted">{item.category} · {item.location} · {formatPrice(item.pricePerDay)}</p>
                    <span className={"status " + (item.availability ? "available" : "unavailable")}>
                      {item.availability ? "Available" : "Not available"}
                    </span>
                  </div>
                  <div className="my-item-actions">
                    <button className="btn btn-outline btn-small" onClick={() => toggleAvailability(item)}>
                      {item.availability ? "Mark unavailable" : "Mark available"}
                    </button>
                    <Link to={"/items/" + item._id + "/edit"} className="btn btn-outline btn-small">Edit</Link>
                    <button className="btn btn-danger btn-small" onClick={() => deleteItem(item)}>Delete</button>
                  </div>
                </div>

                <div className="my-item-requests">
                  <h4>Requests ({itemRequests.length})</h4>
                  <RequestList requests={itemRequests} onChange={loadData} showItemName={false} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
