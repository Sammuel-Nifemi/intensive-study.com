const express = require("express");
const router = express.Router();

const { loginStudent } = require("../controllers/studentAuth.controller");
const { getStudentDashboard } = require("../controllers/studentDashboard.controller");

const auth = require("../middleware/auth");
const studentOnly = require("../middleware/studentOnly");

// LOGIN
router.post("/login", loginStudent);

// DASHBOARD
router.get("/dashboard", auth, studentOnly, getStudentDashboard);

module.exports = router;
