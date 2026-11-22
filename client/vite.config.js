import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The proxy sends every "/api/..." request to the Express server on port 5000.
// This keeps the login cookie working without any CORS trouble.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
});
