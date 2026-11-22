import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", location: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.location) {
      setError("Please fill in all fields");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setBusy(true);
    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h1>Create your account</h1>
        <p className="muted">Join your neighbours and start borrowing.</p>
        {error && <p className="alert alert-error">{error}</p>}

        <label>Full name
          <input name="name" value={form.name} onChange={handleChange} placeholder="Asha Rao" />
        </label>
        <label>Email
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
        </label>
        <label>Password
          <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="At least 6 characters" />
        </label>
        <label>Location
          <input name="location" value={form.location} onChange={handleChange} placeholder="Area, City" />
        </label>

        <button className="btn btn-primary btn-block" disabled={busy}>{busy ? "Creating account…" : "Sign up"}</button>
        <p className="auth-switch">Already registered? <Link to="/login">Log in</Link></p>
      </form>
    </div>
  );
}
