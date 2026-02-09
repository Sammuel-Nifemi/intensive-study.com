const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const studentOnly = require("../middleware/studentOnly");
const {
  getMockExam,
  submitMockExam
} = require("../controllers/mockExam.controller");

router.get("/:course", auth, studentOnly, getMockExam);
router.post("/submit", auth, studentOnly, submitMockExam);

module.exports = router;
