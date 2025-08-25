  document.addEventListener("DOMContentLoaded", () => {
    const userMenu = document.querySelector(".user-menu");
    const dropdown = document.getElementById("dropdownMenu");

    userMenu.addEventListener("click", (e) => {
      e.stopPropagation(); 
      dropdown.classList.toggle("show");
    });

    document.addEventListener("click", () => {
      dropdown.classList.remove("show");
    });
  });