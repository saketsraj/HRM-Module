(function () {
  const rowsEl = document.getElementById("rows");
  const empIdEl = document.getElementById("empId");
  const empNameEl = document.getElementById("empName");
  const weekPicker = document.getElementById("weekPicker");
  const weekStartSel = document.getElementById("weekStart");
  const summaryEl = document.getElementById("summary");

  function storeKey() {
    return `att:v2:${empIdEl.value || "UNKNOWN"}`;
  }
  function load() {
    const raw = localStorage.getItem(storeKey());
    return raw ? JSON.parse(raw) : {};
  }
  function save(data) {
    localStorage.setItem(storeKey(), JSON.stringify(data));
  }

  function startOfWeek(date, weekStart = 1) {
    // 0 Sun, 1 Mon
    const d = new Date(date);
    const day = d.getDay();
    const diff = day < weekStart ? 7 - (weekStart - day) : day - weekStart;
    d.setDate(d.getDate() - diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }
  function fmtDate(d) {
    return d.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
  function fmtHrs(mins) {
    const h = Math.floor(mins / 60),
      m = mins % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  }
  function dayKey(d) {
    const dd = new Date(d);
    dd.setHours(0, 0, 0, 0);
    return String(dd.getTime());
  }

  function calcMinutes(from, to) {
    if (!from || !to) return 0;
    const [fh, fm] = from.split(":"),
      [th, tm] = to.split(":");
    const s = parseInt(fh) * 60 + parseInt(fm);
    const e = parseInt(th) * 60 + parseInt(tm);
    return Math.max(0, e - s);
  }

  function statusFor(date, rec) {
    const day = date.getDay();
    if (day === 0 || day === 6) return { label: "Weekend", color: "wknd" };
    if (!rec || !rec.in || !rec.out) return { label: "Absent", color: "abs" };
    return { label: "Present", color: "present" };
  }

  function buildWeek(baseDate) {
    rowsEl.innerHTML = "";
    const data = load();
    let weekTotal = 0;

    const start = startOfWeek(baseDate, parseInt(weekStartSel.value, 10));
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      const k = dayKey(day);
      const rec = data[k] || { in: "", out: "", notes: "" };
      const mins = calcMinutes(rec.in, rec.out);
      weekTotal += mins;
      const st = statusFor(day, rec);

      const row = document.createElement("div");
      row.className = "row";
      row.dataset.key = k;
      row.innerHTML = `
        <div class="daycol">
          <div class="dow">${day.toLocaleDateString(undefined, {
            weekday: "short",
          })}</div>
          <div class="dnum">${day.getDate()} ${day.toLocaleDateString(
        undefined,
        { month: "short" }
      )}</div>
        </div>
        <div>
          <div class="barwrap">
            <div class="line">
              <span class="cap left"></span>
              <span class="cap right"></span>
              <span class="barfill ${st.color}" style="width:${
        st.label === "Present" ? Math.min(100, (mins / 480) * 100) : 100
      }%"></span>
            </div>
            <span class="barlabel">${st.label}</span>
          </div>
          <div class="controls">
            <div class="field">
              <label class="sub">Check in</label>
              <input type="time" class="in" value="${rec.in}" />
            </div>
            <div class="field">
              <label class="sub">Check out</label>
              <input type="time" class="out" value="${rec.out}" />
            </div>
            <div class="field" style="margin-left:auto">
              <span class="pill">${
                st.label === "Present" ? "Worked ~ " + fmtHrs(mins) : "No hours"
              }</span>
            </div>
          </div>
        </div>
        <div class="meta">
          <div class="hrs">${fmtHrs(mins)}</div>
          <div class="sub">Hrs worked</div>
        </div>`;

      // listeners
      row.querySelector(".in").addEventListener("change", (e) => {
        const d = load();
        d[k] = d[k] || { in: "", out: "", notes: "" };
        d[k].in = e.target.value;
        save(d);
        buildWeek(baseDate);
      });
      row.querySelector(".out").addEventListener("change", (e) => {
        const d = load();
        d[k] = d[k] || { in: "", out: "", notes: "" };
        d[k].out = e.target.value;
        save(d);
        buildWeek(baseDate);
      });

      rowsEl.appendChild(row);
    }

    summaryEl.textContent = `${empNameEl.value} • Week Total: ${fmtHrs(
      weekTotal
    )}`;
  }

  // init week picker to current week
  function initWeekPicker() {
    const now = new Date();
    const week = getWeekString(now);
    weekPicker.value = week;
  }
  function getWeekString(date) {
    // YYYY-Www per HTML spec (ISO week, starts Monday)
    const d = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    const dayNum = d.getUTCDay() || 7; // 1-7, Mon=1
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
  }
  function dateFromWeekString(str) {
    // returns a date roughly in that ISO week; we'll then compute startOfWeek based on setting
    const [y, w] = str.split("-W");
    const simple = new Date(
      Date.UTC(parseInt(y), 0, 1 + (parseInt(w) - 1) * 7)
    );
    const dow = simple.getUTCDay();
    const ISOweekStart = simple;
    if (dow <= 4)
      ISOweekStart.setUTCDate(simple.getUTCDate() - simple.getUTCDay() + 1);
    else ISOweekStart.setUTCDate(simple.getUTCDate() + 8 - simple.getUTCDay());
    return new Date(ISOweekStart);
  }

  empIdEl.addEventListener("change", () =>
    buildWeek(dateFromWeekString(weekPicker.value))
  );
  empNameEl.addEventListener("change", () =>
    buildWeek(dateFromWeekString(weekPicker.value))
  );
  weekPicker.addEventListener("change", (e) =>
    buildWeek(dateFromWeekString(e.target.value))
  );
  weekStartSel.addEventListener("change", () =>
    buildWeek(dateFromWeekString(weekPicker.value))
  );

  initWeekPicker();
  buildWeek(new Date());
})();

// toggle dropdown on click
document.addEventListener("DOMContentLoaded", () => {
  const userMenu = document.querySelector(".user-menu");
  const dropdown = document.getElementById("dropdownMenu");

  userMenu.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent body click from closing immediately
    dropdown.classList.toggle("show");
  });

  // close dropdown if clicking outside
  document.addEventListener("click", () => {
    dropdown.classList.remove("show");
  });
});
