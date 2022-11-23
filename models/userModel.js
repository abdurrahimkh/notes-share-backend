const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
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
      lowercase: true,
    },
    institute: {
      type: String,
    },
    dicipline: {
      type: String,
    },
    fieldofstudy: {
      type: String,
    },
    googlenew: {
      type: Boolean,
    },
    pic: {
      type: String,
      default:
        "https://res.cloudinary.com/fypproject07/image/upload/v1662130299/user_qcwlr8.png",
    },
    role: {
      type: String,
      default: "user",
    },
    resettoken: String,
    expiretoken: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
