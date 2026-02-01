require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const userRoutes = require("./Route/UserRoutes");
const interviewRoutes = require("./Route/InterviewRoutes");
const questionRoutes = require("./Route/QuestionRoutes");
const contactRoutes = require("./Route/ContactRoutes");
const connectDB = require("./Connection/connection");

const app = express();

// Allow OAuth popup flows (Google) to communicate via postMessage.
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});

// Middleware
const allowedOrigins = (process.env.FRONTEND_ORIGIN || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const isLocalDevOrigin = (origin) =>
  /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (isLocalDevOrigin(origin)) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Add this for form data

// Database connection
connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/contact", contactRoutes);

// Serve frontend build in production
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "..", "ai-based-project", "dist");
  const indexHtmlPath = path.join(distPath, "index.html");

  // Only enable static serving when the build output exists (helps serverless deploys).
  if (fs.existsSync(indexHtmlPath)) {
    app.use(express.static(distPath));

    // SPA fallback (avoid intercepting API routes)
    app.get("/*", (req, res, next) => {
      if (req.path.startsWith("/api/")) return next();
      return res.sendFile(indexHtmlPath);
    });
  }
}

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    database:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err?.message || "Internal Server Error" });
});

// Export for serverless platforms (e.g., Vercel Functions)
module.exports = app;

// Start server only when run directly (keeps local dev behavior)
if (require.main === module) {
  const PORT = process.env.PORT || 5600;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
