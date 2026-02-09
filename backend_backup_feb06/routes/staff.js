const express = require("express");
const router = express.Router();

const staffController = require("../controllers/staff.controller");

console.log("Loaded staffController:", staffController);

router.post("/login", staffController.staffPasswordLogin);
router.post("/verify-etag", staffController.verifyETag);

module.exports = router;
