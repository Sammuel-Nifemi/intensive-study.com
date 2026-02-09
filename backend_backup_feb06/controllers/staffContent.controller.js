const Announcement = require("../models/Announcement");
const Blog = require("../models/Blog");
const Gallery = require("../models/Gallery");

/* =========================
   STAFF: CREATE ANNOUNCEMENT
========================= */
exports.createAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.create({
      title: req.body.title,
      message: req.body.message,
      createdBy: req.user.id
    });

    res.status(201).json(announcement);
  } catch (err) {
    res.status(500).json({ message: "Failed to create announcement" });
  }
};

/* =========================
   STAFF: CREATE BLOG POST
========================= */
exports.createBlog = async (req, res) => {
  try {
    const blog = await Blog.create({
      title: req.body.title,
      content: req.body.content,
      published: req.body.published ?? true,
      author: req.user.id
    });

    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ message: "Failed to create blog post" });
  }
};

/* =========================
   STAFF: UPLOAD GALLERY ITEM
========================= */
exports.createGalleryItem = async (req, res) => {
  try {
    const galleryItem = await Gallery.create({
      title: req.body.title,
      description: req.body.description,
      fileUrl: req.file.path,
      fileType: req.file.mimetype.includes("pdf") ? "pdf" : "image",
      uploadedBy: req.user.id
    });

    res.status(201).json(galleryItem);
  } catch (err) {
    res.status(500).json({ message: "Failed to upload gallery item" });
  }
};
