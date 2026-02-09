// ================= ROLE GUARD =================
const role = localStorage.getItem("role");
if (role !== "admin") {
  alert("Admins only");
  window.location.href = "index.html";
}

// ================= STORAGE =================
const store = {
  faculties: JSON.parse(localStorage.getItem("faculties")) || [],
  courses: JSON.parse(localStorage.getItem("courses")) || []
};

function save() {
  localStorage.setItem("faculties", JSON.stringify(store.faculties));
  localStorage.setItem("courses", JSON.stringify(store.courses));
  updateStats();
  renderFaculties();
  renderCourses();
}

// ================= DOM =================
const facultyInput = document.getElementById("facultyInput");
const addFacultyBtn = document.getElementById("addFacultyBtn");
const facultyList = document.getElementById("facultyList");

const programInput = document.getElementById("programInput");
const programFacultySelect = document.getElementById("programFacultySelect");
const addProgramBtn = document.getElementById("addProgramBtn");
const programList = document.getElementById("programList");

const courseProgramSelect = document.getElementById("courseProgramSelect");
const courseLevelSelect = document.getElementById("courseLevelSelect");
const courseSemesterSelect = document.getElementById("courseSemesterSelect");
const courseTypeSelect = document.getElementById("courseTypeSelect");
const courseCodeInput = document.getElementById("courseCodeInput");
const courseTitleInput = document.getElementById("courseTitleInput");
const addCourseBtn = document.getElementById("addCourseBtn");

const courseList = document.getElementById("courseList");

const statFaculties = document.getElementById("statFaculties");
const statPrograms = document.getElementById("statPrograms");
const statCourses = document.getElementById("statCourses");

// ================= FACULTIES (LOCAL) =================
addFacultyBtn.onclick = () => {
  const name = facultyInput.value.trim();
  if (!name) return alert("Faculty name required");

  store.faculties.push({ id: Date.now(), name });
  facultyInput.value = "";
  save();
};

function renderFaculties() {
  facultyList.innerHTML = "";
  programFacultySelect.innerHTML = `<option value="">Select Faculty</option>`;

  store.faculties.forEach(f => {
    facultyList.innerHTML += `
      <li data-id="${f.id}">
        ${f.name}
        <button class="delete-btn" data-type="faculty">Delete</button>
      </li>
    `;
    programFacultySelect.innerHTML += `
      <option value="${f.id}">${f.name}</option>
    `;
  });
}

// ================= PROGRAMS (BACKEND ONLY) =================


addProgramBtn?.addEventListener("click", async () => {
  const name = programInput.value.trim();
  const facultyId = programFacultySelect.value;

  if (!name || !facultyId) {
    alert("Program name and faculty required");
    return;
  }

  const token = localStorage.getItem("token");

  await fetch("http://localhost:5000/api/admin/programs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ name, facultyId })
  });

  programInput.value = "";
programFacultySelect.value = ""; // ✅ RESET FACULTY SELECT
renderPrograms();

});


document.addEventListener("click", async e => {
  if (!e.target.classList.contains("delete-program-btn")) return;

  const id = e.target.dataset.id;
  const token = localStorage.getItem("token");

  await fetch(`http://localhost:5000/api/admin/programs/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  renderPrograms();
});

async function renderPrograms() {
  const selectedProgram = courseProgramSelect.value;

const token = localStorage.getItem("token");

const res = await fetch("http://localhost:5000/api/admin/programs", {
  headers: {
    "Authorization": `Bearer ${token}`
  }
});
  const { programs } = await res.json(); // ✅ FIX

  programList.innerHTML = "";
  courseProgramSelect.innerHTML = `<option value="">Select Program</option>`;

  programs.forEach(p => {
    programList.innerHTML += `
      <li>
        ${p.name} (${p.faculty?.name || "—"})
        <button class="delete-program-btn" data-id="${p._id}">Delete</button>
      </li>
    `;

    const option = document.createElement("option");
    option.value = p._id;
    option.textContent = p.name;

    if (p._id === selectedProgram) {
      option.selected = true;
    }

    courseProgramSelect.appendChild(option);
  });
}


async function renderPrograms() {
  const token = localStorage.getItem("token");

  if (!token) {
    console.warn("No token found. Cannot load programs.");
    return;
  }

  const res = await fetch("http://localhost:5000/api/admin/programs", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    console.error("Programs request failed:", await res.json());
    return;
  }

  const { programs } = await res.json();

  programList.innerHTML = "";
  courseProgramSelect.innerHTML = `<option value="">Select Program</option>`;

  programs.forEach(p => {
    // unchanged
  });
}



// ================= COURSES (LOCAL) =================
addCourseBtn.onclick = () => {
  const programId = courseProgramSelect.value;
  const level = courseLevelSelect.value;
  const semester = courseSemesterSelect.value;
  const type = courseTypeSelect.value;
  const code = courseCodeInput.value.trim().toUpperCase();
  const title = courseTitleInput.value.trim();

  if (!programId || !level || !semester || !type || !code || !title)
    return alert("All course fields required");

  store.courses.push({
    id: Date.now(),
    programId,
    level,
    semester,
    type,
    code,
    title
  });

  courseCodeInput.value = "";
  courseTitleInput.value = "";
  save();
};

function renderCourses() {
  courseList.innerHTML = "";
  store.courses.forEach(c => {
    courseList.innerHTML += `
      <li data-id="${c.id}">
        <strong>${c.code} (${c.type})</strong> — ${c.title}
        <span>(${c.level} · ${c.semester})</span>
        <button class="delete-btn" data-type="course">Delete</button>
      </li>
    `;
  });
}

document
  .getElementById("addStudyCenterBtn")
  ?.addEventListener("click", async () => {

    const state = stateInput.value.trim();
    const name = studyCenterInput.value.trim();

    if (!state || !name) {
      alert("State and study center required");
      return;
    }

    await fetch("http://localhost:5000/api/study-centers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state, name })
    });

    stateInput.value = "";
    studyCenterInput.value = "";

    renderStudyCenters();
  });


// ================= DELETE (LOCAL ONLY) =================
document.addEventListener("click", async e => {

  /* ---------- DELETE FACULTY / COURSE (LOCAL) ---------- */
  if (e.target.classList.contains("delete-btn")) {
    if (!confirm("Delete this item?")) return;

    const li = e.target.closest("li[data-id]");
    if (!li) return;

    const id = Number(li.dataset.id);
    const type = e.target.dataset.type;

    if (type === "faculty") {
      store.faculties = store.faculties.filter(f => f.id !== id);
      store.courses = store.courses.filter(c => c.programId !== id);
    }

    if (type === "course") {
      store.courses = store.courses.filter(c => c.id !== id);
    }

    save();
    return;
  }

  /* ---------- DELETE STUDY CENTER (BACKEND) ---------- */
  if (e.target.classList.contains("delete-center-btn")) {
    if (!confirm("Delete this study center?")) return;

    const id = e.target.dataset.id;

    await fetch(`http://localhost:5000/api/study-centers/${id}`, {
      method: "DELETE"
    });

    renderStudyCenters();
    return;
  }

});

  renderStudyCenters();

// ================= STATS =================
function updateStats() {
  statFaculties.textContent = store.faculties.length;
  statPrograms.textContent = "—";
  statCourses.textContent = store.courses.length;
}

async function renderStudyCenters() {
  const list = document.getElementById("studyCenterList");
  if (!list) return;

  const res = await fetch("http://localhost:5000/api/study-centers");
  const centers = await res.json();

  list.innerHTML = "";

  centers.forEach(c => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${c.name} (${c.state})
      <button class="delete-center-btn" data-id="${c._id}">Delete</button>
    `;
    list.appendChild(li);
  });
}
renderStudyCenters();

// ================= INIT =================
renderFaculties();
renderPrograms();
renderCourses();
updateStats();
renderStudyCenters();
