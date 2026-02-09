document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("adminLoginForm");
  const msg = document.getElementById("msg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    msg.textContent = "Logging in...";

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
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

      // 🔐 Role check (THIS IS THE KEY)
      if (data.role !== "admin") {
        msg.textContent = "Admins only";
        localStorage.clear();
        return;
      }

      // ✅ Save auth
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", "admin");

      // 🚀 Redirect
      window.location.href = "/frontend/pages/admin-dashboard.html";

    } catch (err) {
      console.error(err);
      msg.textContent = "Server error. Try again.";
    }
  });
});
