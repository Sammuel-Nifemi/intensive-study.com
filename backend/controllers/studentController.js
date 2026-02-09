const mongoose = require("mongoose");
const User = require("../models/User");
const Student = require("../models/Student");
const Program = require("../models/Program");
const StudyCenter = require("../models/StudyCenter");
const AcademicChangeRequest = require("../models/AcademicChangeRequest");
const Complaint = require("../models/Complaint");

/* =========================
   GET LOGGED-IN STUDENT PROFILE
========================= */
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "student") {
      return res.status(403).json({ message: "Access denied" });
    }

    const student = await Student.findOne({ user_id: user._id });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    let programName = student.program || null;
    let studyCenterName = student.study_center || null;

    if (student.program && mongoose.isValidObjectId(student.program)) {
      const program = await Program.findById(student.program).select("name");
      if (program?.name) programName = program.name;
    }

    if (student.study_center && mongoose.isValidObjectId(student.study_center)) {
      const center = await StudyCenter.findById(student.study_center).select("name");
      if (center?.name) studyCenterName = center.name;
    }

    res.json({
      fullName: user.fullName,
      email: user.email,
      gender: student.gender || null,
      phone: student.phone || null,
      faculty: student.faculty || null,
      program: programName,
      level: student.level || null,
      semester: student.semester || null,
      studyCenter: studyCenterName,
      study_center: student.study_center || null,
      profile_complete: student.profile_complete ?? false
    });
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   UPDATE LOGGED-IN STUDENT PROFILE (USER MODEL)
========================= */
exports.updateMyProfile = async (req, res) => {
  try {
    const {
      gender,
      phone
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "student") {
      return res.status(403).json({ message: "Access denied" });
    }

    const student = await Student.findOne({ user_id: user._id });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.gender = gender ?? student.gender ?? null;
    student.phone = phone ?? student.phone ?? null;
    await student.save();

    res.json({
      message: "Profile updated",
      student: {
        fullName: user.fullName,
        email: user.email,
        gender: student.gender || null,
        phone: student.phone || null
      }
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

/* =========================
   SUBMIT ACADEMIC CHANGE REQUEST
========================= */
exports.submitAcademicChangeRequest = async (req, res) => {
  try {
    const { requestedProgram, requestedStudyCenter, reason } = req.body;

    if (!requestedProgram && !requestedStudyCenter) {
      return res.status(400).json({ message: "Provide requested program or study center" });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "student") {
      return res.status(403).json({ message: "Access denied" });
    }

    const student = await Student.findOne({ user_id: user._id });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const currentProgram = student.program || null;
    const currentStudyCenter = student.study_center || null;

    const request = await AcademicChangeRequest.create({
      student: student._id,
      currentProgram,
      currentStudyCenter,
      requestedProgram: requestedProgram || null,
      requestedStudyCenter: requestedStudyCenter || null,
      reason: reason || ""
    });

    res.status(201).json({
      message: "Academic change request submitted",
      requestId: request._id,
      status: request.status
    });
  } catch (err) {
    console.error("Academic change request error:", err);
    res.status(500).json({ message: "Failed to submit request" });
  }
};

/* =========================
   SUBMIT COMPLAINT
========================= */
exports.submitComplaint = async (req, res) => {
  try {
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ message: "Subject and message are required" });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "student") {
      return res.status(403).json({ message: "Access denied" });
    }

    const student = await Student.findOne({ user_id: user._id });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const complaint = await Complaint.create({
      studentId: student._id,
      message: subject ? `${subject}: ${message}` : message
    });

    res.status(201).json({
      message: "Complaint submitted",
      complaintId: complaint._id,
      status: complaint.status
    });
  } catch (err) {
    console.error("Complaint error:", err);
    res.status(500).json({ message: "Failed to submit complaint" });
  }
};

/* =========================
   DELETE ACCOUNT
========================= */
exports.deleteMyAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "student") {
      return res.status(403).json({ message: "Access denied" });
    }

    const student = await Student.findOne({ user_id: user._id });
    if (student) {
      const StudentFlag = require("../models/StudentFlag");
      const ChangeRequest = require("../models/ChangeRequest");
      await AcademicChangeRequest.deleteMany({ student: student._id });
      await Complaint.deleteMany({ studentId: student._id });
      await ChangeRequest.deleteMany({ studentId: student._id });
      await StudentFlag.deleteMany({ studentId: student._id });
      await Student.findByIdAndDelete(student._id);
    }
    await User.findByIdAndDelete(user._id);

    res.json({ message: "Account deleted" });
  } catch (err) {
    console.error("Delete account error:", err);
    res.status(500).json({ message: "Failed to delete account" });
  }
};

/* =========================
   COMPLETE STUDENT SETUP
========================= */
exports.completeStudentSetup = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const student = await Student.findOne({ user_id: user._id });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    Object.assign(student, req.body);
    student.profile_complete = true;
    await student.save();

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to complete setup" });
  }
};
