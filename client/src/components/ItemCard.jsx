import { Link } from "react-router-dom";
import { FALLBACK_IMAGE, formatPrice } from "../api.js";

// One item card, used on Home, Browse and Dashboard
export default function ItemCard({ item }) {
  return (
    <article className="card item-card">
      <img
        src={item.image || FALLBACK_IMAGE}
        alt={item.name}
        onError={(e) => (e.target.src = FALLBACK_IMAGE)}
      />
      <div className="item-card-body">
        <div className="item-card-top">
          <span className="tag">{item.category}</span>
          <span className={"status " + (item.availability ? "available" : "unavailable")}>
            {item.availability ? "Available" : "Borrowed"}
          </span>
        </div>
        <h3>{item.name}</h3>
        <p className="item-desc">{item.description}</p>
        <p className="item-meta">
          {item.owner?.name} · {item.location}
        </p>
        <div className="item-card-bottom">
          <strong className="price">{formatPrice(item.pricePerDay)}</strong>
          <Link to={"/items/" + item._id} className="btn btn-outline btn-small">View details</Link>
        </div>
      </div>
    </article>
  );
}
