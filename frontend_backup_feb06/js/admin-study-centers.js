const token = localStorage.getItem("token");

document.getElementById("centerForm").addEventListener("submit", async e => {
  e.preventDefault();

  await fetch("http://localhost:5000/api/admin/study-centers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      name: centerName.value,
      code: centerCode.value
    })
  });

  centerName.value = "";
  centerCode.value = "";
});
