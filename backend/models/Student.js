const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
   email: {
  type: String,
  lowercase: true,
  trim: true
},

    faculty: {
      type: String,
      trim: true
    },
    program: {
      type: String,
      trim: true
    },
    level: {
      type: String,
      trim: true
    },
    semester: {
      type: String,
      trim: true
    },
    study_center: {
      type: String,
      trim: true
    },
    gender: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    profile_complete: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Student || mongoose.model("Student", studentSchema);
