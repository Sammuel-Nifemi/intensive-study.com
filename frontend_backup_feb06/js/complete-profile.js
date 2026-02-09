document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/frontend/pages/student-login.html";
    return;
  }

  /* =========================
     LOAD EXISTING PROFILE
  ========================= */
  try {
    const res = await fetch("http://localhost:5000/api/students/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Unauthorized");

    const student = await res.json();

    document.getElementById("studentName").textContent = student.fullName || "—";
    document.getElementById("studentMatric").textContent = student.matric || "—";

    document.getElementById("programme").textContent = student.programme || "—";
    document.getElementById("level").textContent = student.level || "—";
    document.getElementById("semester").textContent = student.semester || "—";
    document.getElementById("studyCenter").textContent = student.studyCenter || "—";
  } 


  catch (err) {
    console.error(err);
    window.location.href = "/frontend/pages/student-login.html";
  }

  /* =========================
     SUBMIT PROFILE FORM
  ========================= */
  const form = document.getElementById("completeProfileForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const phone = document.getElementById("phone").value.trim();

    try {
      const res = await fetch(
        "http://localhost:5000/api/students/complete-profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ firstName, lastName, phone })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Profile update failed");
        return;
      }

      // ✅ Success → dashboard
      window.location.href = "/frontend/pages/student-dashboard.html";

    } catch (err) {
      console.error(err);
      alert("Server error. Try again.");
    }
  });
});
