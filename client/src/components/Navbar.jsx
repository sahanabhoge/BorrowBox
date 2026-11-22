import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false); // mobile menu
  const [dropdownOpen, setDropdownOpen] = useState(false); // account dropdown

  // Close menus when the page changes
  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="logo">
          <span className="logo-mark">B</span>
          BorrowBox
        </Link>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? "✕" : "☰"}
        </button>

        <nav className={"nav-links" + (menuOpen ? " open" : "")}>
          <NavLink to="/browse">Browse items</NavLink>

          {user ? (
            <>
              <Link to="/list" className="btn btn-primary btn-small">List an item</Link>

              <div className="dropdown">
                <button className="dropdown-button" onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <span className="avatar">{user.name.charAt(0).toUpperCase()}</span>
                  {user.name.split(" ")[0]} ▾
                </button>
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/my-items">My items</Link>
                    <Link to="/requests">Requests received</Link>
                    <Link to="/my-borrowings">My borrowings</Link>
                    <button onClick={handleLogout}>Log out</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <NavLink to="/login">Log in</NavLink>
              <Link to="/register" className="btn btn-primary btn-small">Sign up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
