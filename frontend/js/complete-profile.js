document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/frontend/pages/student-login.html";
    return;
  }

  const programSelect = document.getElementById("program");
  const facultyInput = document.getElementById("faculty");
  const studyCenterSelect = document.getElementById("studyCenter");

  try {
    const res = await fetch("http://localhost:5000/api/admin/public/programs");
    const programs = await res.json();

    programSelect.innerHTML = `<option value="">Select program</option>`;
    programs.forEach(p => {
      const option = document.createElement("option");
      option.value = p._id;
      option.textContent = p.name;
      option.dataset.faculty = p.faculty?.name || "";
      programSelect.appendChild(option);
    });

    programSelect.addEventListener("change", () => {
      const selected = programSelect.selectedOptions[0];
      facultyInput.value = selected?.dataset.faculty || "";
    });
  } catch (err) {
    console.error("Failed to load programs", err);
  }

  try {
    const res = await fetch("http://localhost:5000/api/study-centers");
    const centers = await res.json();

    studyCenterSelect.innerHTML = `<option value="">Select study center</option>`;
    centers.forEach(c => {
      const option = document.createElement("option");
      option.value = c._id;
      option.textContent = c.name;
      studyCenterSelect.appendChild(option);
    });
  } catch (err) {
    console.error("Failed to load study centers", err);
  }

  const form = document.getElementById("completeProfileForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      study_center: studyCenterSelect.value,
      program: programSelect.value,
      faculty: facultyInput.value,
      level: document.getElementById("level").value,
      semester: document.getElementById("semester").value
    };

    try {
      const res = await fetch("http://localhost:5000/api/students/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Profile update failed");
        return;
      }

      const success = document.getElementById("profileSuccess");
      if (success) success.hidden = false;
    } catch (err) {
      console.error(err);
      alert("Server error. Try again.");
    }
  });

  document.getElementById("continueToDashboard")?.addEventListener("click", () => {
    window.location.href = "/frontend/pages/student-dashboard.html";
  });
});
