// Connects the app to MongoDB using Mongoose
const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected: " + mongoose.connection.host);
  } catch (error) {
    console.error("MongoDB connection failed: " + error.message);
    console.error("Is MongoDB running? Check MONGO_URI in server/.env");
    process.exit(1);
  }
}

module.exports = connectDB;
