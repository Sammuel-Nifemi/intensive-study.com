

const User = require("../models/User");

module.exports = async (req, res, next) => {
  console.log("Student guard running");

  try {
    const user = await User.findById(req.user.id);

    if (!user || user.role !== "student") {
      return res.status(403).json({ message: "Access denied" });
    }

    if (
  !user.student ||
  !user.student.department ||
  !user.student.level ||
  !user.student.semester
) {

  
  return res.status(403).json({
    message: "Complete your profile to continue"
  });
}


    next();
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
