const express = require("express");
const router = express.Router();
const Faculty = require("../models/Faculty");
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");

// CREATE faculty
router.post("/faculties", auth, adminOnly, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Faculty name required" });
    }

    const faculty = await Faculty.create({
      name,
      createdBy: req.user.id
    });

    res.status(201).json(faculty);
  } catch (err) {
    res.status(500).json({ message: "Failed to create faculty" });
  }
});

// GET all faculties (admin + students later)
router.get("/faculties", auth, async (req, res) => {
  const faculties = await Faculty.find().sort("name");
  res.json(faculties);
});


router.get("/public/faculties", async (req, res) => {
  const faculties = await Faculty.find().sort("name");
  res.json(faculties);
});

const Program = require("../models/Program");

// CREATE program
router.post("/programs", auth, adminOnly, async (req, res) => {
  try {
    const { name, faculty } = req.body;

    if (!name || !faculty) {
      return res.status(400).json({ message: "Program name and faculty required" });
    }

    const program = await Program.create({
      name,
      faculty,
      createdBy: req.user.id
    });

    res.status(201).json(program);
  } catch (err) {
    res.status(500).json({ message: "Failed to create program" });
  }
});

// GET programs (admin)
router.get("/programs", auth, async (req, res) => {
  const programs = await Program.find()
    .populate("faculty", "name")
    .sort("name");
  res.json(programs);
});

// PUBLIC programs (students)
router.get("/public/programs", async (req, res) => {
  const programs = await Program.find()
    .populate("faculty", "name")
    .sort("name");
  res.json(programs);
});


module.exports = router;
