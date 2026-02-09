
const express = require("express");
const router = express.Router();
const Faculty = require("../models/Faculty");
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");

router.post("/", auth, adminOnly, async (req, res) => {
  try {
    const faculty = await Faculty.create(req.body);
    res.status(201).json(faculty);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/", auth, adminOnly, async (req, res) => {
  const faculties = await Faculty.find({ status: "active" });
  res.json(faculties);
});

module.exports = router;
