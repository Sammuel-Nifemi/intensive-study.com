



const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    faculty: {
      type: String,
      required: true,
    },

    program: {
      type: String,
      required: true,
    },

    level: {
      type: String,
      required: true,
    },

    semester: {
      type: String,
      required: true,
    },

    studyCenter: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "student",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", StudentSchema);
