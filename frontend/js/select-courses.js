const MAX_COURSES = 11;
const API_BASE = "http://localhost:5000";

let studentProfile = null;
let searchTimer = null;
let curriculumCodes = new Set();

document.addEventListener("DOMContentLoaded", async () => {
  applyTheme();

  const token = localStorage.getItem("studentToken");
  if (!token) {
    window.location.href = "/frontend/pages/student-login.html";
    return;
  }

  studentProfile = window.loadStudent ? await window.loadStudent() : null;
  if (!studentProfile) {
    window.location.href = "/frontend/pages/student-login.html";
    return;
  }

  renderProfile(studentProfile);

  document.getElementById("saveCoursesBtn")?.addEventListener("click", () => saveCourses(token));
  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("studentToken");
    window.location.href = "/frontend/pages/student-login.html";
  });

  document.getElementById("globalCourseSearch")?.addEventListener("input", (event) => {
    const query = String(event.target.value || "").trim();
    if (searchTimer) clearTimeout(searchTimer);
    searchTimer = setTimeout(() => searchManualCourses(query, token), 300);
  });

  await loadCourses(token);
});

function applyTheme() {
  const theme = localStorage.getItem("theme") || "classic";
  document.body.setAttribute("data-theme", theme);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? "—";
}

function renderProfile(profile) {
  setText("studentNameValue", profile?.fullName || profile?.name || "—");
  setText("studentTitleValue", profile?.title || "—");
  setText("facultyValue", profile?.faculty || "—");
  setText("programValue", profile?.program || "—");
  setText("levelValue", profile?.level || "—");
  setText("semesterValue", profile?.semester || "—");
}

function getAllCourseCheckboxes() {
  return Array.from(document.querySelectorAll(".course-checkbox-item input[type='checkbox']"));
}

function updateSelectedCount(count) {
  const countEl = document.getElementById("selectedCount");
  if (!countEl) return;
  if (!count) {
    countEl.textContent = "";
    return;
  }
  countEl.textContent = `Total courses selected: ${count}`;
}

function updateSelectionSummary(checkedInputs) {
  const summaryCard = document.getElementById("courseSelectionSummary");
  const selectedCoursesList = document.getElementById("selectedCoursesList");
  if (!summaryCard) return;

  const total = checkedInputs.length;
  if (!total) {
    if (selectedCoursesList) selectedCoursesList.innerHTML = "";
    summaryCard.hidden = true;
    return;
  }

  const selectedCourses = checkedInputs.map((input) => {
    const category = (input.dataset.category || "elective").toLowerCase();
    return {
      code: String(input.value || "").trim().toUpperCase(),
      title: String(input.dataset.title || "Untitled Course").trim(),
      category: category === "compulsory" ? "compulsory" : "elective"
    };
  });

  const compulsory = selectedCourses.filter((course) => course.category === "compulsory").length;
  const elective = selectedCourses.filter((course) => course.category === "elective").length;

  const totalEl = document.getElementById("totalSelectedValue");
  const compulsoryEl = document.getElementById("compulsorySelectedValue");
  const electiveEl = document.getElementById("electiveSelectedValue");

  if (totalEl) totalEl.textContent = total;
  if (compulsoryEl) compulsoryEl.textContent = compulsory;
  if (electiveEl) electiveEl.textContent = elective;
  if (selectedCoursesList) {
    selectedCoursesList.innerHTML = selectedCourses
      .map(
        (course) =>
          `<li><strong>${course.code}</strong> - ${course.title} (${course.category === "compulsory" ? "Compulsory" : "Elective"})</li>`
      )
      .join("");
  }

  summaryCard.hidden = false;
}

function toggleDisabledCheckboxes(checkedCount) {
  const inputs = getAllCourseCheckboxes();
  inputs.forEach((input) => {
    input.disabled = !input.checked && checkedCount >= MAX_COURSES;
  });
}

function syncSelectionState() {
  const inputs = getAllCourseCheckboxes();
  const checkedInputs = inputs.filter((input) => input.checked);
  updateSelectedCount(checkedInputs.length);
  updateSelectionSummary(checkedInputs);
  toggleDisabledCheckboxes(checkedInputs.length);
}

function bindSelectionHandlers(root) {
  if (!root) return;
  root.querySelectorAll("input[type='checkbox']").forEach((input) => {
    input.addEventListener("change", () => {
      const all = getAllCourseCheckboxes();
      const checkedCount = all.filter((item) => item.checked).length;
      if (checkedCount > MAX_COURSES) {
        input.checked = false;
        alert("Maximum 11 courses allowed per semester.");
        return;
      }
      syncSelectionState();
    });
  });
}

function renderCourseItems(items) {
  return items
    .map((course) => {
      const code = String(course.courseCode || course.code || "").trim().toUpperCase();
      if (!code) return "";

      const title = course.title || "Untitled Course";
      const label = `${code} - ${title}`.trim();
      const category = (course.category || "elective").toLowerCase();
      const normalizedCategory = category === "compulsory" ? "compulsory" : "elective";
      const categoryLabel = normalizedCategory === "compulsory" ? "Compulsory" : "Elective";
      const categoryClass = normalizedCategory === "compulsory" ? "badge-compulsory" : "badge-elective";

      return `
        <label class="course-checkbox-item">
          <input type="checkbox" value="${code}" data-category="${normalizedCategory}" data-title="${title}" />
          <span class="course-content">
            <span class="course-main">${label}</span>
            <span class="course-meta-row">
              <span class="course-badge ${categoryClass}">${categoryLabel}</span>
            </span>
          </span>
        </label>
      `;
    })
    .join("");
}

async function loadCourses(token) {
  const statusEl = document.getElementById("courseStatus");
  const semester = studentProfile?.semester || "";

  if (!semester) {
    if (statusEl) statusEl.textContent = "Complete your profile to load courses.";
    renderCourses([]);
    syncSelectionState();
    return;
  }

  if (statusEl) statusEl.textContent = "Loading courses...";

  try {
    const res = await fetch(`${API_BASE}/courses/available`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json().catch(() => []);

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        window.location.href = "/frontend/pages/student-login.html";
        return;
      }
      if (statusEl) statusEl.textContent = data?.message || "Unable to load courses.";
      renderCourses([]);
      syncSelectionState();
      return;
    }

    const courses = Array.isArray(data) ? data : [];
    renderCourses(courses);
    if (statusEl) {
      statusEl.textContent = courses.length
        ? "Showing all courses for the selected semester."
        : "No courses available for the selected semester.";
    }
  } catch (err) {
    console.error(err);
    if (statusEl) statusEl.textContent = "Unable to load courses.";
    renderCourses([]);
    syncSelectionState();
  }
}

function renderCourses(courses) {
  const list = document.getElementById("coursesList");
  if (!list) return;

  curriculumCodes = new Set(
    (Array.isArray(courses) ? courses : [])
      .map((course) => String(course.courseCode || "").trim().toUpperCase())
      .filter(Boolean)
  );

  if (!courses.length) {
    list.innerHTML = "<p class=\"status-text\">No courses available.</p>";
    syncSelectionState();
    return;
  }

  list.innerHTML = renderCourseItems(courses);
  bindSelectionHandlers(list);
  syncSelectionState();
}

async function searchManualCourses(query, token) {
  const statusEl = document.getElementById("searchStatus");
  const list = document.getElementById("manualCoursesList");
  if (!statusEl || !list) return;

  if (query.length < 2) {
    statusEl.textContent = "";
    list.innerHTML = "<p class=\"status-text\">Search to find additional courses.</p>";
    syncSelectionState();
    return;
  }

  statusEl.textContent = "Searching courses...";

  try {
    const res = await fetch(`${API_BASE}/courses/search?q=${encodeURIComponent(query)}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json().catch(() => []);

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        window.location.href = "/frontend/pages/student-login.html";
        return;
      }
      statusEl.textContent = data?.message || "Failed to search courses.";
      list.innerHTML = "<p class=\"status-text\">No matching courses.</p>";
      syncSelectionState();
      return;
    }

    const allItems = Array.isArray(data) ? data : [];
    const items = allItems.filter(
      (item) => !curriculumCodes.has(String(item.courseCode || "").trim().toUpperCase())
    );

    if (!items.length) {
      statusEl.textContent = "No additional courses found.";
      list.innerHTML = "<p class=\"status-text\">No matching additional courses.</p>";
      syncSelectionState();
      return;
    }

    statusEl.textContent = `Found ${items.length} additional course(s).`;
    list.innerHTML = renderCourseItems(items);
    bindSelectionHandlers(list);
    syncSelectionState();
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Failed to search courses.";
    list.innerHTML = "<p class=\"status-text\">No matching courses.</p>";
    syncSelectionState();
  }
}

async function saveCourses(token) {
  const statusEl = document.getElementById("saveStatus");
  const selected = Array.from(
    new Set(
      getAllCourseCheckboxes()
        .filter((input) => input.checked)
        .map((input) => String(input.value || "").trim().toUpperCase())
        .filter(Boolean)
    )
  );

  if (!selected.length) {
    alert("Please select at least one course.");
    return;
  }

  if (selected.length > MAX_COURSES) {
    alert("Maximum 11 courses allowed per semester.");
    return;
  }

  if (statusEl) statusEl.textContent = "Saving courses...";

  try {
    const res = await fetch(`${API_BASE}/api/student/courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        courseCodes: selected,
        semester: studentProfile?.semester
      })
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (statusEl) statusEl.textContent = data?.message || "Failed to save courses.";
      return;
    }

    if (statusEl) statusEl.textContent = "Courses saved.";
    window.location.href = "/frontend/pages/student-dashboard.html";
  } catch (err) {
    console.error(err);
    if (statusEl) statusEl.textContent = "Failed to save courses.";
  }
}
