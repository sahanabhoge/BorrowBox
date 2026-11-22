const express = require("express");
const mongoose = require("mongoose");
const Item = require("../models/Item");
const BorrowRequest = require("../models/BorrowRequest");
const requireLogin = require("../middleware/auth");

const router = express.Router();

// POST /api/requests   body: { itemId }
router.post("/", requireLogin, async (req, res) => {
  try {
    const { itemId } = req.body;
    if (!itemId || !mongoose.isValidObjectId(itemId)) {
      return res.status(400).json({ message: "A valid item is required" });
    }

    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (String(item.owner) === String(req.session.userId)) {
      return res.status(400).json({ message: "You cannot borrow your own item" });
    }
    if (!item.availability) {
      return res.status(400).json({ message: "This item is not available right now" });
    }

    const alreadyAsked = await BorrowRequest.findOne({
      item: item._id,
      borrower: req.session.userId,
      status: { $in: ["Pending", "Accepted"] },
    });
    if (alreadyAsked) {
      return res.status(400).json({ message: "You already have an open request for this item" });
    }

    const request = await BorrowRequest.create({
      item: item._id,
      borrower: req.session.userId,
      owner: item.owner,
    });
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/requests/my-requests  -> requests I made (My Borrowings)
router.get("/my-requests", requireLogin, async (req, res) => {
  try {
    const requests = await BorrowRequest.find({ borrower: req.session.userId })
      .populate("item")
      .populate("owner", "name email location")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/requests/received  -> requests for my items
router.get("/received", requireLogin, async (req, res) => {
  try {
    const requests = await BorrowRequest.find({ owner: req.session.userId })
      .populate("item")
      .populate("borrower", "name email location")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/requests/:id/status   body: { status }   (owner only)
// Allowed: Pending -> Accepted / Rejected,   Accepted -> Returned
router.put("/:id/status", requireLogin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Request not found" });
    }
    if (!["Accepted", "Rejected", "Returned"].includes(status)) {
      return res.status(400).json({ message: "Status must be Accepted, Rejected or Returned" });
    }

    const request = await BorrowRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (String(request.owner) !== String(req.session.userId)) {
      return res.status(403).json({ message: "Only the item owner can update this request" });
    }

    const okFromPending = request.status === "Pending" && (status === "Accepted" || status === "Rejected");
    const okFromAccepted = request.status === "Accepted" && status === "Returned";
    if (!okFromPending && !okFromAccepted) {
      return res.status(400).json({ message: "Cannot change a " + request.status + " request to " + status });
    }

    request.status = status;
    await request.save();

    // Keep the item's availability in sync with the request
    if (status === "Accepted") await Item.findByIdAndUpdate(request.item, { availability: false });
    if (status === "Returned") await Item.findByIdAndUpdate(request.item, { availability: true });

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
