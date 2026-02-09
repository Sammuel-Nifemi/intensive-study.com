
const express = require("express");
const router = express.Router();

const upload = require("../utils/upload");
const Material = require("../models/Material");
const auth = require("../middleware/auth");

/* ============================
   UPLOAD MATERIAL (ADMIN & STAFF)
============================ */
router.post(
  "/upload",
  auth,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "File upload failed" });
      }

      const { resourceType, courseCode, session, semester, visibility } = req.body;
      const user = req.user;

      let finalVisibility = "staff";

      if (user.role === "admin") {
        finalVisibility = visibility || "students";
      }

      const material = await Material.create({
        courseCode,
        resourceType,
        session,
        semester,
        filePath: req.file.path,
        visibility: finalVisibility,
        uploadedBy: user.id
      });

      res.json({ message: "Upload successful", material });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Upload failed" });
    }
  }
);


/* ============================
   GET PENDING MATERIALS (ADMIN)
============================ */
router.get("/pending", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }

  const materials = await Material.find({ status: "pending" })
    .populate("uploadedBy", "name email")
    .sort({ createdAt: -1 });

  res.json(materials);
});

/* ============================
   APPROVE MATERIAL (ADMIN)
============================ */
router.put("/:id/approve", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }

  const material = await Material.findByIdAndUpdate(
    req.params.id,
    { status: "approved" },
    { new: true }
  );

  res.json({ message: "Approved", material });
});

/* ============================
   REJECT MATERIAL (ADMIN)
============================ */
router.put("/:id/reject", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }

  await Material.findByIdAndDelete(req.params.id);
  res.json({ message: "Rejected & removed" });
});

router.get("/my-materials", auth, async (req, res) => {
  const materials = await Material.find({
    uploadedBy: req.user.id
  }).sort({ createdAt: -1 });

  res.json(materials);
});



module.exports = router;
