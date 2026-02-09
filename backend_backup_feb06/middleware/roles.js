exports.studentOnly = (req, res, next) => {
  if (req.user.role !== "student")
    return res.status(403).json({ message: "Students only" });
  next();
};

exports.staffOnly = (req, res, next) => {
  if (!["staff", "admin"].includes(req.user.role))
    return res.status(403).json({ message: "Staff only" });
  next();
};

exports.adminOnly = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin only" });
  next();
};
