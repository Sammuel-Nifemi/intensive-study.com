require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const hashedPassword = await bcrypt.hash("password123", 10);

 await User.create({
  fullName: "Test Student",
  email: "student1@test.com",
  password: hashedPassword,
  role: "student",
  status: "active",
  student: {
    onboardingCompleted: false
  }
});

  console.log("✅ Student created");
  process.exit(0);
})();
