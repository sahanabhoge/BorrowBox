const mongoose = require("mongoose");

const CATEGORIES = [
  "Electronics",
  "Books",
  "Sports Equipment",
  "Tools",
  "Kitchen Appliances",
  "Clothing",
  "Others",
];

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, enum: CATEGORIES },
  description: { type: String, required: true, trim: true },
  image: { type: String, default: "" },
  location: { type: String, required: true, trim: true },
  pricePerDay: { type: Number, default: 0, min: 0 }, // 0 means free
  availability: { type: Boolean, default: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

const Item = mongoose.model("Item", itemSchema);
Item.CATEGORIES = CATEGORIES;

module.exports = Item;
