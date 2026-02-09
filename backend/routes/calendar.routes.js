const express = require("express");
const router = express.Router();

const { getStudentCalendar } = require("../controllers/calendar.controller");
const auth = require("../middleware/auth");
const studentOnly = require("../middleware/studentOnly");

router.get("/calendar", auth, studentOnly, getStudentCalendar);

module.exports = router;
