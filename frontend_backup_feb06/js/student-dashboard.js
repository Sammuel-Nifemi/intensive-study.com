

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) return; // auth guard handles redirect

  try {
    const res = await fetch("http://localhost:5000/api/students/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Failed to load dashboard");

    const data = await res.json();
    const student = data.student || data;

    const resolvedName =
      student.fullName ||
      `${student.firstName || ""} ${student.lastName || ""}`.trim() ||
      "Student";

    setText("studentName", resolvedName);

    setText("profileTitle", student.title);
    setText("profileName", resolvedName);
    setText("profileGender", student.gender);
    setText("profileEmail", student.email);
    setText("profilePhone", student.phone);

    setText("program", student.programme || student.department);
    setText("faculty", student.faculty);
    setText("level", student.level);
    setText("semester", student.semester);

    loadAnnouncements(token);
    loadAutoCourses(student);

  } catch (err) {
    console.error("Dashboard error:", err);
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "/frontend/pages/student-login.html";
    });
  }
});

// =========================
// COURSES
// =========================
function loadAutoCourses(student) {
  const allCourses = JSON.parse(localStorage.getItem("courses")) || [];
  const compulsoryList = document.getElementById("compulsoryCourses");
  const electiveList = document.getElementById("electiveCourses");
  if (!compulsoryList || !electiveList) return;

  compulsoryList.innerHTML = "";
  electiveList.innerHTML = "";

  const matchedCourses = allCourses.filter(c =>
    c.programId === student.programId &&
    String(c.level) === String(student.level) &&
    c.semester === student.semester
  );

  if (!matchedCourses.length) {
    compulsoryList.innerHTML = "<li>No courses assigned yet.</li>";
    return;
  }

  matchedCourses.forEach(course => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${course.code}</strong> — ${course.title}`;
    course.type === "C"
      ? compulsoryList.appendChild(li)
      : electiveList.appendChild(li);
  });
}

// =========================
// ANNOUNCEMENTS
// =========================
async function loadAnnouncements(token) {
  const list = document.getElementById("announcementList");
  if (!list) return;

  try {
    const res = await fetch("http://localhost:5000/api/students/announcements", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const announcements = await res.json();
    list.innerHTML = announcements.length
      ? announcements.map(a => `<li><strong>${a.title}</strong><br>${a.message}</li>`).join("")
      : "<li>No announcements yet.</li>";

  } catch {
    list.innerHTML = "<li>Unable to load announcements.</li>";
  }
}

// =========================
// HELPERS
// =========================
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value || "—";
}
