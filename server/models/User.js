const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true }, // stored as "salt:hash", never plain text
  location: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
});

// Hash a password with a random salt using Node's built-in crypto module
userSchema.statics.hashPassword = function (plainPassword) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(plainPassword, salt, 64).toString("hex");
  return salt + ":" + hash;
};

// Compare a typed password with the stored "salt:hash"
userSchema.methods.checkPassword = function (plainPassword) {
  const [salt, hash] = this.password.split(":");
  const typedHash = crypto.scryptSync(plainPassword, salt, 64).toString("hex");
  return typedHash === hash;
};

module.exports = mongoose.model("User", userSchema);
