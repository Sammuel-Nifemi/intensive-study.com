
const token = localStorage.getItem("token");
const examId = localStorage.getItem("activeExamId");

if (!token || !examId) {
  window.location.href = "mock-exams.html";
}

let timeLeft;
let timerInterval;

(async () => {
  const res = await fetch(
    `http://localhost:5000/api/exams/${examId}`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  const exam = await res.json();

  document.getElementById("examTitle").textContent = exam.title;
  timeLeft = exam.duration * 60;

  startTimer();
  renderQuestions(exam.questions);
})();

function startTimer() {
  const timerEl = document.getElementById("timer");

  timerInterval = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      document.getElementById("examForm").submit();
    }

    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;

    timerEl.textContent = `${mins}:${secs.toString().padStart(2, "0")}`;
    timeLeft--;
  }, 1000);
}

function renderQuestions(questions) {
  const container = document.getElementById("questions");

  questions.forEach((q, index) => {
    const div = document.createElement("div");

    div.innerHTML = `
      <p>${index + 1}. ${q.text}</p>
      ${Object.entries(q.options).map(([key, val]) => `
        <label>
          <input type="radio" name="q${index}" value="${key}">
          ${val}
        </label>
      `).join("")}
    `;

    container.appendChild(div);
  });
}

document.getElementById("examForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  clearInterval(timerInterval);

  const answers = [];
  const inputs = document.querySelectorAll("[name^='q']");
  inputs.forEach(input => {
    if (input.checked) {
      const idx = Number(input.name.replace("q", ""));
      answers[idx] = input.value;
    }
  });

  const res = await fetch("http://localhost:5000/api/attempts/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      examId,
      answers
    })
  });

  const data = await res.json();
  if (!res.ok) {
    alert(data.message || "Submission failed");
    return;
  }

  localStorage.setItem("lastAttempt", JSON.stringify(data));
  window.location.href = "exam-review.html";
});
const res = await fetch(
  `http://localhost:5000/api/exams/${examId}`,
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);

if (res.status === 402) {
  alert("You’ve used your free attempts. Please upgrade to continue.");
  window.location.href = "student-dashboard.html";
  return;
}
