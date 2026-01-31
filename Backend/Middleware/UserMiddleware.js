const User = require("../Models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");

const JWT_SECRET = process.env.JWT_SECRET || "myverysecretkey123";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";

const googleClient = GOOGLE_CLIENT_ID
  ? new OAuth2Client(GOOGLE_CLIENT_ID)
  : null;

// Helper: Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1d" });
};

const sanitizeNameFromEmail = (email) => {
  const local = String(email || "").split("@")[0] || "User";
  return local.replace(/[^a-z0-9._-]/gi, "").slice(0, 24) || "User";
};

// ✅ User Registration
exports.createUser = async (req, res) => {
  const { UserName, Email, Password } = req.body;

  if (!UserName || !Email || !Password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ Email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const user = await User.create({
      UserName,
      Email,
      Password: hashedPassword,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        _id: user._id,
        UserName: user.UserName,
        Email: user.Email,
        profileImage: user.profileImage || "",
        settings: user.settings || {},
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ✅ User Login
exports.loginUser = async (req, res) => {
  const { Email, Password } = req.body;

  if (!Email || !Password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ Email });
    if (!user) {
      return res.status(401).json({ message: "Invalid user" });
    }

    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        UserName: user.UserName,
        Email: user.Email,
        profileImage: user.profileImage || "",
        settings: user.settings || {},
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ✅ Google Login (ID token -> app JWT)
exports.googleLogin = async (req, res) => {
  const { idToken } = req.body || {};
  if (!idToken) {
    return res.status(400).json({ message: "idToken is required" });
  }

  if (!googleClient) {
    return res.status(500).json({
      message:
        "Google login is not configured. Missing GOOGLE_CLIENT_ID in backend .env",
    });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: String(idToken),
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload() || {};
    const email = String(payload.email || "")
      .toLowerCase()
      .trim();
    const emailVerified = Boolean(payload.email_verified);
    const name = String(payload.name || "").trim();
    const picture = String(payload.picture || "").trim();

    if (!email) {
      return res.status(401).json({ message: "Google token missing email" });
    }
    if (!emailVerified) {
      return res.status(401).json({ message: "Google email is not verified" });
    }

    let user = await User.findOne({ Email: email });
    if (!user) {
      const randomPassword = crypto.randomBytes(32).toString("hex");
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      user = await User.create({
        UserName: name || sanitizeNameFromEmail(email),
        Email: email,
        Password: hashedPassword,
        profileImage: picture || "",
      });
    } else if (picture && !user.profileImage) {
      user.profileImage = picture;
      await user.save();
    }

    const token = generateToken(user._id);
    return res.status(200).json({
      success: true,
      message: "Google login successful",
      token,
      user: {
        _id: user._id,
        UserName: user.UserName,
        Email: user.Email,
        profileImage: user.profileImage || "",
        settings: user.settings || {},
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Google Login Error:", error);
    return res.status(401).json({ message: "Invalid Google token" });
  }
};

// ✅ Get current user (profile)
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-Password");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Update current user (profile)
exports.updateMe = async (req, res) => {
  const { UserName, Email, Password, profileImage, settings } = req.body || {};

  try {
    const updates = {};
    if (typeof UserName === "string") updates.UserName = UserName;
    if (typeof Email === "string") updates.Email = Email;
    if (typeof profileImage === "string") updates.profileImage = profileImage;

    if (settings && typeof settings === "object") {
      if ("theme" in settings) {
        const t = String(settings.theme);
        if (!["light", "dark", "system"].includes(t)) {
          return res.status(400).json({ message: "Invalid theme" });
        }
        updates["settings.theme"] = t;
      }

      if ("emailNotifications" in settings) {
        updates["settings.emailNotifications"] = Boolean(
          settings.emailNotifications,
        );
      }

      if ("defaultDifficulty" in settings) {
        const d = String(settings.defaultDifficulty);
        if (!["Easy", "Medium", "Hard"].includes(d)) {
          return res
            .status(400)
            .json({ message: "Invalid default difficulty" });
        }
        updates["settings.defaultDifficulty"] = d;
      }

      if ("preferredLanguage" in settings) {
        const lang = String(settings.preferredLanguage);
        updates["settings.preferredLanguage"] = lang;
      }

      if ("autoPlayVoice" in settings) {
        updates["settings.autoPlayVoice"] = Boolean(settings.autoPlayVoice);
      }
    }

    if (Password) {
      if (String(Password).length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters" });
      }
      updates.Password = await bcrypt.hash(String(Password), 10);
    }

    const user = await User.findByIdAndUpdate(req.userId, updates, {
      new: true,
      runValidators: true,
    }).select("-Password");

    if (!user) return res.status(404).json({ message: "User not found" });
    return res
      .status(200)
      .json({ success: true, message: "Profile updated", user });
  } catch (error) {
    if (error && error.code === 11000) {
      return res.status(409).json({ message: "Email already registered" });
    }
    console.error("Update profile error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
