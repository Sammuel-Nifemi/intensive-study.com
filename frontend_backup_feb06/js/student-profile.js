document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    // window.location.href = "student-login.html";
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/students/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Failed to load profile");

    const data = await res.json();

    // HEADER
    document.getElementById("studentName").textContent =
      data.fullName || "Student";

    document.getElementById("studentMatric").textContent =
      data.matricNumber || "—";

    // ACADEMIC INFO
    document.getElementById("program").textContent =
      data.student?.program || "—";

    document.getElementById("level").textContent =
      data.student?.level || "—";

    document.getElementById("semester").textContent =
      data.student?.semester || "—";

    document.getElementById("studyCenter").textContent =
      data.student?.studyCenter || "—";

  } catch (err) {
    console.error("Profile load error:", err);
  }

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/frontend/pages/student-login.html";
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/student/me", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error();

    const student = await res.json();

    // Welcome text
    const welcomeEl = document.getElementById("welcomeText");
    if (welcomeEl) {
      welcomeEl.textContent = `Welcome, ${student.fullName}`;
    }

    // Academic info
    set("programme", student.programme);
    set("faculty", student.faculty);
    set("level", student.level);
    set("semester", student.semester);
    set("studyCenter", student.studyCenter);

  } catch {
    // window.location.href = "/frontend/pages/student-login.html";
  }
});

function set(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value || "—";
}

  // LOGOUT
  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("token");
    // window.location.href = "/frontend/pages/student-login.html";
  });
});
