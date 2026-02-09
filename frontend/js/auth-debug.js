

// ===============================
// AUTH DEBUG LOGGER (DEV ONLY)
// ===============================
(function () {
  const token = localStorage.getItem("token") || localStorage.getItem("studentToken");
  const role = localStorage.getItem("role");

  console.group("🛡️ AUTH DEBUG");
  console.log("📍 Page:", window.location.pathname);
  console.log("🔑 studentToken:", token ? "PRESENT ✅" : "MISSING ❌");
  console.log("👤 role:", role || "NONE");
  console.trace("📌 Stack trace");
  console.groupEnd();
})();
