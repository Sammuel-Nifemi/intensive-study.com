const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const studentGuard = require("../middleware/studentProfileGuard");
const paymentController = require("../controllers/paymentController");

router.post(
  "/unlock",
  auth,
  studentGuard,
  paymentController.unlockSemesterAccess
);

module.exports = router;
