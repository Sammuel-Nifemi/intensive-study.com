const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

   if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

 const user = await User.findOne({ email, role: "student" });

      if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

     const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

   res.json({
      token,
      onboardingCompleted: user.student?.onboardingCompleted || false
    });
  } catch (err) {
    console.error("Student login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
