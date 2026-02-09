const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const studentOnly = require("../middleware/studentOnly");
const { loginStudent, registerStudent } = require("../controllers/studentAuth.controller");
const {
  getMyProfile,
  updateMyProfile,
  submitAcademicChangeRequest,
  submitComplaint,
  deleteMyAccount,
  completeStudentSetup
} = require("../controllers/studentController");
const {
  getStudentDashboard
} = require("../controllers/studentDashboard.controller");

// Get logged-in student profile
router.get("/me", auth, getMyProfile);

// Update logged-in student profile
router.put("/me", auth, studentOnly, updateMyProfile);

// Academic change request
router.post("/me/academic-change-request", auth, studentOnly, submitAcademicChangeRequest);

// Complaint
router.post("/me/complaints", auth, studentOnly, submitComplaint);

// Delete account
router.delete("/me", auth, studentOnly, deleteMyAccount);

// Student register
router.post("/register", registerStudent);

// Student login
router.post("/login", loginStudent);

// Student dashboard (protected)
router.get("/dashboard", auth, studentOnly, getStudentDashboard);

// Complete student setup (onboarding)
router.post("/setup", auth, completeStudentSetup);

// Update academic profile
router.post("/profile", auth, studentOnly, async (req, res) => {
  try {
    const { faculty, program, level, semester, study_center } = req.body;

    const Student = require("../models/Student");
    const student = await Student.findOne({ user_id: req.user.id });
    if (!student) return res.status(404).json({ message: "Student not found" });

    student.faculty = faculty ?? student.faculty ?? null;
    student.program = program ?? student.program ?? null;
    student.level = level ?? student.level ?? null;
    student.semester = semester ?? student.semester ?? null;
    student.study_center = study_center ?? student.study_center ?? null;
    student.profile_complete = true;

    await student.save();

    res.json({ success: true, student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});



module.exports = router;
