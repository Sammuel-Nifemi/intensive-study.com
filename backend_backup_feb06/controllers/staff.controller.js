const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ETag = require("../models/ETag");

/* ================= STAFF LOGIN ================= */

exports.staffPasswordLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const staff = await User.findOne({ email });
    if (!staff) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    console.log("isVerified:", staff.isVerified);

    const token = jwt.sign(
  {
    staffId: "69837564e88d6950cfacaca2",
    role: "staff"
  },
  process.env.JWT_SECRET,

  { expiresIn: "1d" }
);

    return res.json({
      message: "Login successful",
      token,
      staffId: staff._id,
      isVerified: staff.isVerified
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ================= VERIFY ETAG ================= */

exports.verifyETag = async (req, res) => {
  try {
    const { eTag } = req.body;

    const etag = await ETag.findOne({
      token: eTag,
      used: false,
      expiresAt: { $gt: new Date() }
    });

    if (!etag) {
      return res.status(403).json({ message: "eTag not found" });
    }

    etag.used = true;
    await etag.save();

    return res.json({ message: "eTag verified successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
exports.verifyETag = async (req, res) => {
}