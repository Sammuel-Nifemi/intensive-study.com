const express = require("express");
const router = express.Router();

const {
  startExam,
  submitExam
} = require("../controllers/exam.controller");

const auth = require("../middleware/auth");
const studentOnly = require("../middleware/studentOnly");

router.post("/start/:examId", auth, studentOnly, startExam);
router.post("/submit", auth, studentOnly, submitExam);

module.exports = router;
