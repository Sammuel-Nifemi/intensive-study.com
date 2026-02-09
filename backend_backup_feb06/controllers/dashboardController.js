const User = require("../models/User");

exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const student = user.student || {};

    res.json({
      student: {
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: student.studentId || null,
        profileCompleted: student.profileCompleted || false,
        verified: student.verified || false
      },

      academics: {
        enrolledCourses: student.courses || [],
        activeExams: [],
        completedExams: []
      },

      status: {
        canTakeExam: student.profileCompleted === true,
        canEditProfile: !student.profileCompleted,
        dashboardLocked: false
      },

      notices: [
        "Welcome to Intensive Study Academy",
        student.profileCompleted
          ? "Your profile is complete"
          : "Please complete your profile"
      ]
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
