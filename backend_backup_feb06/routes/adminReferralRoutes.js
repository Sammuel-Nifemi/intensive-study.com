const express = require("express");
const Referral = require("../models/Referral");
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");

const router = express.Router();

/**
 * GET /api/admin/referrals
 * Admin: View all referrals
 */
router.get("/referrals", auth, adminOnly, async (req, res) => {
  try {
    const referrals = await Referral.find()
      .populate("referrer", "fullname email")
      .populate("usersRegistered", "fullname email createdAt")
      .sort({ createdAt: -1 });

    res.json(referrals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load referrals" });
  }
});

/**
 * GET /api/admin/referrals/summary
 * Admin: Quick stats
 */
router.get("/referrals/summary", auth, adminOnly, async (req, res) => {
  try {
    const totalReferrals = await Referral.countDocuments();
    const activeReferrals = await Referral.countDocuments({ isActive: true });

    const topReferrer = await Referral.findOne()
      .sort({ usageCount: -1 })
      .populate("referrer", "fullname email");

    res.json({
      totalReferrals,
      activeReferrals,
      topReferrer
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load summary" });
  }
});

module.exports = router;
