require("dotenv").config(); // ✅ MUST be first

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const path = require("path");

const authRoutes = require("./routes/auth");
const resourceRoutes = require("./routes/resourceRoutes");
const studentRoutes = require("./routes/student");
const semesterRoutes = require("./routes/semester");
const materialRoutes = require("./routes/materials");
const webhookRoutes = require("./routes/webhook");
const pastQuestionRoutes = require("./routes/pastQuestions");
const announcementRoutes = require("./routes/announcement.routes");
const blogRoutes = require("./routes/blog.routes");
const galleryRoutes = require("./routes/gallery.routes");
const publicContentRoutes = require("./routes/publicContent.routes");
const mockExamRoutes = require("./routes/mockExams");
const studentAnnouncementRoutes = require("./routes/studentAnnouncement.routes");
const studentAuthRoutes = require("./routes/studentAuth");
const studyCenterRoutes = require("./routes/studyCenterRoutes");
const programRoutes = require("./routes/programRoutes");
const adminContentRoutes = require("./routes/adminContent");
const adminControlRoutes = require("./routes/adminControl");
const magicAuthRoutes = require("./routes/magicAuth");
const coursesRoutes = require("./routes/courses");
const studentCoursesRoutes = require("./routes/studentCourses");
const liveClassesRoutes = require("./routes/liveClasses");
const studentContentRoutes = require("./routes/studentContent");
const app = express();

// 🔗 Connect Database
connectDB();

// 🌍 Global middleware (ORDER MATTERS)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  "/frontend",
  express.static(path.join(__dirname, "..", "frontend"))
);

// 🧾 Request logger (debug-friendly)
app.use((req, res, next) => {
  console.log("➡️", req.method, req.originalUrl);
  next();
});

// 🔐 Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/resources", resourceRoutes);
app.use("/api/semesters", semesterRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/webhooks", webhookRoutes);
app.use("/api/past-questions", pastQuestionRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/student", require("./routes/gpa.routes"));
app.use("/api/student", require("./routes/pdf.routes"));
app.use("/api/student", require("./routes/calendar.routes"));
app.use("/api/announcements", announcementRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api", publicContentRoutes);
app.use("/api/students", studentAnnouncementRoutes);
app.use("/api/students", studentAuthRoutes);
app.use("/api", studyCenterRoutes);
app.use("/api/study-centers", require("./routes/studyCenters"));
app.use("/uploads", express.static("uploads"));
app.use("/api/admin/public", require("./routes/public"));
app.use("/api/admin", require("./routes/adminFaculty"));
app.use("/api/admin", programRoutes);
app.use("/api/admin", adminContentRoutes);
app.use("/api/admin", adminControlRoutes);
app.use("/auth", magicAuthRoutes);
app.use("/courses", coursesRoutes);
app.use("/student", studentCoursesRoutes);
app.use("/student", liveClassesRoutes);
app.use("/student", studentContentRoutes);
app.use("/api/mock-exams", mockExamRoutes);



// ❤️ Health check
app.get("/", (req, res) => {
  res.send("API running...");
});

// 🚀 Start server (LAST)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
