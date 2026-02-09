const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const Student = require("../models/Student");
const Course = require("../models/Course");

// GET /courses/available
router.get("/available", auth, async (req, res) => {
  try {
    const student = await Student.findOne({ user_id: req.user.id });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const { faculty, program, level, semester } = student;

    const courses = await Course.find({
      faculty,
      program,
      level,
      semester
    });

    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
});

module.exports = router;
