


/* =====================================================
   STAFF DASHBOARD GUARD & DISPLAY
===================================================== */

// ===== STAFF AUTH GUARD =====

const token = localStorage.getItem("staffToken");
const role = localStorage.getItem("role");
console.log("STAFF TOKEN:", localStorage.getItem("staffToken"));


if (!token || role !== "staff") {
  alert("Staff access only");
  window.location.href = "/frontend/pages/staff-login.html";
  return;
}



// Display identity
document.getElementById("staffEmail").textContent =
  staffProfile.email || "—";

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("staffProfile");

  window.location.href = "staff-login.html";
});
/* ================= LOAD ASSIGNED COURSES ================= */

const assignments =
  JSON.parse(localStorage.getItem("staffAssignments")) || [];

const allCourses =
  JSON.parse(localStorage.getItem("courses")) || [];

const assigned = assignments.find(
  a => a.email === staffProfile.email
);

if (assigned) {
  const staffCourses = allCourses.filter(c =>
    assigned.courseIds.includes(c.id)
  );

  console.log("Assigned courses:", staffCourses);
  // Later: render to UI (materials / mocks)
}

// Password eye toggle
const passwordInput = document.getElementById("newPassword");
const togglePassword = document.getElementById("togglePassword");

if (passwordInput && togglePassword) {
  togglePassword.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    togglePassword.textContent = isHidden ? "🙈" : "👁";
  });
}
