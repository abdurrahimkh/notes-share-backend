const mongoose = require("mongoose");
const UniSchema = mongoose.Schema(
  {
    label: { type: String, trim: true },
    value: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Universities", UniSchema);
