const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const questionSchema = mongoose.Schema(
  {
    title: String,
    subject: String,
    description: String,
    postedBy: {
      type: ObjectId,
      ref: "User",
    },
    answers: [
      {
        text: String,
        file: String,
        answerBy: { type: ObjectId, ref: "User" },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Question", questionSchema);
