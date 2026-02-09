const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    target: {
      type: String,
      enum: ["all", "faculty", "level"],
      default: "all"
    },
    image: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    createdRole: { type: String },
    // staff: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Staff",
    //   required: true
    // }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Announcement", announcementSchema);
