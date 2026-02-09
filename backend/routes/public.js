const express = require("express");
const router = express.Router();
require("../models/Faculty");

const Program = require("../models/Program");
const StudyCenter = require("../models/StudyCenter");

// =====================
// GET ALL PROGRAMS
// =====================
router.get("/programs", async (req, res) => {
  try {
    const programs = await Program.find().populate("faculty");

    console.log(JSON.stringify(programs, null, 2));

    res.json(programs);
  } catch (err) {
  console.error("PROGRAM FETCH ERROR FULL:", err);
  console.error(err.stack);
  res.status(500).json({ error: err.message });
}
});


module.exports = router;