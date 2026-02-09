const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,        // 🔐 PREVENTS DUPLICATION
      uppercase: true,
      trim: true
    },
    title: {
      type: String,
      required: true
    },
    level: {
      type: Number,
      required: true
    },
    semester: {
      type: Number,
      required: true
    },
    department: {
      type: String,
      required: true // e.g. "Computer Science", "ALL"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
