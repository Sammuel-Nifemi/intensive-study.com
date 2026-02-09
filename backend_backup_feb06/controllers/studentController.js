const User = require("../models/User");

/* =========================
   GET LOGGED-IN STUDENT PROFILE
========================= */
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      email: user.email,
      role: user.role,
      student: user.student || null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch profile" });
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

    user.student = {
      ...user.student,
      ...req.body,
      onboardingCompleted: true
    };

    await user.save();

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to complete setup" });
  }
};
