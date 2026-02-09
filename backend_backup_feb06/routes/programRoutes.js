
const express = require("express");
const router = express.Router();
const Program = require("../models/Program");

/**
 * GET all programs (public – for students)
 */
router.get("/public/programs", async (req, res) => {
  try {
    const programs = await Program
      .find()
      .populate("faculty", "name")
      .sort({ name: 1 });

    res.json(programs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch programs" });
  }
});

/**
 * POST add program (admin)
 */
router.post("/programs", async (req, res) => {
  const { name, facultyId } = req.body;

  if (!name || !facultyId) {
    return res.status(400).json({ message: "Name and faculty required" });
  }

  try {
    const program = await Program.create({
      name,
      faculty: facultyId
    });

    res.json(program);
  } catch (err) {
    res.status(500).json({ message: "Failed to create program" });
  }
});

/**
 * DELETE program
 */
router.delete("/programs/:id", async (req, res) => {
  try {
    await Program.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete program" });
  }
});

module.exports = router;
