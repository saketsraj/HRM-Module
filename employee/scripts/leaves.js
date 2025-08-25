(function () {
  const empIdEl = document.getElementById("empId");
  const monthPicker = document.getElementById("monthPicker");
  const statusFilter = document.getElementById("statusFilter");
  const typeFilter = document.getElementById("typeFilter");
  const tblBody = document.querySelector("#tbl tbody");
  const fType = document.getElementById("fType");
  const fReason = document.getElementById("fReason");
  const fStart = document.getElementById("fStart");
  const fEnd = document.getElementById("fEnd");
  const fDays = document.getElementById("fDays");
  const saveBtn = document.getElementById("saveBtn");
  const resetBtn = document.getElementById("resetBtn");

  const STATUSES = {
    PENDING: "Pending",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    CANCELLED: "Cancelled",
  };
  const TOTALS = { Annual: 12, Sick: 6, Casual: 6 }; 

  function key() {
    return `leave:simple:${empIdEl.value || "UNKNOWN"}`;
  }
  function load() {
    const raw = localStorage.getItem(key());
    return raw ? JSON.parse(raw) : { requests: [] };
  }
  function save(data) {
    localStorage.setItem(key(), JSON.stringify(data));
  }

  function parseYMD(ymd) {
    if (!ymd) return null;
    const [y, m, d] = ymd.split("-").map(Number);

    const dt = new Date();
    dt.setFullYear(y, (m || 1) - 1, d || 1);
    dt.setHours(0, 0, 0, 0);
    return dt;
  }
  function toYMD(d) {
    return [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, "0"),
      String(d.getDate()).padStart(2, "0"),
    ].join("-");
  }
  function addDays(d, n) {
    const x = new Date(d);
    x.setDate(x.getDate() + n);
    return x;
  }
  function isWeekend(d) {
    const w = d.getDay();
    return w === 0 || w === 6;
  }

  function businessDays(start, end) {
    if (!start || !end) return 0;
    if (end < start) return 0;
    let days = 0;
    let cur = new Date(start);
    while (cur <= end) {
      if (!isWeekend(cur)) days++;
      cur = addDays(cur, 1);
    }
    return days;
  }
  function monthMatches(d) {
    if (!monthPicker.value) return true;
    const m = new Date(monthPicker.value + "-01");
    return d.getMonth() === m.getMonth() && d.getFullYear() === m.getFullYear();
  }
  function chip(status) {
    const cls =
      status === STATUSES.APPROVED
        ? "ok"
        : status === STATUSES.PENDING
        ? "warn"
        : status === STATUSES.REJECTED
        ? "bad"
        : "";
    return `<span class="chip ${cls}">${status}</span>`;
  }
  function computeFormDays() {
    const s = parseYMD(fStart.value),
      e = parseYMD(fEnd.value);
    const d = businessDays(s, e);
    fDays.value = d ? String(d) : "0";
    return d;
  }

  function render() {
    const data = load();
    const used = { Annual: 0, Sick: 0, Casual: 0 };
    const pending = { Annual: 0, Sick: 0, Casual: 0 };
    data.requests.forEach((r) => {
      if (r.type in TOTALS) {
        if (r.status === STATUSES.APPROVED) used[r.type] += Number(r.days) || 0;
        if (r.status === STATUSES.PENDING)
          pending[r.type] += Number(r.days) || 0;
      }
    });
    document.querySelectorAll("#balances .balance-card").forEach((card) => {
      const type = card.getAttribute("data-type");
      const total = TOTALS[type] || 0;
      const u = used[type] || 0;
      const p = pending[type] || 0;
      const left = Math.max(0, total - u); 
      card.querySelector('[data-role="total"]').textContent = total;
      card.querySelector('[data-role="used"]').textContent = u;
      card.querySelector('[data-role="pending"]').textContent = p;
      card.querySelector('[data-role="left"]').textContent = `${left} left`;
    });

    const rows = data.requests
      .filter(
        (r) => statusFilter.value === "ALL" || r.status === statusFilter.value
      )
      .filter((r) => typeFilter.value === "ALL" || r.type === typeFilter.value)
      .filter(
        (r) => monthMatches(new Date(r.start)) || monthMatches(new Date(r.end))
      )
      .sort((a, b) => new Date(b.start) - new Date(a.start));

    tblBody.innerHTML = "";
    if (rows.length === 0) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 6;
      td.textContent = "No leave requests.";
      td.style.color = "#64748b";
      tr.appendChild(td);
      tblBody.appendChild(tr);
      return;
    }

    rows.forEach((r) => {
      const tr = document.createElement("tr");
      tr.dataset.id = r.id;
      const range = `${toYMD(new Date(r.start))} → ${toYMD(new Date(r.end))}`;
      tr.innerHTML = `
        <td>${range}</td>
        <td>${Number(r.days)}</td>
        <td>${r.type}</td>
        <td>${chip(r.status)}</td>
        <td>${r.reason || ""}</td>
        <td class="right">
          ${
            r.status === STATUSES.PENDING
              ? '<button data-act="cancel">Cancel</button>'
              : ""
          }
          ${
            r.status === STATUSES.CANCELLED
              ? '<button data-act="delete" class="danger">Delete</button>'
              : ""
          }
        </td>`;
      tblBody.appendChild(tr);
    });
  }

  function submit() {
    const data = load();
    const s = parseYMD(fStart.value),
      e = parseYMD(fEnd.value);
    if (!s || !e) {
      alert("Select start and end dates.");
      return;
    }
    if (e < s) {
      alert("End date cannot be before start.");
      return;
    }
    const days = computeFormDays();
    if (days <= 0) {
      alert("Calculated days is 0. Adjust dates.");
      return;
    }

    const id =
      window.crypto && crypto.randomUUID
        ? crypto.randomUUID()
        : `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const rec = {
      id,
      type: fType.value,
      reason: fReason.value,
      start: s,
      end: e,
      days,
      status: STATUSES.PENDING,
    };
    data.requests.push(rec);
    monthPicker.value = `${s.getFullYear()}-${String(s.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
    save(data);
    render();
    document.getElementById("form").reset();
    fDays.value = "0";
  }

  tblBody.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const tr = e.target.closest("tr");
    const id = tr.dataset.id;
    const data = load();
    const r = data.requests.find((x) => x.id === id);
    if (!r) return;
    if (btn.dataset.act === "cancel") r.status = STATUSES.CANCELLED;
    if (btn.dataset.act === "delete")
      data.requests = data.requests.filter((x) => x.id !== id);
    save(data);
    render();
  });

  [fStart, fEnd].forEach((el) =>
    el.addEventListener("change", computeFormDays)
  );
  saveBtn.addEventListener("click", submit);
  resetBtn.addEventListener("click", () => {
    fDays.value = "0";
  });
  [empIdEl, monthPicker, statusFilter, typeFilter].forEach((el) =>
    el.addEventListener("change", render)
  );
  document.getElementById("newBtn").addEventListener("click", () => {
    document.getElementById("form").scrollIntoView({ behavior: "smooth" });
    fStart.focus();
  });

  (function () {
    const now = new Date();
    monthPicker.value = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}`;
    render();
  })();
})();

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
