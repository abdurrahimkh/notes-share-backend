const mongoose = require("mongoose");
const valueSchema = mongoose.Schema(
  {
    label: { type: String, trim: true },
    value: { type: String, trim: true },
    subjects: [
      {
        label: { type: String, trim: true },
        value: { type: String, trim: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Fields", valueSchema);
