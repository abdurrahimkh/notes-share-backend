const mongoose = require("mongoose");
const valueSchema = mongoose.Schema(
  {
    label: String,
    value: String,
    subjects: [{ label: String, value: String }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Fields", valueSchema);
