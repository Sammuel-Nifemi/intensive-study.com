
  import { trackUsage, canUseFree } from "../js/usage-engine.js";
  import { pastQuestions } from "../js/past-questions.js";

  const studentId = "NOU233396887"; // mock logged-in student

  window.openPastQuestion = function (pq) {

    if (!canUseFree(studentId, "pastQuestions")) {
      alert("You have exhausted your free Past Question access.");
      return;
    }

    trackUsage(studentId, "pastQuestions");

    window.location.href = pq.file;
  };

export const pastQuestions = [
  {
    courseCode: "GST101",
    title: "Use of English",
    session: "2021/2022",
    semester: "First",
    file: "../uploads/past-questions/gst101-2021-first.pdf",
    visibility: "students"
  },
  {
    courseCode: "GST105",
    title: "History and Philosophy of Science",
    session: "2020/2021",
    semester: "Second",
    file: "../uploads/past-questions/gst105-2020-second.pdf",
    visibility: "students"
  }
];
// course-materials.js

document.addEventListener("DOMContentLoaded", () => {
  // 1️⃣ Read course from URL
  const params = new URLSearchParams(window.location.search);
  const courseCode = params.get("course");

  if (!courseCode) {
    alert("No course selected");
    window.location.href = "/student-dashboard.html";
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
