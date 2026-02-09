require("dotenv").config(); // ✅ MUST be first

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/adminRoutes");
const staffRoutes = require("./routes/staff");
const resourceRoutes = require("./routes/resourceRoutes");
const studentRoutes = require("./routes/student");
const semesterRoutes = require("./routes/semester");
const adminReferralRoutes = require("./routes/adminReferralRoutes");
const materialRoutes = require("./routes/materials");
const webhookRoutes = require("./routes/webhook");
const pastQuestionRoutes = require("./routes/pastQuestions");
const staffContentRoutes = require("./routes/staffContent.routes");
const announcementRoutes = require("./routes/announcement.routes");
const blogRoutes = require("./routes/blog.routes");
const galleryRoutes = require("./routes/gallery.routes");
const publicContentRoutes = require("./routes/publicContent.routes");
const studentAnnouncementRoutes = require("./routes/studentAnnouncement.routes");
const studentAuthRoutes = require("./routes/studentAuth");
const studyCenterRoutes = require("./routes/studyCenterRoutes");
const staffAnnouncementsRouter = require("./routes/staffAnnouncements");

const app = express();

// 🔗 Connect Database
connectDB();

// 🌍 Global middleware (ORDER MATTERS)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🧾 Request logger (debug-friendly)
app.use((req, res, next) => {
  console.log("➡️", req.method, req.originalUrl);
  next();
});
app.use(express.json());
// 🔐 Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin", adminRoutes);
app.use("/api/admin/referrals", adminReferralRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/semesters", semesterRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/webhooks", webhookRoutes);
app.use("/api/past-questions", pastQuestionRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/student", require("./routes/gpa.routes"));
app.use("/api/student", require("./routes/pdf.routes"));
app.use("/api/student", require("./routes/calendar.routes"));
app.use("/api/staff", staffContentRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api", publicContentRoutes);
app.use("/api/students", studentAnnouncementRoutes);
app.use("/api/students", studentAuthRoutes);
app.use("/api/admin", studyCenterRoutes);
app.use("/api", studyCenterRoutes);
app.use("/api/study-centers", require("./routes/studyCenters"));
app.use("/api/admin", require("./routes/programRoutes"));
app.use("/api/staff", staffAnnouncementsRouter);
app.use("/uploads", express.static("uploads"));
app.use("/api/staff", staffRoutes); // auth stays here




// ❤️ Health check
app.get("/", (req, res) => {
  res.send("API running...");
});

// 🚀 Start server (LAST)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
