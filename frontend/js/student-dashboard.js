
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


document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const urlToken = params.get("token");
  if (urlToken) {
    localStorage.setItem("authToken", urlToken);
    window.history.replaceState({}, document.title, window.location.pathname);
  }
  applyTheme();
  loadStudent();
});

async function loadStudent() {
  const token = localStorage.getItem("authToken");

  if (!token) {
    window.location.href = "student-login.html";
    return;
  }

  try {
    console.log("TOKEN:", token);
    const res = await fetch("http://localhost:5000/api/students/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem("authToken");
        window.location.href = "/frontend/pages/student-login.html";
        return;
      }
      if (res.status === 403) {
        window.location.href = "/frontend/pages/complete-profile.html";
        return;
      }
      throw new Error(`Dashboard request failed (${res.status})`);
    }

    const data = await res.json();
    const student = data.student || data;

    console.log("DASHBOARD:", data);

    set("studentName", student.name || student.fullName);
    set("profileName", student.name || student.fullName);
    set("profileEmail", student.email);
    set("profileTitle", student.title);
    set("profileGender", student.gender);
    set("profilePhone", student.phone);

    set("program", student.program);
    set("faculty", student.faculty);
    set("level", student.level);
    set("semester", student.semester);
    set("studyCenter", student.studyCenter?.name || student.studyCenter);

    if (student.profile_complete === false) {
      window.location.href = "/frontend/pages/complete-profile.html";
      return;
    }

    loadAnnouncements(token);
    loadAutoCourses(student);

  } catch (err) {
    console.error(err);
  }
}

function set(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value || "—";
}
function applyTheme() {
  const theme = localStorage.getItem("theme") || "classic";
  document.body.setAttribute("data-theme", theme);
}
