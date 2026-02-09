const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");

router.post("/login", authController.studentLogin);
router.post("/logout", auth, authController.logout);

module.exports = router;
