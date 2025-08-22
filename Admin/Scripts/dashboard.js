function navigateTo(page) {
  window.location.href = page;
}

document.addEventListener("DOMContentLoaded", () => {
  const userAvatar = document.getElementById("userAvatar");
  const dropdown = document.getElementById("dropdownMenu");

  userAvatar.addEventListener("click", (event) => {
    event.stopPropagation();
    dropdown.style.display =
      dropdown.style.display === "block" ? "none" : "block";
  });

  document.addEventListener("click", () => {
    if (dropdown.style.display === "block") {
      dropdown.style.display = "none";
    }
  });
});
