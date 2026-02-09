
exports.unlockSemesterAccess = async (req, res) => {
  try {
    const user = req.user;

    user.student.semesterAccess = {
      isActive: true,
      semesterId: user.student.semester,
      expiresAt: new Date(
        new Date().setMonth(new Date().getMonth() + 4)
      ) // ~1 semester
    };

    await user.save();

    res.json({ message: "Semester access unlocked" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to unlock access" });
  }
};
