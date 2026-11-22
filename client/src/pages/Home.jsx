import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { CATEGORIES } from "../api.js";
import ItemCard from "../components/ItemCard.jsx";

const CATEGORY_ICONS = {
  Electronics: "🔌",
  Books: "📚",
  "Sports Equipment": "⚽",
  Tools: "🔧",
  "Kitchen Appliances": "🍳",
  Clothing: "👔",
  Others: "📦",
};

export default function Home() {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  // Recently listed items come from the database
  useEffect(() => {
    api.get("/api/items?limit=6").then(setItems).catch(() => setItems([]));
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    navigate("/browse?search=" + encodeURIComponent(search));
  }

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <h1>Don't Buy It. Borrow It.</h1>
          <p className="hero-sub">
            Need a calculator for two days or a drill for one afternoon? Borrow it from someone in your
            neighbourhood, and lend what you aren't using.
          </p>
          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search for a camera, bicycle, book…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
          <div className="hero-buttons">
            <Link to="/browse" className="btn btn-primary">Explore items</Link>
            <Link to="/list" className="btn btn-outline">List your item</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Popular categories</h2>
          <div className="category-grid">
            {CATEGORIES.map((c) => (
              <Link key={c} to={"/browse?category=" + encodeURIComponent(c)} className="category-tile">
                <span className="category-icon">{CATEGORY_ICONS[c]}</span>
                {c}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Recently listed</h2>
            <Link to="/browse" className="link">See all items</Link>
          </div>
          {items.length === 0 ? (
            <p className="empty">No items yet. Run <code>npm run seed</code> in the server folder to add sample items.</p>
          ) : (
            <div className="grid">
              {items.map((item) => <ItemCard key={item._id} item={item} />)}
            </div>
          )}
        </div>
      </section>

      <section className="section how">
        <div className="container">
          <h2>How it works</h2>
          <div className="steps">
            <div className="step">
              <span className="step-number">1</span>
              <h3>Find what you need</h3>
              <p>Search by name, category or area to see what people nearby are lending.</p>
            </div>
            <div className="step">
              <span className="step-number">2</span>
              <h3>Request to borrow</h3>
              <p>Send a request. The owner can accept or reject it from their dashboard.</p>
            </div>
            <div className="step">
              <span className="step-number">3</span>
              <h3>Collect and return</h3>
              <p>Meet the owner, pick up the item and give it back when you're done.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
