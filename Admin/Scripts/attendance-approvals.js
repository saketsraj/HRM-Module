document.querySelector(".user-avatar").addEventListener("click", () => {
  document.getElementById("dropdownMenu").classList.toggle("show");
});

window.addEventListener("click", (e) => {
  if (!e.target.matches(".user-avatar")) {
    const dropdown = document.getElementById("dropdownMenu");
    if (dropdown.classList.contains("show")) dropdown.classList.remove("show");
  }
});

function handleLeave(button, status) {
  const card = button.parentElement;

  const employeeText = card.querySelector("p").innerText;
  const employeeName = employeeText.replace("Employee:", "").trim();

  const requestDate = "20 Aug 2025";

  if (status === "Approved") {
    card.innerHTML = `
      <p style="color: green; font-weight: 600;">
        ✅ Leave Approved for <strong>${employeeName}</strong> on ${requestDate}.
      </p>
    `;
  } else {
    card.innerHTML = `
      <p style="color: red; font-weight: 600;">
        ❌ Leave Rejected for <strong>${employeeName}</strong> on ${requestDate}.
      </p>
    `;
  }
}

window.handleLeave = handleLeave;
