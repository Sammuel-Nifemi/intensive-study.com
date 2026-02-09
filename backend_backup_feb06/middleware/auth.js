

const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({ message: "No token" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED TOKEN:", decoded);

    const user = await User.findById(decoded.staffId || decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.role !== "staff" && user.role !== "admin") {
      return res.status(403).json({ message: "Not staff" });
    }

    req.user = user;

    next();

  } catch (err) {
    console.error("Auth middleware:", err);
    res.status(401).json({ message: "Invalid token" });
  }
};
