import { createContext, useContext, useEffect, useState } from "react";
import api from "../api.js";

// The context stores who is logged in, so every page can read it.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // When the app opens, ask the server if we are already logged in
  useEffect(() => {
    api
      .get("/api/users/profile")
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const data = await api.post("/api/users/login", { email, password });
    setUser(data);
  }

  async function register(form) {
    const data = await api.post("/api/users/register", form);
    setUser(data);
  }

  async function logout() {
    await api.post("/api/users/logout");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
