const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    field: {
      type: String,
      required: true,
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
      type: ObjectId,
      ref: "User",
    },
    ratings: {
      type: Number,
      default: 0,
    },
    noOfReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: ObjectId,
          ref: "User",
        },
        name: {
          type: String,
        },
        rating: {
          type: Number,
        },
      },
    ],
    comments: [
      {
        text: String,
        postedBy: { type: ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Document", documentSchema);
