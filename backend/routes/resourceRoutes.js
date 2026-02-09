const express = require("express");
const router = express.Router();

// Middlewares
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");

// Controller
const {
  uploadResource,
} = require("../controllers/resourceController");

/*
  RESOURCE ROUTES
  ----------------
  Upload course materials, summaries, past questions
*/

// Upload resource (staff & admin)
router.post(
  "/upload",
  auth,                  // ✅ user must be logged in
  upload.single("file"), // ✅ handle file upload
  uploadResource         // ✅ business logic
);

module.exports = router;

