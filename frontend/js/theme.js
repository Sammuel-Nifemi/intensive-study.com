function applyTheme() {
  const theme = localStorage.getItem("theme") || "classic";
  document.body.setAttribute("data-theme", theme);
}

document.addEventListener("DOMContentLoaded", applyTheme);
