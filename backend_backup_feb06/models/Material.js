const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema({
  title: String,

  courseCode: {
    type: String,
    required: true
  },

  resourceType: {
    type: String,
    enum: [
      "course-material",
      "past-question",
      "project-template",
      "des-303"
    ],
    required: true
  },

  session: String,
  semester: String,

  filePath: {
    type: String,
    required: true
  },

  visibility: {
    type: String,
    enum: ["students", "staff", "admin"],
    default: "staff"
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },

  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

}, { timestamps: true });

module.exports = mongoose.model("Material", materialSchema);

