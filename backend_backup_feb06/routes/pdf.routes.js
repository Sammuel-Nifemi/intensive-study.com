const express = require("express");
const router = express.Router();

const { downloadResultsPDF } = require("../controllers/pdf.controller");
const auth = require("../middleware/auth");
const studentOnly = require("../middleware/studentOnly");

router.get("/results/pdf", auth, studentOnly, downloadResultsPDF);

module.exports = router;
