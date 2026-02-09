

/* =====================================================
   COURSE MATERIALS PAGE LOGIC (STABLE FINAL VERSION)
   Purpose:
   - Read selected course from localStorage
   - Display correct course context
   - Show available materials safely (status-based)
===================================================== */

/* ================= PAGE GUARD ================= */
const role = localStorage.getItem("role");
const token = localStorage.getItem("token");

// if (!token || role !== "student") {
//   window.location.href = "../pages/student-login.html";
// }

/* ================= READ COURSE CONTEXT ================= */
const courseCode = localStorage.getItem("selectedCourse");

/* ================= DOM ELEMENTS ================= */
const courseTitleEl = document.getElementById("courseTitle");
const courseSubtitleEl = document.getElementById("courseSubtitle");
const resourceList = document.getElementById("resourceList");

/* ================= SAFETY CHECK ================= */
if (!courseCode) {
  courseTitleEl.textContent = "No Course Selected";
  courseSubtitleEl.textContent =
    "Please return to your dashboard and select a course.";

  resourceList.innerHTML = `
    <li class="resource-item">
      No course context found.
    </li>
  `;

  // Stop execution safely
  return;
}

/* ================= DISPLAY COURSE CONTEXT ================= */
courseTitleEl.textContent = `Course Materials — ${courseCode}`;
courseSubtitleEl.textContent =
  "Approved academic resources for this course.";

/* ================= READ AVAILABILITY (ADMIN → STUDENT) ================= */
function getMaterialAvailability() {
  return JSON.parse(localStorage.getItem("materialAvailability")) || {};
}

/* ================= RENDER STATUS CARDS ================= */
function renderStatusCards(courseCode) {
  const availability = getMaterialAvailability();
  const status = availability[courseCode] || {};

  const items = [
    { key: "summary", label: "Course Summary" },
    { key: "notes", label: "Study Notes" },
    { key: "reference", label: "Reference Resources" },
    { key: "review", label: "Quick Review" }
  ];

  resourceList.innerHTML = "";

  items.forEach(item => {
    const state = status[item.key] || "not_available";

    const li = document.createElement("li");
    li.className = `resource-item state-${state}`;

    let badge = "";
    let actionHTML = "";

    if (state === "available") {
      badge = "🟢 Available";
      actionHTML = `<button class="action-btn">View / Download</button>`;
    }

    if (state === "processing") {
      badge = "⏳ Processing";
      actionHTML = `<button class="action-btn disabled" disabled>Please wait</button>`;
    }

    if (state === "not_available") {
      badge = "🔴 Not Available";
      actionHTML = `<button class="action-btn disabled" disabled>Contact Admin</button>`;
    }

    li.innerHTML = `
      <div class="resource-main">
        <strong>${item.label}</strong>
        <div class="meta">${badge}</div>
      </div>
      <div class="resource-action">
        ${actionHTML}
      </div>
    `;

    resourceList.appendChild(li);
  });
}

// course-materials.js

document.addEventListener("DOMContentLoaded", () => {
  // 1️⃣ Read course from URL
  const params = new URLSearchParams(window.location.search);
  const courseCode = params.get("course");

  if (!courseCode) {
    alert("No course selected");
    window.location.href = "/frontend/pages/student-dashboard.html";
    return;
  }

  // 2️⃣ Show course title
  const titleEl = document.getElementById("courseTitle");
  if (titleEl) {
    titleEl.textContent = `Course Materials — ${courseCode}`;
  }

  // 3️⃣ (NEXT STEP) Fetch materials from backend
  // fetch(`/api/materials/${courseCode}`)
});




/* ================= INITIAL RENDER ================= */
renderStatusCards(courseCode);

/* ================= USAGE TRACKING ================= */
function trackCourseUsage(courseCode) {
  const usage =
    JSON.parse(localStorage.getItem("courseUsage")) || {};

  usage[courseCode] = (usage[courseCode] || 0) + 1;

  localStorage.setItem("courseUsage", JSON.stringify(usage));
}
// Track when materials page is opened
trackCourseUsage(courseCode);

