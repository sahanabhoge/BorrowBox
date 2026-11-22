const express = require("express");
const mongoose = require("mongoose");
const Item = require("../models/Item");
const BorrowRequest = require("../models/BorrowRequest");
const requireLogin = require("../middleware/auth");

const router = express.Router();
const OWNER_FIELDS = "name email location";

// Make user text safe to use inside a regular expression
function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Validate the fields for creating / editing an item. Returns an error text or null.
function validateItem(body) {
  const { name, category, description, location, pricePerDay } = body;
  if (!name || !category || !description || !location) {
    return "Name, category, description and location are required";
  }
  if (!Item.CATEGORIES.includes(category)) {
    return "Please choose a valid category";
  }
  if (pricePerDay !== undefined && pricePerDay !== "" && (isNaN(pricePerDay) || Number(pricePerDay) < 0)) {
    return "Price per day must be 0 or more";
  }
  return null;
}

// GET /api/items?search=&category=&location=&sort=&available=&limit=
router.get("/", async (req, res) => {
  try {
    const { search, category, location, sort, available, limit } = req.query;
    const filter = {};

    if (search) {
      const regex = new RegExp(escapeRegex(search), "i");
      filter.$or = [{ name: regex }, { description: regex }];
    }
    if (category && category !== "All") filter.category = category;
    if (location) filter.location = new RegExp(escapeRegex(location), "i");
    if (available === "true") filter.availability = true;

    let sortBy = { createdAt: -1 };
    if (sort === "price_asc") sortBy = { pricePerDay: 1 };
    if (sort === "price_desc") sortBy = { pricePerDay: -1 };

    let query = Item.find(filter).populate("owner", OWNER_FIELDS).sort(sortBy);
    if (limit) query = query.limit(Number(limit));

    res.json(await query);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/items/mine  -> items listed by the logged-in user
// (must be above "/:id" so "mine" is not treated as an id)
router.get("/mine", requireLogin, async (req, res) => {
  try {
    const items = await Item.find({ owner: req.session.userId })
      .populate("owner", OWNER_FIELDS)
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/items/:id
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Item not found" });
    }
    const item = await Item.findById(req.params.id).populate("owner", OWNER_FIELDS);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/items
router.post("/", requireLogin, async (req, res) => {
  try {
    const problem = validateItem(req.body);
    if (problem) return res.status(400).json({ message: problem });

    const { name, category, description, image, location, pricePerDay, availability } = req.body;
    const item = await Item.create({
      name,
      category,
      description,
      image,
      location,
      pricePerDay: Number(pricePerDay) || 0,
      availability: availability !== false,
      owner: req.session.userId,
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/items/:id  (owner only)
router.put("/:id", requireLogin, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Item not found" });
    }
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    if (String(item.owner) !== String(req.session.userId)) {
      return res.status(403).json({ message: "You can only edit your own items" });
    }

    const problem = validateItem({ ...item.toObject(), ...req.body });
    if (problem) return res.status(400).json({ message: problem });

    const fields = ["name", "category", "description", "image", "location", "availability"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) item[field] = req.body[field];
    });
    if (req.body.pricePerDay !== undefined) item.pricePerDay = Number(req.body.pricePerDay) || 0;

    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/items/:id  (owner only)
router.delete("/:id", requireLogin, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Item not found" });
    }
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    if (String(item.owner) !== String(req.session.userId)) {
      return res.status(403).json({ message: "You can only delete your own items" });
    }

    await BorrowRequest.deleteMany({ item: item._id }); // remove its requests too
    await item.deleteOne();
    res.json({ message: "Item deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
