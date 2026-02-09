
const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const studentGuard = require("../middleware/studentProfileGuard");
const attemptController = require("../controllers/attemptController");

router.post(
  "/submit",
  auth,
  studentGuard,
  attemptController.submitAttempt
);

module.exports = router;
