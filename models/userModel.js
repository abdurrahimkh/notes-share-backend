const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    institute: {
      type: String,
      lowercase: true,
    },
    dicipline: {
      type: String,
      lowercase: true,
    },
    fieldofstudy: {
      type: String,
      lowercase: true,
    },
    googlenew: {
      type: Boolean,
    },
    pic: {
      type: String,
      default:
        "https://res.cloudinary.com/fypproject07/image/upload/v1658128804/profile_gojfyg.png",
    },
    role: {
      type: String,
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
