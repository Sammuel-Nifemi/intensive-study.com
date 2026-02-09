const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const { getStudentAnnouncements } = require("../controllers/studentAnnouncement.controller");

/* =========================
   STUDENT ANNOUNCEMENTS
========================= */

router.get("/announcements", auth, getStudentAnnouncements);

module.exports = router;
