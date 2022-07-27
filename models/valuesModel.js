const mongoose = require("mongoose");
const valueSchema = mongoose.Schema(
  {
    universities: [{ label: String, value: String }],
    fieldofstudy: [{ label: String, value: String }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("values", valueSchema);
