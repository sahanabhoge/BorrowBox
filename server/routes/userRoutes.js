const express = require("express");
const User = require("../models/User");
const requireLogin = require("../middleware/auth");

const router = express.Router();

// Remove the password before sending a user to the browser
function publicUser(user) {
  return { _id: user._id, name: user.name, email: user.email, location: user.location };
}

// POST /api/users/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, location } = req.body;

    if (!name || !email || !password || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "This email is already registered" });
    }

    const user = await User.create({
      name,
      email,
      location,
      password: User.hashPassword(password),
    });

    req.session.userId = user._id; // log the user in right away
    res.status(201).json(publicUser(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/users/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.checkPassword(password)) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    req.session.userId = user._id;
    res.json(publicUser(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/users/logout
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out" });
  });
});

// GET /api/users/profile  (who is logged in?)
router.get("/profile", requireLogin, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) return res.status(401).json({ message: "User not found" });
    res.json(publicUser(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
