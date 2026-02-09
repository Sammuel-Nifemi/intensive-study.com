

const form = document.getElementById("staffLoginForm");
const messageEl = document.getElementById("loginMessage");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("emailInput").value.trim();
  const password = document.getElementById("passwordInput").value.trim();

  if (!email || !password) {
    showMessage("Please enter email and password", "error");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/staff/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
     localStorage.setItem("staffToken", data.token);

    if (!res.ok) {
      showMessage("Invalid login details", "error");
      return;
    }

    // ✅ THIS IS CRITICAL
    completeLogin(data.token, data.staffId, email);

  } catch (err) {
    console.error(err);
    showMessage("Server error", "error");
  }
});

function completeLogin(token, staffId, email) {
  localStorage.setItem("token", token);
  localStorage.setItem("role", "staff");
  localStorage.setItem(
    "staffProfile",
    JSON.stringify({ id: staffId, email })
  );


  window.location.href = "staff-dashboard.html";
}

function showMessage(text, type) {
  messageEl.textContent = text;
  messageEl.className = `login-message ${type}`;
}
