const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  UserName: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    minlength: [3, "Username must be at least 3 characters long"]
  },
  Email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"]
  },
  Password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"]
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;