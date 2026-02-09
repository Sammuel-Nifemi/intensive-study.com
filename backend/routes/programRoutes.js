const express = require("express");
const router = express.Router();

const Program = require("../models/Program");
require("../models/Faculty"); // important for populate
const StudyCenter = require("../models/StudyCenter");
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");

// CREATE PROGRAM
router.post("/programs", auth, adminOnly, async (req, res) => {
  try {
    const { name, faculty } = req.body;

    if (!name || !faculty) {
      return res.status(400).json({ message: "Name and faculty required" });
    }

    const program = await Program.create({
      name,
      faculty
    });

    res.json(program);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET PROGRAMS
router.get("/programs", auth, adminOnly, async (req, res) => {
  try {
    const programs = await Program.find().populate("faculty");
    res.json(programs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// ======================
// GET ALL STUDY CENTERS
// ======================
router.get("/study-centers", auth, adminOnly, async (req, res) => {
  try {
    const centers = await StudyCenter.find().sort({ createdAt: -1 });
    res.json(centers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch centers" });
  }
});

// ======================
// CREATE STUDY CENTER
// ======================
router.post("/study-centers", auth, adminOnly, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) return res.status(400).json({ message: "Name required" });

    const center = await StudyCenter.create({ name });

    res.json(center);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Failed to create" });
  }
});

// ======================
// DELETE STUDY CENTER
// ======================
router.delete("/study-centers/:id", auth, adminOnly, async (req, res) => {
  await StudyCenter.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});



// DELETE PROGRAM
router.delete("/programs/:id", auth, adminOnly, async (req, res) => {
  await Program.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
