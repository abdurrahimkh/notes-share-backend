const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
    },
    url: {
      type: String,
      required: true,
    },
    filetype: {
      type: String,
    },
    size: {
      type: String,
    },
    status: {
      type: String,
      default: "pending",
    },
    postedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    likes: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Document", documentSchema);
