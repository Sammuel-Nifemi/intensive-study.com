const express = require("express");
const router = express.Router();

const {
  getGPA,
  getMyResults
} = require("../controllers/gpa.controller");
const auth = require("../middleware/auth");
const studentOnly = require("../middleware/studentOnly");

router.get("/gpa", auth, studentOnly, getGPA);
router.get("/results", auth, studentOnly, getMyResults);


module.exports = router;
