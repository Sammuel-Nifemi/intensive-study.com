// routes/staffAnnouncements.js
const express = require("express");
const router = express.Router();
const Announcement = require("../models/Announcement");

// POST /api/staff/announcements
router.post("/announcements", async (req, res) => {
  try {
    const { title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const announcement = await Announcement.create({
      title,
      message,
      audience: "students"
    });

    res.json({ message: "Announcement published", announcement });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
