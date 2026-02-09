const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/frontend/pages/student-login.html";
}

let timerInterval = null;
let remainingSeconds = 90 * 60;
let examQuestions = [];
let hasLoadedExam = false;

function getCourseCode() {
  const params = new URLSearchParams(window.location.search);
  const course = params.get("course");
  return course ? course.toUpperCase() : "";
}

function getAttemptsKey(course) {
  return `mockAttempts:${course}`;
}

function getPaidKey(course) {
  return `mockPaid:${course}`;
}

function getAttempts(course) {
  const raw = localStorage.getItem(getAttemptsKey(course));
  const val = raw ? parseInt(raw, 10) : 0;
  return Number.isNaN(val) ? 0 : val;
}

function setAttempts(course, attempts) {
  localStorage.setItem(getAttemptsKey(course), String(attempts));
}

function isPaid(course) {
  return localStorage.getItem(getPaidKey(course)) === "true";
}

function setPaid(course, value) {
  localStorage.setItem(getPaidKey(course), value ? "true" : "false");
}

function updateStartState(course) {
  const attempts = getAttempts(course);
  const paid = isPaid(course);
  const startBtn = document.getElementById("startExamBtn");
  const attemptInfo = document.getElementById("attemptInfo");

  if (!startBtn || !attemptInfo) return;

  if (attempts >= 2 && !paid) {
    startBtn.disabled = true;
    attemptInfo.textContent = "Free attempts exhausted. Upgrade to continue.";
  } else {
    startBtn.disabled = false;
    attemptInfo.textContent = "You have 2 free attempts.";
  }
}

function startTimer() {
  const timerEl = document.getElementById("examTimer");
  const tick = () => {
    const mins = String(Math.floor(remainingSeconds / 60)).padStart(2, "0");
    const secs = String(remainingSeconds % 60).padStart(2, "0");
    if (timerEl) timerEl.textContent = `Time left: ${mins}:${secs}`;

    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
      submitExam();
      return;
    }

    remainingSeconds -= 1;
  };

  tick();
  timerInterval = setInterval(tick, 1000);
}

function renderQuestions(questions) {
  const form = document.getElementById("examForm");
  if (!form) return;

  form.innerHTML = "";

  questions.forEach((q, idx) => {
    const wrapper = document.createElement("div");
    wrapper.className = "activity-list";
    wrapper.style.marginBottom = "18px";

    const title = document.createElement("div");
    title.innerHTML = `<strong>Q${idx + 1}.</strong> ${q.question}`;
    wrapper.appendChild(title);

    if (q.type === "mcq") {
      q.options.forEach(opt => {
        const label = document.createElement("label");
        label.style.display = "block";
        label.style.marginTop = "6px";

        const input = document.createElement("input");
        input.type = "radio";
        input.name = `q_${idx}`;
        input.value = opt.label;

        label.appendChild(input);
        label.appendChild(document.createTextNode(` ${opt.label}. ${opt.text}`));
        wrapper.appendChild(label);
      });
    } else {
      const input = document.createElement("input");
      input.type = "text";
      input.name = `q_${idx}`;
      input.placeholder = "Type your answer";
      input.style.marginTop = "8px";
      input.style.width = "100%";
      input.style.padding = "10px";
      wrapper.appendChild(input);
    }

    form.appendChild(wrapper);
  });
}

function collectAnswers() {
  return examQuestions.map((q, idx) => {
    let answer = "";
    if (q.type === "mcq") {
      const selected = document.querySelector(`input[name=\"q_${idx}\"]:checked`);
      answer = selected ? selected.value : "";
    } else {
      const input = document.querySelector(`input[name=\"q_${idx}\"]`);
      answer = input ? input.value : "";
    }

    return { id: q.id, answer };
  });
}

async function loadExam(course) {
  if (hasLoadedExam) return;
  hasLoadedExam = true;

  try {
    const res = await fetch(`http://localhost:5000/api/mock-exams/${course}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();

    if (!res.ok) {
      const status = document.getElementById("examStatus");
      if (status) status.textContent = data.message || "Failed to load exam";
      return;
    }

    examQuestions = data.questions;
    const status = document.getElementById("examStatus");
    if (status) status.textContent = "";

    renderQuestions(examQuestions);
    startTimer();
  } catch (err) {
    console.error(err);
    const status = document.getElementById("examStatus");
    if (status) status.textContent = "Failed to load exam";
  }
}

async function submitExam() {
  if (!examQuestions.length) return;

  const answers = collectAnswers();
  const course = getCourseCode();

  try {
    const res = await fetch("http://localhost:5000/api/mock-exams/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ courseCode: course, answers })
    });

    const data = await res.json();

    if (!res.ok) {
      if (res.status === 403) {
        setAttempts(course, 2);
        updateStartState(course);
      }
      alert(data.message || "Submission failed");
      return;
    }

    clearInterval(timerInterval);

    setAttempts(course, data.attempts || getAttempts(course) + 1);
    updateStartState(course);

    const resultSection = document.getElementById("resultSection");
    const resultSummary = document.getElementById("resultSummary");
    const explanations = document.getElementById("explanations");
    const aiSummary = document.getElementById("aiSummary");

    if (resultSection) resultSection.hidden = false;
    if (resultSummary) {
      resultSummary.innerHTML = `<p>Score: ${data.score} / ${data.total}</p>`;
    }

    if (explanations) {
      explanations.innerHTML = data.explanations.map((exp, idx) => {
        const answer = answers[idx] ? answers[idx].answer : "";
        const userAnswer = answer ? answer : "(No answer)";
        const correctText = exp.correctText || exp.correctAnswer;
        const status = exp.isCorrect ? "Correct" : "Wrong";
        return `
          <div class="activity-list" style="margin-bottom:14px;">
            <strong>Q${exp.number}.</strong> ${exp.question}<br>
            <span>Your Answer: ${userAnswer}</span><br>
            <span>Correct Answer: ${correctText}</span><br>
            <span>Status: ${status}</span><br>
            <span>Explanation: ${exp.explanation}</span>
          </div>
        `;
      }).join("");
    }

    if (aiSummary) {
      if (isPaid(course)) {
        aiSummary.hidden = false;
        aiSummary.textContent = "AI performance summary is available for paid users. Your detailed breakdown will appear here.";
      } else {
        aiSummary.hidden = true;
      }
    }
  } catch (err) {
    console.error(err);
    alert("Submission failed");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const course = getCourseCode();
  const titleEl = document.getElementById("examTitle");
  if (titleEl) titleEl.textContent = course ? `Mock Exam — ${course}` : "Mock Exam";

  const startSection = document.getElementById("startSection");
  const examSection = document.getElementById("examSection");
  const startBtn = document.getElementById("startExamBtn");
  const upgradeBtn = document.getElementById("upgradeBtn");
  const submitBtn = document.getElementById("submitExamBtn");

  if (!course) {
    const attemptInfo = document.getElementById("attemptInfo");
    if (attemptInfo) attemptInfo.textContent = "No course selected.";
    if (startBtn) startBtn.disabled = true;
    return;
  }

  updateStartState(course);

  startBtn?.addEventListener("click", () => {
    if (startBtn.disabled) return;
    if (startSection) startSection.hidden = true;
    if (examSection) examSection.hidden = false;
    loadExam(course);
  });

  upgradeBtn?.addEventListener("click", () => {
    setPaid(course, true);
    updateStartState(course);
    alert("Upgrade applied. You can continue your mock exams.");
  });

  submitBtn?.addEventListener("click", submitExam);
});
