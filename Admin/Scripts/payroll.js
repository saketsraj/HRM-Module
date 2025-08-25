document.querySelector(".user-avatar").addEventListener("click", () => {
  document.getElementById("dropdownMenu").classList.toggle("show");
});
window.addEventListener("click", (e) => {
  if (!e.target.matches(".user-avatar")) {
    let dropdown = document.getElementById("dropdownMenu");
    if (dropdown.classList.contains("show")) dropdown.classList.remove("show");
  }
});

const runBtn = document.getElementById("runPayrollBtn");
runBtn.addEventListener("click", () => {
  document.getElementById("payrollCard").style.display = "none";
  document.getElementById("processingMessage").style.display = "flex";
});
