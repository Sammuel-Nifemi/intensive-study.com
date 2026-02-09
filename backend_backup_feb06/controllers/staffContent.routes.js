const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const staffOnly = require("../middleware/staffOnly");
const upload = require("../middleware/upload");

const {
  createAnnouncement,
  createBlog,
  createGalleryItem
} = require("../controllers/staffContent.controller");

/* =========================
   STAFF CONTENT CREATION
========================= */

// Announcements
router.post(
  "/announcements",
  auth,
  staffOnly,
  createAnnouncement
);

// Blog posts
router.post(
  "/blogs",
  auth,
  staffOnly,
  createBlog
);

// Gallery uploads (image / pdf)
router.post(
  "/gallery",
  auth,
  staffOnly,
  upload.single("file"),
  createGalleryItem
);

module.exports = router;
