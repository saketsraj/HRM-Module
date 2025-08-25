document.querySelector(".user-avatar").addEventListener("click", () => {
  document.getElementById("dropdownMenu").classList.toggle("show");
});

window.addEventListener("click", (e) => {
  if (!e.target.matches(".user-avatar")) {
    let dropdown = document.getElementById("dropdownMenu");
    if (dropdown.classList.contains("show")) dropdown.classList.remove("show");
  }
});

(function () {
  const searchEl = document.getElementById("search");
  const benefitsList = document.getElementById("benefitsList");
  const policiesList = document.getElementById("policiesList");
  const benefitsCount = document.getElementById("benefitsCount");
  const policiesCount = document.getElementById("policiesCount");
  const totalCount = document.getElementById("count");
  const modal = document.getElementById("editModal");
  const form = document.getElementById("editForm");
  const modalTitle = document.getElementById("modalTitle");

  function storageKey() {
    return "hrm:benefits_policies_admin";
  }
  function loadData() {
    const raw = localStorage.getItem(storageKey());
    return raw ? JSON.parse(raw) : { benefits: [], policies: [] };
  }
  function saveData(data) {
    localStorage.setItem(storageKey(), JSON.stringify(data));
  }

  function chip(t) {
    return `<span class="tag">${t}</span>`;
  }

  function formatDate(dateVal) {
    if (!dateVal) return "—";
    const dt = new Date(dateVal);
    return dt.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  }

  function cardHTML(record, type) {
    const tagHTML = (record.tags || []).map(chip).join("");
    const linkHTML = record.link
      ? `<a class="link" href="${record.link}" target="_blank" rel="noopener noreferrer">Open</a>`
      : "";
    return `
      <div class="item" data-id="${record.id}" data-type="${type}">
        <div>
          <h4>${
            record.title ||
            (type === "benefits" ? "(New Benefit)" : "(New Policy)")
          }</h4>
          <div class="meta">Effective: ${formatDate(
            record.date
          )} • Updated: ${formatDate(record.updated)}</div>
          <div class="meta">${record.desc || ""}</div>
          <div class="tagrow">${tagHTML}</div>
        </div>
        <div class="actions">
          ${linkHTML}
          <button class="btn-small btn-edit">Edit</button>
          <button class="btn-small btn-delete">Delete</button>
        </div>
      </div>
    `;
  }

  function matches(record, term) {
    if (!term) return true;
    const haystack = [record.title, record.desc, ...(record.tags || [])]
      .join(" ")
      .toLowerCase();
    return haystack.includes(term);
  }

  function render() {
    const data = loadData();
    const query = (searchEl.value || "").toLowerCase().trim();

    const filteredBenefits = data.benefits.filter((r) => matches(r, query));
    const filteredPolicies = data.policies.filter((r) => matches(r, query));

    benefitsList.innerHTML = filteredBenefits
      .map((r) => cardHTML(r, "benefits"))
      .join("");
    policiesList.innerHTML = filteredPolicies
      .map((r) => cardHTML(r, "policies"))
      .join("");

    benefitsCount.textContent = `${filteredBenefits.length} item${
      filteredBenefits.length !== 1 ? "s" : ""
    }`;
    policiesCount.textContent = `${filteredPolicies.length} item${
      filteredPolicies.length !== 1 ? "s" : ""
    }`;
    totalCount.textContent = `${
      filteredBenefits.length + filteredPolicies.length
    } items`;

    document.querySelectorAll(".btn-edit").forEach((btn) => {
      btn.onclick = (e) => {
        const item = e.target.closest(".item");
        openModal(item.dataset.type, item.dataset.id);
      };
    });

    document.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.onclick = (e) => {
        const item = e.target.closest(".item");
        if (confirm("Delete this record?")) {
          deleteRecord(item.dataset.type, item.dataset.id);
        }
      };
    });
  }

  function openModal(type, id = null) {
    const data = loadData();
    let record = null;
    if (id) {
      record = data[type].find((r) => r.id === id);
    }
    modal.style.display = "flex";
    modalTitle.textContent = record
      ? `Edit ${type === "benefits" ? "Benefit" : "Policy"}`
      : `Add ${type === "benefits" ? "Benefit" : "Policy"}`;
    form.recordType.value = type;
    form.recordId.value = record ? record.id : "";
    form.titleInput.value = record ? record.title : "";
    form.descInput.value = record ? record.desc : "";
    form.tagsInput.value = record ? (record.tags || []).join(", ") : "";
    form.linkInput.value = record ? record.link : "";
    form.dateInput.value = record
      ? new Date(record.date).toISOString().slice(0, 10)
      : "";
  }

  function closeModal() {
    modal.style.display = "none";
  }

  function deleteRecord(type, id) {
    const data = loadData();
    data[type] = data[type].filter((r) => r.id !== id);
    saveData(data);
    render();
  }

  form.onsubmit = function (event) {
    event.preventDefault();
    const data = loadData();
    const type = form.recordType.value;
    const id = form.recordId.value || Date.now().toString();

    const record = {
      id,
      title: form.titleInput.value,
      desc: form.descInput.value,
      tags: form.tagsInput.value
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      link: form.linkInput.value,
      date: new Date(form.dateInput.value).getTime(),
      updated: Date.now(),
    };

    const index = data[type].findIndex((r) => r.id === id);
    if (index >= 0) {
      data[type][index] = record;
    } else {
      data[type].push(record);
    }

    saveData(data);
    closeModal();
    render();
  };

  (function seed() {
    const data = loadData();
    if (data.benefits.length === 0 && data.policies.length === 0) {
      const now = Date.now();
      data.benefits = [
        {
          id: "b1",
          title: "Health Insurance",
          date: new Date("2025-01-01").getTime(),
          desc: "Group medical coverage for employee + dependents.",
          tags: ["medical", "insurance"],
          link: "https://example.com/benefits/health",
          updated: now,
        },
        {
          id: "b2",
          title: "Gym Reimbursement",
          date: new Date("2025-04-01").getTime(),
          desc: "₹1,000/month fitness stipend to support employee wellness.",
          tags: ["wellness", "fitness"],
          link: "https://example.com/benefits/gym",
          updated: now,
        },
      ];
      data.policies = [
        {
          id: "p1",
          title: "Code of Conduct",
          date: new Date("2025-02-01").getTime(),
          desc: "Professional behavior and anti-harassment.",
          tags: ["compliance"],
          link: "https://example.com/policies/conduct",
          updated: now,
        },
        {
          id: "p2",
          title: "Leave Policy",
          date: new Date("2025-01-10").getTime(),
          desc: "Annual leave, sick leave, and holiday entitlements.",
          tags: ["leave"],
          link: "https://example.com/policies/leave",
          updated: now,
        },
      ];
      saveData(data);
    }
  })();

  searchEl.addEventListener("input", render);
  document.getElementById("addBenefit").onclick = () => openModal("benefits");
  document.getElementById("addPolicy").onclick = () => openModal("policies");
  document.getElementById("cancelBtn").onclick = closeModal;
  window.onclick = (e) => {
    if (e.target === modal) closeModal();
  };

  render();
})();
