const mongoose = require("mongoose");

module.exports = mongoose.model("StaffLoginRequest", new mongoose.Schema({
  staffId: String,
  email: String,
  status: { type: String, default: "pending" },
  requestedAt: { type: Date, default: Date.now }
}));
