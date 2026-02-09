const User = require("../models/User");

/* =========================
   STUDENT DASHBOARD
========================= */
exports.getStudentDashboard = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
  return res.status(401).json({ message: "Unauthorized: no user data" });
}

    const user = await User.findById(req.user.id).populate(
      "student.registeredCourses"
    );

    if (!user || user.role !== "student") {
      return res.status(403).json({ message: "Access denied" });
    }

    const student = user.student;

    const profileCompleted = Boolean(student?.profileCompleted);
    const hasCourses =
      Array.isArray(student?.registeredCourses) &&
      student.registeredCourses.length > 0;

    const canTakeExams = profileCompleted && hasCourses;
    const canRegisterCourses = !hasCourses;

    res.json({
      student: {
        name: user.name || "",
        email: user.email,
        department: student.department || null,
        faculty: student.faculty || null,
        level: student.level || null,
        semester: student.semester || null,
        registeredCourses: student.registeredCourses || [],
        profileCompleted
      },
      canTakeExams,
      canRegisterCourses
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
