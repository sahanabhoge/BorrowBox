
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "./context/AuthContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Browse from "./pages/Browse.jsx";
import ItemDetails from "./pages/ItemDetails.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ItemForm from "./pages/ItemForm.jsx";
import MyItems from "./pages/MyItems.jsx";
import MyBorrowings from "./pages/MyBorrowings.jsx";
import Requests from "./pages/Requests.jsx";

// Pages that need a login
function Protected({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <p className="page-message">Loading…</p>;
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return children;
}

export default function App() {
  const { pathname } = useLocation();

  // Scroll to the top whenever the page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/items/:id" element={<ItemDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={<Protected><Dashboard /></Protected>}
          />

          <Route
            path="/list"
            element={<Protected><ItemForm /></Protected>}
          />

          <Route
            path="/items/:id/edit"
            element={<Protected><ItemForm /></Protected>}
          />

          <Route
            path="/my-items"
            element={<Protected><MyItems /></Protected>}
          />

          <Route
            path="/my-borrowings"
            element={<Protected><MyBorrowings /></Protected>}
          />

          <Route
            path="/requests"
            element={<Protected><Requests /></Protected>}
          />

          <Route
            path="*"
            element={<p className="page-message">Page not found.</p>}
          />
        </Routes>
      </main>

      <Footer />
    </>
  );
}
