
/* ================= AUTH CHECK ================= */
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "academic-resources.html";
}

/* ================= LOAD EXAMS ================= */
(async () => {
  try {
    const res = await fetch("http://localhost:5000/api/exams", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const exams = await res.json();
    const table = document.getElementById("examTable");

    table.innerHTML = "";

    exams.forEach(exam => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${exam.title}</td>
        <td>${exam.duration} mins</td>
        <td>
          <button onclick="startExam('${exam._id}')">
            Start Exam
          </button>
        </td>
      `;

      table.appendChild(row);
    });

  } catch (err) {
    console.error("Failed to load exams");
  }
})();

/* ================= START EXAM ================= */
function startExam(id) {
  localStorage.setItem("activeExamId", id);
  window.location.href = "take-exam.html";
}

/* ================= UPGRADE MODAL ================= */
const upgradeModal = document.getElementById("upgradeModal");
const upgradeBtn = document.querySelector(".upgrade-btn");
const closeModalBtn = document.getElementById("closeModalBtn");
const payNowBtn = document.getElementById("payNowBtn");

// Open modal from access card
upgradeBtn?.addEventListener("click", () => {
  upgradeModal.classList.remove("hidden");
});

// Close modal
closeModalBtn?.addEventListener("click", () => {
  upgradeModal.classList.add("hidden");
});

// Placeholder for payment (Paystack comes next)
payNowBtn?.addEventListener("click", () => {
  const handler = PaystackPop.setup({
    key: "pk_test_xxxxxxxxxxxxx", // 🔴 YOUR TEST PUBLIC KEY
    email: "student@test.com",    // later: real email
    amount: 200000,               // ₦2,000 in kobo
    currency: "NGN",
    callback: async function () {
      // unlock access
      const res = await fetch(
        "http://localhost:5000/api/payments/unlock",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.ok) {
        alert("Payment successful! Full access unlocked.");
        upgradeModal.classList.add("hidden");
        location.reload();
      } else {
        alert("Payment succeeded, but access unlock failed.");
      }
    },
    onClose: function () {
      alert("Payment window closed.");
    }
  });

  handler.openIframe();
});

// course-materials.js

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const courseCode = params.get("course");

  if (!course) {
  alert("No course selected");
  window.location.href = "/frontend/pages/student-dashboard.html";
  return;
}


  const titleEl = document.getElementById("courseTitle");
  if (titleEl) {
    titleEl.textContent = `Mock Exam — ${courseCode}`;
  }

  // fetch(`/api/mock-exams/${courseCode}`)
});
