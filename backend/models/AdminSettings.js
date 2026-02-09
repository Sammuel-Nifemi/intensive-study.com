const mongoose = require("mongoose");

const adminSettingsSchema = new mongoose.Schema(
  {
    theme: { type: String, enum: ["light", "dark", "purple"], default: "light" }
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.AdminSettings || mongoose.model("AdminSettings", adminSettingsSchema);
