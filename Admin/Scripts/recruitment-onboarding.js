// Toggle user avatar dropdown menu
const userAvatar = document.querySelector(".user-avatar");
const dropdownMenu = document.getElementById("dropdownMenu");

userAvatar.addEventListener("click", (e) => {
  e.stopPropagation(); // Prevent document click closing immediately
  dropdownMenu.classList.toggle("show");
});

document.addEventListener("click", () => {
  if (dropdownMenu.classList.contains("show")) {
    dropdownMenu.classList.remove("show");
  }
});

// Function to show stages content dynamically
function showStage(stage) {
  const box = document.getElementById("stage-box");
  box.innerHTML = ""; // Clear existing content

  switch (stage) {
    case "attracting":
      box.innerHTML = `
        <h3>🎯 Attracting</h3>
        <textarea placeholder="Post your job requirement here..."></textarea><br/><br/>
        <button>Publish on LinkedIn</button>
        <button>Publish on Twitter/X</button>
      `;
      break;
    case "screening":
      box.innerHTML = `
        <h3>📄 Screening - Upload Resumes</h3>
        <input type="file" multiple /><br/><br/>
        <h4>Candidate Resumes:</h4>
        <ul>
          <li>Ravi Kumar</li>
          <li>Priya Sharma</li>
          <li>Arjun Mehta</li>
          <li>Neha Verma</li>
        </ul>
      `;
      break;
    case "selecting":
      box.innerHTML = `
        <h3>🤝 Selecting - Schedule Interview</h3>
        <p>Choose a candidate to schedule interview:</p>
        <select id="candidateSelect">
          <option>Ravi Kumar</option>
          <option>Priya Sharma</option>
          <option>Arjun Mehta</option>
          <option>Neha Verma</option>
        </select><br/><br/>
        <input type="datetime-local" id="interviewTime" />
        <button onclick="scheduleInterview()">Schedule</button>
        <p id="interviewResult"></p>
      `;
      break;
    case "hiring":
      box.innerHTML = `
        <h3>📝 Hiring - Generate Offer Letter</h3>
        <p>Select candidate to generate offer letter:</p>
        <select id="hireCandidate">
          <option>Ravi Kumar</option>
          <option>Priya Sharma</option>
          <option>Arjun Mehta</option>
          <option>Neha Verma</option>
        </select>
        <button onclick="generateOffer()">Generate Offer Letter</button>
        <p id="offerResult"></p>
      `;
      break;
    case "onboarding":
      box.innerHTML = `
        <h3>🚀 Onboarding - Assign Mentor</h3>
        <p>New hires:</p>
        <ul>
          <li>Ravi Kumar</li>
          <li>Priya Sharma</li>
        </ul>
        <button onclick="assignMentor()">Assign Random Mentor</button>
        <p id="mentorResult"></p>
      `;
      break;
    default:
      box.innerHTML = "<p>Invalid stage selected.</p>";
  }
}

function scheduleInterview() {
  const candidate = document.getElementById("candidateSelect").value;
  const time = document.getElementById("interviewTime").value;
  const result = document.getElementById("interviewResult");
  if (time) {
    result.innerText = `✅ Interview scheduled for ${candidate} at ${new Date(
      time
    ).toLocaleString()}`;
  } else {
    result.innerText = "⚠️ Please select date & time!";
  }
}

function generateOffer() {
  const candidate = document.getElementById("hireCandidate").value;
  document.getElementById(
    "offerResult"
  ).innerText = `📄 Offer letter generated for ${candidate}`;
}

function assignMentor() {
  const mentors = ["Amit Singh", "Kavya Nair", "Rohit Gupta", "Sneha Joshi"];
  const randomMentor = mentors[Math.floor(Math.random() * mentors.length)];
  document.getElementById(
    "mentorResult"
  ).innerText = `🎉 Mentor assigned: ${randomMentor}`;
}
