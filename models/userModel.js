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
      // required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    institute: {
      type: String,
      // required: true,
      lowercase: true,
    },
    dicipline: {
      type: String,
      // required: true,
      lowercase: true,
    },
    fieldofstudy: {
      type: String,
      // required: true,
      lowercase: true,
    },
    googlenew: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
