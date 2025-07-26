const User = require("../Models/user");
const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
  const { UserName, Email, Password } = req.body;

  // Validation
  if (!UserName || !Email || !Password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user exists
    const existingUser = await User.findOne({ Email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Create user
    const user = await User.create({
      UserName,
      Email,
      Password: hashedPassword,
    });

    // Omit password in response
    const userResponse = {
      _id: user._id,
      UserName: user.UserName,
      Email: user.Email,
      createdAt: user.createdAt,
    };

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: userResponse,
    });

  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};