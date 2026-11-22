import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api, { CATEGORIES } from "../api.js";
import ItemCard from "../components/ItemCard.jsx";

export default function Browse() {
  const [params] = useSearchParams();

  // Filters start from the web address (e.g. /browse?category=Books)
  const [search, setSearch] = useState(params.get("search") || "");
  const [category, setCategory] = useState(params.get("category") || "All");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("newest");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // If the address changes (e.g. from the home page), update the filters
  useEffect(() => {
    setSearch(params.get("search") || "");
    setCategory(params.get("category") || "All");
  }, [params]);

  // Fetch items from the backend every time a filter changes
  useEffect(() => {
    setLoading(true);
    const query = new URLSearchParams({ search, category, location, sort });
    if (onlyAvailable) query.set("available", "true");

    api
      .get("/api/items?" + query.toString())
      .then((data) => {
        setItems(data);
        setError("");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [search, category, location, sort, onlyAvailable]);

  return (
    <div className="container page">
      <h1>Browse items</h1>

      <div className="filters card">
        <input type="text" placeholder="Search items" value={search} onChange={(e) => setSearch(e.target.value)} />
        <input type="text" placeholder="Location (e.g. Koramangala)" value={location} onChange={(e) => setLocation(e.target.value)} />
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest first</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
        </select>
        <label className="checkbox">
          <input type="checkbox" checked={onlyAvailable} onChange={(e) => setOnlyAvailable(e.target.checked)} />
          Available only
        </label>
      </div>

      <div className="chips">
        {["All", ...CATEGORIES].map((c) => (
          <button key={c} className={"chip" + (category === c ? " active" : "")} onClick={() => setCategory(c)}>
            {c}
          </button>
        ))}
      </div>

      {error && <p className="alert alert-error">{error}</p>}
      {loading ? (
        <p className="empty">Loading items…</p>
      ) : items.length === 0 ? (
        <p className="empty">No items match your search. Try a different word or category.</p>
      ) : (
        <>
          <p className="muted">{items.length} item{items.length === 1 ? "" : "s"} found</p>
          <div className="grid">
            {items.map((item) => <ItemCard key={item._id} item={item} />)}
          </div>
        </>
      )}
    </div>
  );
}
