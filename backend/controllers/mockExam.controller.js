const MockExam = require("../models/MockExam");
const ExamAttempt = require("../models/ExamAttempt");
const User = require("../models/User");
const StudentFlag = require("../models/StudentFlag");

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

exports.getMockExam = async (req, res) => {
  try {
    const course = String(req.params.course || "").toUpperCase().trim();
    if (!course) return res.status(400).json({ message: "Course is required" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role !== "student") {
      return res.status(403).json({ message: "Access denied" });
    }
    if (user.status === "suspended") {
      return res.status(403).json({ message: "Account suspended" });
    }
    const flagged = await StudentFlag.findOne({ studentId: user._id });
    if (flagged) {
      return res.status(403).json({ message: "Account flagged" });
    }

    if (!user.student?.program || !user.student?.semester) {
      return res.status(403).json({ message: "Complete academic setup first" });
    }

    const exam = await MockExam.findOne({ courseCode: course });
    if (!exam) return res.status(404).json({ message: "Mock exam not found" });

    const shuffled = shuffle(exam.questions);
    const questions = shuffled.map((q, idx) => ({
      id: q._id,
      number: idx + 1,
      question: q.question,
      options: q.options,
      type: q.type
    }));

    res.json({
      courseCode: exam.courseCode,
      questions
    });
  } catch (err) {
    console.error("Get mock exam error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.submitMockExam = async (req, res) => {
  try {
    const { courseCode, answers } = req.body;
    const course = String(courseCode || "").toUpperCase().trim();

    if (!course || !Array.isArray(answers)) {
      return res.status(400).json({ message: "Course and answers are required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role !== "student") {
      return res.status(403).json({ message: "Access denied" });
    }
    if (user.status === "suspended") {
      return res.status(403).json({ message: "Account suspended" });
    }
    const flagged = await StudentFlag.findOne({ studentId: user._id });
    if (flagged) {
      return res.status(403).json({ message: "Account flagged" });
    }

    const existingAttempts = await ExamAttempt.countDocuments({
      studentId: user._id,
      course
    });

    if (existingAttempts >= 2) {
      return res.status(403).json({
        message: "Free attempts exhausted. Payment required to continue.",
        attempts: existingAttempts
      });
    }

    const exam = await MockExam.findOne({ courseCode: course });
    if (!exam) return res.status(404).json({ message: "Mock exam not found" });

    const questionMap = new Map();
    exam.questions.forEach(q => {
      questionMap.set(String(q._id), q);
    });

    let correctCount = 0;
    const explanations = [];

    answers.forEach((ans, idx) => {
      const q = questionMap.get(String(ans.id));
      if (!q) return;

      const provided = (ans.answer ?? "").toString();
      let isCorrect = false;

      if (q.type === "mcq") {
        const normalized = provided.trim().toUpperCase();
        isCorrect = normalized === q.correctAnswer.toString().trim().toUpperCase();
      } else {
        const normalized = provided.trim().toLowerCase();
        const correct = q.correctAnswer.toString().trim().toLowerCase();
        isCorrect = normalized === correct;
      }

      if (isCorrect) correctCount += 1;

      let correctText = q.correctAnswer;
      if (q.type === "mcq" && Array.isArray(q.options)) {
        const match = q.options.find(opt => opt.label === q.correctAnswer);
        if (match && match.text) correctText = match.text;
      }

      explanations.push({
        number: idx + 1,
        question: q.question,
        type: q.type,
        correctAnswer: q.correctAnswer,
        correctText,
        explanation: q.explanation || correctText,
        isCorrect
      });
    });

    const attemptNumber = existingAttempts + 1;

    await ExamAttempt.create({
      studentId: user._id,
      course,
      score: correctCount,
      attempts: attemptNumber
    });

    res.json({
      score: correctCount,
      total: exam.questions.length,
      attempts: attemptNumber,
      explanations
    });
  } catch (err) {
    console.error("Submit mock exam error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
