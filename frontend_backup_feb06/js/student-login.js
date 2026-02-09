// ===============================
// STUDENT LOGIN PAGE (ONLY)
// ===============================



document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("studentLoginForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // ✅ ONE TOKEN KEY
      localStorage.setItem("token", data.token);

      // 🚀 REDIRECT
      window.location.href = "/frontend/pages/student-dashboard.html";

    } catch (err) {
      console.error(err);
      alert("Server error. Please try again.");
    }
  });
});
