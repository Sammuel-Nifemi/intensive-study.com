const mongoose = require("mongoose");

const studyCenterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudyCenter", studyCenterSchema);
