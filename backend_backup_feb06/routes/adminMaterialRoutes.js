const express = require("express");
// const Material = require("../models/Material");
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");

const router = express.Router();

// ==============================
// GET pending materials
// ==============================
router.get("/materials/pending", auth, adminOnly, async (req, res) => {
  try {
    const materials = await Material.find({ status: "pending" })
      .populate("uploadedBy", "fullname email")
      .sort({ createdAt: -1 });

    res.json(materials);
  } catch (err) {
    res.status(500).json({ message: "Failed to load materials" });
  }
});

// ==============================
// APPROVE material
// ==============================
router.put("/materials/:id/approve", auth, adminOnly, async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    material.status = "approved";
    material.approvedBy = req.user.id;
    material.approvedAt = new Date();

    await material.save();

    res.json({ message: "Material approved" });
  } catch (err) {
    res.status(500).json({ message: "Approval failed" });
  }
});

// ==============================
// REJECT material
// ==============================
router.put("/materials/:id/reject", auth, adminOnly, async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    material.status = "rejected";
    await material.save();

    res.json({ message: "Material rejected" });
  } catch (err) {
    res.status(500).json({ message: "Rejection failed" });
  }
});

module.exports = router;
