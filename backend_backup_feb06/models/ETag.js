const mongoose = require("mongoose");

module.exports = mongoose.model("ETag", new mongoose.Schema({
  staffId: String,
  email: String,
  token: String,
  expiresAt: Date,
  used: { type: Boolean, default: false }
}));
