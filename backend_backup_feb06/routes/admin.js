const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");
const auth = require("../middleware/auth");
const { adminOnly } = require("../middleware/roles");

// POST /api/admin/generate-etag
router.post(
  "/generate-etag",
  auth,
  adminOnly,
  adminController.generateETag
);

module.exports = router;

module.exports = router;
