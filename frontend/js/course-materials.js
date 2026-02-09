const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/frontend/pages/student-login.html";
}

async function loadStudentProfile() {
  try {
    const res = await fetch("http://localhost:5000/api/students/me", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to load student");

    const data = await res.json();
    const student = data.student || data;

    setText("studentNameSummary", student.fullName || "Student");
    setText("summaryProgram", student.program || "—");
    setText("summaryFaculty", student.faculty || "—");
    setText("summaryLevel", student.level || "—");
    setText("summarySemester", student.semester || "—");

    return student;
  } catch (err) {
    console.error("Failed to load student profile:", err);
    return null;
  }
}

async function renderCourseList() {
  const listEl = document.getElementById("courseList");
  if (!listEl) return;

  const student = await loadStudentProfile();
  const courses = student?.courses || [];

  if (!courses.length) {
    listEl.innerHTML = "<p>No courses found. Please complete your academic setup.</p>";
    return;
  }

  listEl.innerHTML = courses.map(course => {
    const code = course.code || course.courseCode || "";
    const title = course.title || course.name || "";
    return `
      <div class="course-card">
        <div class="course-header">
          <strong>${code}</strong>
          <div class="meta">${title}</div>
        </div>
        <div class="course-actions">
          <button class="action-btn" data-action="download" data-course="${code}">Download Materials</button>
          <button class="action-btn" data-action="mock" data-course="${code}">Practice Mock</button>
        </div>
      </div>
    `;
  }).join("");

  listEl.querySelectorAll("button[data-course]").forEach(btn => {
    btn.addEventListener("click", () => {
      const course = btn.getAttribute("data-course");
      if (!course) return;
      const action = btn.getAttribute("data-action");
      if (action === "download") {
        downloadMaterials(course);
        return;
      }
      if (action === "mock") {
        localStorage.setItem("selectedCourse", course);
        window.location.href = `/frontend/pages/mock-exams.html?course=${course}`;
      }
    });
  });
}

async function downloadMaterials(course) {
  try {
    const res = await fetch(
      `http://localhost:5000/api/materials?course=${encodeURIComponent(course)}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.message || "Failed to download materials");
      return;
    }

    const blob = await res.blob();
    const cd = res.headers.get("content-disposition") || "";
    const match = cd.match(/filename="?([^";]+)"?/i);
    const filename = match ? match[1] : `${course}-materials`;

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Download error:", err);
    alert("Failed to download materials");
  }
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

document.addEventListener("DOMContentLoaded", () => {
  renderCourseList();
});


