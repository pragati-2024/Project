const express = require("express");
const router = express.Router();
const { createUser } = require("../Middleware/UserMiddleware");

// Input validation middleware
const validateSignup = (req, res, next) => {
  const { UserName, Email, Password } = req.body;
  if (!UserName || !Email || !Password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  next();
};

// POST /api/users/signup
router.post("/signup", validateSignup, createUser);

module.exports = router;