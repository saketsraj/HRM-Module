function navigateTo(page) {
  window.location.href = page;
}

// Dropdown toggle
document.addEventListener("DOMContentLoaded", () => {
  const userAvatar = document.getElementById("userAvatar");
  const dropdown = document.getElementById("dropdownMenu");

  userAvatar.addEventListener("click", () => {
    dropdown.style.display =
      dropdown.style.display === "block" ? "none" : "block";
  });

  // Close dropdown if clicked outside
  document.addEventListener("click", (event) => {
    if (
      !userAvatar.contains(event.target) &&
      !dropdown.contains(event.target)
    ) {
      dropdown.style.display = "none";
    }
  });
});