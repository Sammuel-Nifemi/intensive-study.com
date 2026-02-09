
/* =====================================================
   STAFF VERIFY LOGIC (MAGIC LINK + PASSWORD CONFIRM)
===================================================== */

const form = document.getElementById("verifyForm");
const messageEl = document.getElementById("verifyMessage");

/* ================= GET E-TAG FROM URL ================= */
const params = new URLSearchParams(window.location.search);
const eTag = params.get("etag");

if (!eTag) {
  showMessage("Invalid or missing sign-in link.", "error");
  throw new Error("E-Tag missing from URL");
}

/* ================= SUBMIT HANDLER ================= */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const password = document
    .getElementById("confirmPasswordInput")
    .value.trim();

  if (!password) {
    showMessage("Please confirm your password.", "error");
    return;
  }

  showMessage("Verifying sign-in…", "info");

  try {
    /* ================= VERIFY E-TAG ================= */
    const res = await fetch("/api/staff/verify-etag", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eTag, password })
    });

    const data = await res.json();

    if (!res.ok) {
      showMessage(data.message || "Verification failed.", "error");
      return;
    }

    /*
      Expected backend response:
      {
        message: "eTag verified successfully",
        staffId,
        email
      }
    */

    /* ================= CREATE STAFF SESSION ================= */
    localStorage.setItem("token", "staff-auth-token");
    localStorage.setItem("role", "staff");

    localStorage.setItem(
      "staffProfile",
      JSON.stringify({
        id: data.staffId,
        email: data.email
      })
    );

    showMessage("Sign-in successful. Redirecting…", "success");

    setTimeout(() => {
      window.location.href = "staff-dashboard.html";
    }, 1000);

  } catch (err) {
    console.error("Staff verify error:", err);
    showMessage("Network error. Please try again.", "error");
  }
});

/* ================= UI MESSAGE ================= */
function showMessage(text, type) {
  messageEl.textContent = text;
  messageEl.className = `login-message ${type}`;
}
