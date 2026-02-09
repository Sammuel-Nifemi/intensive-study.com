const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");

/* ======================
   TEMP SEED ROUTES
   ====================== */

router.post("/seed-admin", async (req, res) => {
  try {
    const exists = await User.findOne({ email: "admin@isa.com" });
    if (exists) return res.json({ message: "Admin already exists" });

    const hashed = await bcrypt.hash("admin123", 10);

    const admin = await User.create({
      fullName: "Super Admin",
      email: "admin@isa.com",
      password: hashed,
      role: "admin"
    });

    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: "Seed admin failed" });
  }
});

/* ======================
   AUTH ROUTES
   ====================== */

router.post("/login", authController.login);
router.post("/student-login", authController.studentLogin); // student-only
router.post("/register", authController.register);
router.post("/logout", authMiddleware, authController.logout);
router.get("/me", authMiddleware, authController.getMe);


module.exports = router;
