const mongoose = require("mongoose");

const ExamAttemptSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: String, required: true },
    score: { type: Number, required: true },
    attempts: { type: Number, required: true }
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.ExamAttempt || mongoose.model("ExamAttempt", ExamAttemptSchema);
