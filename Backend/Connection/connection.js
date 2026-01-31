const mongoose = require("mongoose");

const DEFAULT_LOCAL_URI = "mongodb://127.0.0.1:27017/moketonDB";

const getMongoUri = () => {
  const uri = process.env.MONGODB_URI;
  if (uri && uri.trim()) return uri.trim();
  return DEFAULT_LOCAL_URI;
};

const connectDB = async () => {
  try {
    const mongoUri = getMongoUri();
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB connected successfully");
    return true;
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    // Don't crash the whole server; allow health check + debugging.
    return false;
  }
};

module.exports = connectDB;
