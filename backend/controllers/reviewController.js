const Attempt = require("../models/Attempt");
const Exam = require("../models/Exam");

exports.getExamReview = async (req, res) => {
  try {
    const { attemptId } = req.params;

    const attempt = await Attempt.findById(attemptId)
      .populate("exam");

    if (!attempt) {
      return res.status(404).json({ message: "Attempt not found" });
    }

    // Security: only owner can review
    if (String(attempt.student) !== String(req.user.id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const exam = attempt.exam;

    const review = exam.questions.map((q, index) => {
      const studentAnswer = attempt.answers[index];
      const correct = q.correct;

      return {
        question: q.text,
        options: q.options,
        studentAnswer: studentAnswer || null,
        correctAnswer: correct,
        isCorrect: studentAnswer === correct
      };
    });

    res.json({
      title: exam.title,
      score: attempt.score,
      total: attempt.total,
      review
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load review" });
  }
};
