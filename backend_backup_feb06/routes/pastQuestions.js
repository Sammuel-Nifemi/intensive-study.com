const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const studentGuard = require("../middleware/studentProfileGuard");
const {
  getPastQuestionsByCourse
} = require("../controllers/pastQuestionController");

router.get(
  "/:courseCode",
  auth,
  studentGuard,
  getPastQuestionsByCourse
);

module.exports = router;
