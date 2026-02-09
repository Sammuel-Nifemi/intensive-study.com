document.addEventListener("DOMContentLoaded", () => {
  initRegistration();
});

async function initRegistration() {
  const programSelect = document.getElementById("programSelect");
  const facultyInput = document.getElementById("faculty");
  const studyCenterSelect = document.getElementById("studyCenter");
  const form = document.getElementById("studentRegisterForm");

  // ✅ PASSWORD TOGGLE (MUST BE HERE)
  const toggle = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("password");

  if (toggle && passwordInput) {
    toggle.addEventListener("click", () => {
      passwordInput.type =
        passwordInput.type === "password" ? "text" : "password";
    });
  }

  // ✅ VALIDATION AFTER
  if (!programSelect || !facultyInput || !studyCenterSelect || !form) {
    console.error("Required form elements not found");
    return;
  }


  /* =========================
   LOAD PROGRAMS
========================= */
try {
  const res = await fetch("http://localhost:5000/api/admin/public/programs");
  const programs = await res.json();

  programSelect.innerHTML = `<option value="">Select program</option>`;

  programs.forEach(p => {
    const option = document.createElement("option");

    // ✅ use program ID as truth
    option.value = p._id;

    // ✅ user-friendly label
    option.textContent = p.name;

    // ✅ store faculty name only for autofill
    option.dataset.faculty = p.faculty?.name || "";

    programSelect.appendChild(option);
  });

  // ✅ auto-fill faculty on program change
  programSelect.addEventListener("change", () => {
    const selected = programSelect.selectedOptions[0];
    facultyInput.value = selected?.dataset.faculty || "";
  });

} catch (err) {
  console.error("Failed to load programs", err);
}


  /* =========================
     LOAD STUDY CENTERS
  ========================= */
  try {
const res = await fetch("http://localhost:5000/api/admin/public/study-centers");
    const centers = await res.json();

    studyCenterSelect.innerHTML =
      `<option value="">Select study center</option>`;

    centers.forEach(c => {
      const option = document.createElement("option");
      option.value = c.name;
      option.textContent = `${c.name} (${c.state})`;
      studyCenterSelect.appendChild(option);
    });

  } catch (err) {
    console.error("Failed to load study centers", err);

    const res = await fetch("/api/admin/public/study-centers");
const centers = await res.json();

studyCenterSelect.innerHTML =
  `<option value="">Select study center</option>`;

centers.forEach(c => {
  const option = document.createElement("option");
  option.value = c.name;
  option.textContent = `${c.name} (${c.state})`;
  studyCenterSelect.appendChild(option);
});

// 🔍 MAKE IT SEARCHABLE
new TomSelect("#studyCenter", {
  placeholder: "Select or search study center",
  allowEmptyOption: true,
  sortField: {
    field: "text",
    direction: "asc"
  }
});
}



  /* =========================
     SUBMIT FORM
  ========================= */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      title: form.title.value,
      fullName: form.fullName.value,
      gender: form.gender?.value,
      phone: form.phone.value,
      email: form.email.value,
      password: form.password.value,
      program: form.program.value,
      faculty: form.faculty.value,
      level: form.level.value,
      semester: form.semester.value,
      studyCenter: form.studyCenter.value
    };

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      alert("Registration successful. Please log in.");
      window.location.href = "student-login.html";

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  });
}
