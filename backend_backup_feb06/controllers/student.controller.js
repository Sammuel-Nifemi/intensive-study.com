const Student = require("../models/Student");
const bcrypt = require("bcryptjs");

exports.createStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const exists = await Student.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Student already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = new Student({
      email,
      password: hashedPassword
    });

    await student.save();

    res.status(201).json({ message: "Student created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
