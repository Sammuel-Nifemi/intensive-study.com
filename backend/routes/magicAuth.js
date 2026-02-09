const express = require("express");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Student = require("../models/Student");
const User = require("../models/User");

const router = express.Router();

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM,
  APP_BASE_URL,
  JWT_SECRET
} = process.env;

function createTransporter() {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: false,
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });
}

const transporter = createTransporter();

if (transporter) {
  transporter.verify((err) => {
    if (err) {
      console.error("SMTP verify failed:", err.message);
    } else {
      console.log("SMTP server is ready to take messages");
    }
  });
} else {
  console.error("SMTP not configured. Email sending disabled.");
}

// POST /auth/quick-login
router.post("/quick-login", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });
    if (!JWT_SECRET) {
      console.error("JWT_SECRET is not set");
      return res.status(500).json({ message: "Server not configured" });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail, role: "student" });
    if (!user) return res.status(404).json({ message: "Student not found" });

    let student = await Student.findOne({ user_id: user._id });
    if (!student) {
      student = await Student.create({
        user_id: user._id,
        email: user.email,
        profile_complete: false
      });
    }

    const sessionToken = jwt.sign(
      { id: user._id, role: "student" },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token: sessionToken });
  } catch (err) {
    console.error("Quick login error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// POST /auth/recovery
router.post("/recovery", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });
    if (!JWT_SECRET) {
      console.error("JWT_SECRET is not set");
      return res.status(500).json({ message: "Server not configured" });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail, role: "student" });
    if (!user) return res.status(404).json({ message: "Student not found" });

    let student = await Student.findOne({ user_id: user._id });

    if (!student) {
      student = await Student.create({
        user_id: user._id,
        email: user.email,
        profile_complete: false
      });
    }


    const token = jwt.sign(
      { email: student.email, type: "magic" },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    const baseUrl = APP_BASE_URL || "http://localhost:5000";
    const verifyUrl = `${baseUrl}/auth/verify/${token}`;

    if (!transporter) {
      console.error("Email server not configured. Missing SMTP env vars.");
      return res.status(500).json({ message: "Email server not configured" });
    }

    console.log("Sending magic login email to:", student.email);
    console.log("Generated magic link:", verifyUrl);

    try {
      await transporter.sendMail({
        from: SMTP_FROM || "admin@intensivestudyacademy.com",
        to: student.email,
        subject: "Welcome to Intensive Study Academy",
        text:
          "Welcome to Intensive Study Academy. Click below to access your student dashboard. This link expires in 15 minutes.\n\n" +
          verifyUrl,
        html:
          "<p>Welcome to Intensive Study Academy.</p>" +
          "<p>Click below to access your student dashboard. This link expires in 15 minutes.</p>" +
          `<p><a href="${verifyUrl}">${verifyUrl}</a></p>`
      });
      console.log("Magic login email sent successfully to", student.email);
    } catch (sendErr) {
      console.error("sendMail failed:", sendErr);
      return res.status(500).json({ message: "Failed to send email" });
    }

    res.json({ message: "Verification link sent" });
  } catch (err) {
    console.error("Magic login error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// GET /auth/verify/:token
router.get("/verify/:token", async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) return res.status(400).send("Invalid token");

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.type !== "magic") return res.status(400).send("Invalid token");

    const student = await Student.findOne({ email: decoded.email });
    if (!student) return res.status(404).send("Student not found");

    const sessionToken = jwt.sign(
      { id: student.user_id, role: "student" },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const redirectUrl = `/frontend/pages/student-dashboard.html?token=${sessionToken}`;
    res.redirect(redirectUrl);
  } catch (err) {
    console.error("Verify error:", err);
    res.status(400).send("Invalid or expired token");
  }
});

module.exports = router;
