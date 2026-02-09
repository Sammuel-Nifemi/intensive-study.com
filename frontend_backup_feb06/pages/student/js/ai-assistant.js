
document
  .getElementById("reviewExamBtn")
  .addEventListener("click", async () => {

    const results =
      JSON.parse(localStorage.getItem("examResults")) || [];

    if (results.length === 0) {
      alert("No exam results found yet.");
      return;
    }

    const lastResult = results[results.length - 1];

    const exams =
      JSON.parse(localStorage.getItem("mockExams")) || [];

    const exam = exams.find(e => e.id === lastResult.examId);

    if (!exam) {
      alert("Exam data not found.");
      return;
    }

    const output = document.getElementById("aiReviewOutput");
    output.innerHTML = "<h4>AI Feedback (Preview)</h4>";

    for (let index = 0; index < exam.questions.length; index++) {
      const q = exam.questions[index];
      const studentAnswer = lastResult.answers[index];
      const correct = q.correct;

      if (studentAnswer !== correct) {
        // show loading state first
        output.innerHTML += `
          <p id="q-${index}">
            ❌ <strong>Q${index + 1}:</strong> ${q.text}<br>
            Your answer: ${studentAnswer || "None"}<br>
            Correct answer: ${correct}<br>
            🤖 <em>Loading AI explanation...</em>
          </p>
        `;

        const explanation = await getAIExplanation(q.text, correct);

        document.getElementById(`q-${index}`).innerHTML = `
          ❌ <strong>Q${index + 1}:</strong> ${q.text}<br>
          Your answer: ${studentAnswer || "None"}<br>
          Correct answer: ${correct}<br>
          🤖 <em>${explanation}</em>
        `;
      }
    }
  });

/* ===============================
   AI EXPLANATION (MOCK)
================================ */
async function getAIExplanation(question, correctAnswer) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(
        `The correct answer is ${correctAnswer} because it best explains the concept being tested. Review this topic carefully.`
      );
    }, 800);
  });
}
