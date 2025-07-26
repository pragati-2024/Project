require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./Connection/connection");
const userRoutes = require("./Route/UserRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
connectDB();

// Routes
app.use("/api/users", userRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start server
const PORT = process.env.PORT || 5600;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});