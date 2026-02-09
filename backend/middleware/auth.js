const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Student = require("../models/Student");

module.exports = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: "No token" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    if (decoded.role === "student") {
      const user = await User.findById(decoded.id);
      if (user) {
        let student = await Student.findOne({ user_id: user._id });
        if (!student) {
          student = await Student.create({
            user_id: user._id,
            email: user.email,
            profile_complete: false
          });
        }
        req.student = student;
      }
    }

    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};
