const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["applicant", "student", "admin", "staff"],
      default: "applicant"
    },

    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active"
    },

    activity: {
      dailyActiveMinutes: { type: Number, default: 0 },
      weeklyActiveMinutes: { type: Number, default: 0 },
      totalActiveMinutes: { type: Number, default: 0 }
    },

    referral: {
      code: String,
      referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      count: { type: Number, default: 0 }
    },

    // 👇 STUDENT-SPECIFIC DATA (THIS IS CORRECTLY PLACED)
    student: {
      department: { type: String },
      faculty: { type: String },
      level: { type: String },
      semester: { type: String },

      registeredCourses: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Course" }
      ],

      profileCompleted: {
        type: Boolean,
        default: false
      },

      semesterAccess: {
        type: Map,
        of: Boolean
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
