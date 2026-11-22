import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api, { CATEGORIES } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

// This page is used both to list a new item (/list) and to edit one (/items/:id/edit)
export default function ItemForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    category: CATEGORIES[0],
    description: "",
    image: "",
    location: user.location || "",
    pricePerDay: 0,
    availability: true,
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // When editing, load the current values
  useEffect(() => {
    if (!isEdit) return;
    api
      .get("/api/items/" + id)
      .then((item) => {
        if (item.owner._id !== user._id) {
          setError("You can only edit your own items");
          return;
        }
        setForm({
          name: item.name,
          category: item.category,
          description: item.description,
          image: item.image || "",
          location: item.location,
          pricePerDay: item.pricePerDay,
          availability: item.availability,
        });
      })
      .catch((err) => setError(err.message));
  }, [id]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.description || !form.location) {
      setError("Please fill in the name, description and location");
      return;
    }
    if (Number(form.pricePerDay) < 0) {
      setError("Price cannot be negative");
      return;
    }
    setBusy(true);
    try {
      if (isEdit) {
        await api.put("/api/items/" + id, form);
      } else {
        await api.post("/api/items", form);
      }
      navigate("/my-items");
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="container page narrow">
      <h1>{isEdit ? "Edit your item" : "List an item"}</h1>
      <p className="muted">Tell your neighbours what you are happy to lend.</p>

      <form className="card form" onSubmit={handleSubmit}>
        {error && <p className="alert alert-error">{error}</p>}

        <label>Item name
          <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Scientific Calculator" />
        </label>

        <div className="form-row">
          <label>Category
            <select name="category" value={form.category} onChange={handleChange}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label>Price per day (₹, 0 = free)
            <input name="pricePerDay" type="number" min="0" value={form.pricePerDay} onChange={handleChange} />
          </label>
        </div>

        <label>Description
          <textarea name="description" rows="4" value={form.description} onChange={handleChange} placeholder="Condition, what's included, any rules" />
        </label>

        <label>Image URL
          <input name="image" value={form.image} onChange={handleChange} placeholder="https://… (optional)" />
        </label>

        <label>Location
          <input name="location" value={form.location} onChange={handleChange} placeholder="Area, City" />
        </label>

        <label className="checkbox">
          <input name="availability" type="checkbox" checked={form.availability} onChange={handleChange} />
          This item is available to borrow
        </label>

        <div className="form-buttons">
          <button className="btn btn-primary" disabled={busy}>
            {busy ? "Saving…" : isEdit ? "Save changes" : "List item"}
          </button>
          <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
