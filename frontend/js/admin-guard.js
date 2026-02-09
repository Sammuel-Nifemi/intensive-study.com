const adminToken = localStorage.getItem("adminToken");

if (!adminToken) {
  window.location.href = "/frontend/pages/admin-login.html";
}
