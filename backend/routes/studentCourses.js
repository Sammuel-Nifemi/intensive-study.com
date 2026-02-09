const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const Student = require("../models/Student");
const Course = require("../models/Course");
const StudentCourse = require("../models/StudentCourse");

// POST /student/courses
router.post("/courses", auth, async (req, res) => {
  try {
    const student = await Student.findOne({ user_id: req.user.id });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const { courseIds, courseCodes } = req.body;
    let courses = [];

    if (Array.isArray(courseIds) && courseIds.length) {
      courses = await Course.find({ _id: { $in: courseIds } });
    } else if (Array.isArray(courseCodes) && courseCodes.length) {
      courses = await Course.find({ course_code: { $in: courseCodes.map(c => String(c).toUpperCase()) } });
    } else {
      return res.status(400).json({ message: "courseIds or courseCodes required" });
    }

    const inserts = courses.map(c => ({
      student_id: student._id,
      course_id: c._id
    }));

    await StudentCourse.insertMany(inserts, { ordered: false });

    res.json({ message: "Courses saved", count: inserts.length });
  } catch (err) {
    if (err && err.code === 11000) {
      return res.json({ message: "Courses saved", warning: "Some courses already selected" });
    }
    console.error(err);
    res.status(500).json({ message: "Failed to save courses" });
  }
});

module.exports = router;
