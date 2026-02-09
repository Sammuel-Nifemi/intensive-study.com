/* =====================================================
   ROLE GUARD
===================================================== */

const role = localStorage.getItem("role");
const token = localStorage.getItem("token");

if (!token || (role !== "staff" && role !== "admin")) {
  window.location.href = "staff-login.html";
}
;
 