document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("adminLoginForm");
  const msg = document.getElementById("msg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    msg.textContent = "Logging in...";

    try {
      const res = await fetch("http://localhost:5000/api/auth/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        msg.textContent = data.message || "Login failed";
        return;
      }

      // ✅ Save admin auth (separate from staff)
      localStorage.setItem("adminToken", data.token);

      // 🚀 Redirect
      window.location.href = "/frontend/pages/admin-dashboard.html";

    } catch (err) {
      console.error(err);
      msg.textContent = "Server error. Try again.";
    }
  });
});
