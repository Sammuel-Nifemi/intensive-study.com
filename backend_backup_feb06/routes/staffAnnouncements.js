const express = require("express");
const router = express.Router();
const staffAuth = require("../middleware/staffAuth");
const upload = require("../middleware/upload");
const Announcement = require("../models/Announcement");

router.post(
  "/announcements",
  upload.single("image"),
  async (req, res) => {
    try {
      console.log("BODY:", req.body);
      console.log("FILE:", req.file);

      const { title, message } = req.body;

      const image = req.file ? req.file.filename : null;

      const announcement = new Announcement({
        title,
        message,
        image
      });

      await announcement.save();

      res.json({ success: true });

    } catch (err) {
      console.error("Announcement error:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
