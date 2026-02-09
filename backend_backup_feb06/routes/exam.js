const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const studentGuard = require("../middleware/studentProfileGuard");

const examController = require("../controllers/examController");

// List published exams
router.get(
  "/",
  auth,
  studentGuard,
  examController.getAvailableExams
);

// Get exam questions
router.get(
  "/:id",
  auth,
  studentGuard,
  examController.getExamById
);

const auth = require("../middleware/auth");
const studentGuard = require("../middleware/studentProfileGuard");
const freeOrPaidGuard = require("../middleware/freeOrPaidGuard");

router.get(
  "/:id",
  auth,
  studentGuard,
  freeOrPaidGuard,
  examController.getExamById
);


module.exports = router;
