const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const studentGuard = require("../middleware/studentProfileGuard");
const reviewController = require("../controllers/reviewController");

router.get(
  "/:attemptId",
  auth,
  studentGuard,
  reviewController.getExamReview
);

module.exports = router;
