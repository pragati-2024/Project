const express = require("express");
const router = express.Router();
const {
  createUser,
  loginUser,
  googleLogin,
  getMe,
  updateMe,
} = require("../Middleware/UserMiddleware");
const { requireAuth } = require("../Middleware/auth");

const validateSignup = (req, res, next) => {
  const { UserName, Email, Password } = req.body;
  if (!UserName || !Email || !Password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const { Email, Password } = req.body;
  if (!Email || !Password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  next();
};

router.post("/signup", validateSignup, createUser);
router.post("/signin", validateLogin, loginUser);
router.post("/google", googleLogin);

// Profile
router.get("/me", requireAuth, getMe);
router.put("/me", requireAuth, updateMe);

module.exports = router;
