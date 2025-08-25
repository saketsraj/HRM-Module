const employeeTable = document.querySelector("#employeeTable tbody");
const addEmployeeBtn = document.getElementById("addEmployeeBtn");
const modal = document.getElementById("employeeModal");
const closeModal = document.getElementById("closeModal");
const employeeForm = document.getElementById("employeeForm");
const dropdownMenu = document.getElementById("dropdownMenu");
const userAvatar = document.querySelector(".user-avatar");

let employees = [
  {
    name: "John Doe",
    department: "HR",
    jobTitle: "Manager",
    phone: "9876543210",
    email: "john@example.com",
    location: "New York",
  },
  {
    name: "Jane Smith",
    department: "IT",
    jobTitle: "Developer",
    phone: "8765432109",
    email: "jane@example.com",
    location: "San Francisco",
  },
  {
    name: "Alex Johnson",
    department: "Finance",
    jobTitle: "Analyst",
    phone: "7654321098",
    email: "alex@example.com",
    location: "Chicago",
  },
  {
    name: "Emily Davis",
    department: "Marketing",
    jobTitle: "Executive",
    phone: "6543210987",
    email: "emily@example.com",
    location: "Boston",
  },
  {
    name: "Michael Brown",
    department: "Sales",
    jobTitle: "Consultant",
    phone: "5432109876",
    email: "michael@example.com",
    location: "Seattle",
  },
  {
    name: "Sophia Wilson",
    department: "Admin",
    jobTitle: "Coordinator",
    phone: "4321098765",
    email: "sophia@example.com",
    location: "Austin",
  },
  {
    name: "Daniel Lee",
    department: "Support",
    jobTitle: "Specialist",
    phone: "3210987654",
    email: "daniel@example.com",
    location: "Denver",
  },
  {
    name: "Olivia Taylor",
    department: "HR",
    jobTitle: "Recruiter",
    phone: "2109876543",
    email: "olivia@example.com",
    location: "Miami",
  },
  {
    name: "William Thomas",
    department: "IT",
    jobTitle: "System Admin",
    phone: "1098765432",
    email: "william@example.com",
    location: "Dallas",
  },
  {
    name: "Emma Martinez",
    department: "Finance",
    jobTitle: "Accountant",
    phone: "9988776655",
    email: "emma@example.com",
    location: "Los Angeles",
  },
];

function renderTable() {
  employeeTable.innerHTML = "";
  employees.forEach((emp, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${emp.name}</td>
      <td>${emp.department}</td>
      <td>${emp.jobTitle}</td>
      <td>${emp.phone}</td>
      <td>${emp.email}</td>
      <td>${emp.location}</td>
      <td><button class="action-btn" onclick="removeEmployee(${index})">Remove</button></td>
    `;
    employeeTable.appendChild(row);
  });
}

function removeEmployee(index) {
  employees.splice(index, 1);
  renderTable();
}

addEmployeeBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

employeeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const newEmployee = {
    name: document.getElementById("name").value,
    department: document.getElementById("department").value,
    jobTitle: document.getElementById("jobTitle").value,
    phone: document.getElementById("phone").value,
    email: document.getElementById("email").value,
    location: document.getElementById("location").value,
  };
  employees.push(newEmployee);
  renderTable();
  employeeForm.reset();
  modal.style.display = "none";
});

userAvatar.addEventListener("click", () => {
  dropdownMenu.style.display =
    dropdownMenu.style.display === "block" ? "none" : "block";
});

renderTable();
