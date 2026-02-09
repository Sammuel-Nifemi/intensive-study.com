
(async function protectStudentPage() {
  const token = localStorage.getItem("token");

  // 🚫 No token → login
  if (!token) {
    window.location.href = "/login.html";
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/students/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // 🚫 Not authenticated
    if (res.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login.html";
      return;
    }

    // 🚫 Profile not completed
    if (res.status === 403) {
      window.location.href = "/complete-profile.html";
      return;
    }

    // ✅ Allowed
    const data = await res.json();
    window.studentData = data; // available globally

  } catch (err) {
    console.error("Auth check failed", err);
    window.location.href = "/login.html";
  }
})();
