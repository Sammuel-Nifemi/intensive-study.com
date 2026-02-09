const adminToken = localStorage.getItem("adminToken");

async function loadStats() {
  try {
    const res = await fetch("http://localhost:5000/api/admin/stats", {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const data = await res.json();
    if (!res.ok) return;

    document.getElementById("statStudents").textContent = data.students ?? 0;
    document.getElementById("statStaff").textContent = data.staff ?? 0;
    document.getElementById("statMocks").textContent = data.mocks ?? 0;
  } catch (err) {
    console.error(err);
  }
}

async function loadStudyCenters() {
  try {
    const res = await fetch("http://localhost:5000/api/admin/study-centers/analytics", {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const data = await res.json();
    if (!res.ok) return;

    const container = document.getElementById("studyCenterCards");
    if (!container) return;
    container.innerHTML = data.map(c => `
      <div class="dashboard-card">
        <h3>${c.name}</h3>
        <strong>${c.count}</strong>
      </div>
    `).join("");
  } catch (err) {
    console.error(err);
  }
}

function applyAdminTheme() {
  const theme = localStorage.getItem("adminTheme") || "light";
  document.body.setAttribute("data-admin-theme", theme);
}

document.addEventListener("DOMContentLoaded", () => {
  applyAdminTheme();
  loadStats();
  loadStudyCenters();
});
