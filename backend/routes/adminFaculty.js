const express = require("express");
const router = express.Router();
const Faculty = require("../models/Faculty");
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");

// CREATE
router.post("/faculties", auth, adminOnly, async (req, res) => {
  try {
    const faculty = new Faculty({
      name: req.body.name,
      createdBy: req.user?.id || null
    });

    await faculty.save();
    res.json(faculty);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ
router.get("/faculties", auth, adminOnly, async (req, res) => {
  const faculties = await Faculty.find().sort({ createdAt: -1 });
  res.json(faculties);
});

// DELETE
router.delete("/faculties/:id", auth, adminOnly, async (req, res) => {
  await Faculty.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
