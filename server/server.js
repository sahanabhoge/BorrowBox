require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const connectDB = require("./config/db");

const app = express();

// Allow the React app (running on another port) to talk to this server with cookies
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());

// Sessions: after login the server remembers the user through a cookie
app.use(
  session({
    secret: process.env.SESSION_SECRET || "borrowbox_dev_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }, // 7 days
  })
);

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/items", require("./routes/itemRoutes"));
app.use("/api/requests", require("./routes/requestRoutes"));

app.get("/api", (req, res) => res.json({ message: "BorrowBox API is running" }));

// Unknown API route
app.use("/api", (req, res) => res.status(404).json({ message: "API route not found" }));

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log("Server running on http://localhost:" + PORT));
});
