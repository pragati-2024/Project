const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    UserName: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
    },
    Email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    Password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    profileImage: {
      type: String,
      default: "",
      trim: true,
    },

    settings: {
      theme: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "dark",
      },
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      defaultDifficulty: {
        type: String,
        enum: ["Easy", "Medium", "Hard"],
        default: "Medium",
      },
      preferredLanguage: {
        type: String,
        default: "English",
      },
      autoPlayVoice: {
        type: Boolean,
        default: true,
      },
    },

    interviewHistory: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
        mode: {
          type: String,
          default: "",
          trim: true,
        },
        company: {
          type: String,
          default: "",
          trim: true,
        },
        jobRole: {
          type: String,
          default: "",
          trim: true,
        },
        level: {
          type: String,
          default: "",
          trim: true,
        },
        focusArea: {
          type: String,
          default: "",
          trim: true,
        },
        track: {
          type: String,
          default: "",
          trim: true,
        },
        text: {
          type: String,
          default: "",
          trim: true,
        },
        score: {
          type: Number,
        },
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  },
);

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
