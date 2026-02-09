// ===================================
// STUDENT AUTH GUARD (GLOBAL)
// ===================================
// ===============================
// STUDENT AUTH GUARD (GLOBAL)
// ===============================

// ===============================
// STUDENT AUTH GUARD (PROTECTED PAGES ONLY)
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/frontend/pages/student-login.html";
  }
  if (!window.location.pathname.includes("dashboard")) return;

});
