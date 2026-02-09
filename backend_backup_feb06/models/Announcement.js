const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    image: { type: String },
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Announcement", announcementSchema);
