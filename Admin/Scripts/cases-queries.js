// Dropdown toggle
document.querySelector(".user-avatar").addEventListener("click", () => {
  document.getElementById("dropdownMenu").classList.toggle("show");
});

window.addEventListener("click", (e) => {
  if (!e.target.matches(".user-avatar")) {
    let dropdown = document.getElementById("dropdownMenu");
    if (dropdown.classList.contains("show")) dropdown.classList.remove("show");
  }
});

// Modal handling
const caseModal = document.getElementById("caseModal");
const registerBtn = document.getElementById("registerCaseBtn");
const closeModal = document.getElementById("closeCaseModal");

registerBtn.onclick = () => (caseModal.style.display = "flex");
closeModal.onclick = () => (caseModal.style.display = "none");
window.onclick = (e) => {
  if (e.target === caseModal) caseModal.style.display = "none";
};

// Toggle Pending Cases Section
const pendingSection = document.getElementById("pendingSection");
const pendingBtn = document.getElementById("pendingCasesBtn");

pendingBtn.addEventListener("click", () => {
  if (pendingSection.style.display === "none") {
    pendingSection.style.display = "block";
    pendingSection.scrollIntoView({ behavior: "smooth" });
    pendingBtn.textContent = "Hide";
  } else {
    pendingSection.style.display = "none";
    pendingBtn.textContent = "View";
  }
});

// Case Submission
document.getElementById("caseForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("caseTitle").value;
  const emp = document.getElementById("employeeName").value;
  const dept = document.getElementById("employeeDept").value;
  const desc = document.getElementById("caseDescription").value;

  const newCase = document.createElement("div");
  newCase.classList.add("pending-card");
  newCase.innerHTML = `
    <h3>${title}</h3>
    <p><strong>Employee:</strong> ${emp}</p>
    <p><strong>Department:</strong> ${dept}</p>
    <p><strong>Description:</strong> ${desc}</p>
    <p><strong>Status:</strong> Submitted</p>
  `;
  document.getElementById("pendingList").appendChild(newCase);

  // Reset + Close modal
  e.target.reset();
  caseModal.style.display = "none";

  // Ensure Pending is visible
  pendingSection.style.display = "block";
  pendingBtn.textContent = "Hide";
  newCase.scrollIntoView({ behavior: "smooth" });
});

// Fake search
document.getElementById("searchBtn").addEventListener("click", () => {
  let query = document.getElementById("searchBar").value;
  alert("Searching cases for: " + query);
});
