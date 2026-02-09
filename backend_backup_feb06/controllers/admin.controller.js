
const ETag = require("../models/ETag");
const generateETagUtil = require("../utils/generateETag");

exports.generateETag = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        message: "Request body is missing"
      });
    }

    const { staffId } = req.body;

    if (!staffId) {
      return res.status(400).json({
        message: "staffId is required"
      });
    }

    // ✅ Generate eTag token
    const token = generateETagUtil();

    // ✅ Save to database
    await ETag.create({
      staff: staffId,
      token,
      used: false
    });

    // ✅ Respond
    return res.status(201).json({
      message: "eTag generated successfully",
      token
    });

  } catch (error) {
    console.error("Generate eTag error:", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

exports.generateETag = async (req, res) => {
  try {
    const { staffId, reason } = req.body;

    if (!staffId) {
      return res.status(400).json({ message: "staffId is required" });
    }

    await ETag.updateMany(
      { staff: staffId, used: false },
      { used: true }
    );

    const token = generateETag();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await ETag.create({
      staff: staffId,
      token,
      expiresAt,
      reason
    });

    return res.status(201).json({
      message: "Verification token generated"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
