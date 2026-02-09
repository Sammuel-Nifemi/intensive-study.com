const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const Announcement = require("../models/Announcement");
const BlogPost = require("../models/BlogPost");
const GalleryItem = require("../models/GalleryItem");

/* =========================
   ANNOUNCEMENTS
========================= */
router.post("/announcements", auth, async (req, res) => {
  try {
    const announcement = await Announcement.create({
      title: req.body.title,
      content: req.body.content,
      createdBy: req.user.id
    });

    res.status(201).json(announcement);
  } catch (err) {
    res.status(500).json({ message: "Failed to create announcement" });
  }
});

/* =========================
   BLOG POSTS
========================= */
router.post("/blogs", auth, async (req, res) => {
  try {
    const post = await BlogPost.create({
      title: req.body.title,
      content: req.body.content,
      createdBy: req.user.id
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: "Failed to create blog post" });
  }
});

/* =========================
   GALLERY
========================= */
router.post("/gallery", auth, async (req, res) => {
  try {
    const item = await GalleryItem.create({
      imageUrl: req.body.imageUrl,
      caption: req.body.caption,
      createdBy: req.user.id
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: "Failed to upload gallery item" });
  }
});

module.exports = router;
