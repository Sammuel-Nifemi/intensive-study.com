const mongoose = require("mongoose");

const MockExamQuestionSchema = new mongoose.Schema(
  {
    number: { type: Number, required: true },
    question: { type: String, required: true },
    options: { type: Array, default: [] },
    correctAnswer: { type: String, required: true },
    type: { type: String, enum: ["mcq", "fill"], required: true },
    explanation: { type: String, default: "" }
  },
  { _id: true }
);

const MockExamSchema = new mongoose.Schema(
  {
    courseCode: { type: String, required: true, unique: true },
    questions: { type: [MockExamQuestionSchema], default: [] }
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.MockExam || mongoose.model("MockExam", MockExamSchema);
