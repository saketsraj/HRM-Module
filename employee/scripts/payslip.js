(function(){
  // Mock payslip data (replace with API later)
  const payslips = {
    '2025-08': {
      earnings: [
        { name:'Basic Pay', amount: 50000 },
        { name:'HRA', amount: 20000 },
        { name:'Special Allowance', amount: 8000 },
      ],
      deductions: [
        { name:'PF', amount: 4200 },
        { name:'Professional Tax', amount: 200 },
        { name:'TDS', amount: 3500 },
      ],
    },
    '2025-07': {
      earnings: [
        { name:'Basic Pay', amount: 50000 },
        { name:'HRA', amount: 20000 },
        { name:'Special Allowance', amount: 6000 },
      ],
      deductions: [
        { name:'PF', amount: 4200 },
        { name:'Professional Tax', amount: 200 },
        { name:'TDS', amount: 3200 },
      ],
    }
  };

  const monthSel = document.getElementById('month');
  const grossEl = document.getElementById('gross');
  const dedEl = document.getElementById('deductions');
  const takeEl = document.getElementById('takehome');
  const earnBody = document.querySelector('#earningsTbl tbody');
  const dedBody = document.querySelector('#deductionsTbl tbody');
  const metaMonth = document.getElementById('metaMonth');
  const empIdView = document.getElementById('empIdView');
  const printBtn = document.getElementById('printBtn');

  function fmt(n){ return new Intl.NumberFormat('en-IN', { style:'currency', currency:'INR', maximumFractionDigits:0 }).format(n); }

  function sum(arr){ return arr.reduce((a,b)=> a + (Number(b.amount)||0), 0); }

  function yyyymm(d){ return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`; }
  function monthLabel(ym){ const [y,m]=ym.split('-').map(Number); return new Date(y, m-1, 1).toLocaleDateString(undefined,{month:'long', year:'numeric'}); }

  function populateMonths(){
    // Combine mock keys + last 6 months for demo
    const keys = new Set(Object.keys(payslips));
    const now = new Date();
    for(let i=0;i<6;i++){ const d=new Date(now.getFullYear(), now.getMonth()-i, 1); keys.add(yyyymm(d)); }
    const list = Array.from(keys).sort().reverse();
    monthSel.innerHTML = '';
    for(const k of list){ const opt=document.createElement('option'); opt.value=k; opt.textContent=monthLabel(k); monthSel.appendChild(opt); }
    monthSel.value = yyyymm(now);
  }

  function render(){
    const key = monthSel.value;
    const data = payslips[key];
    metaMonth.textContent = monthLabel(key);

    // Clear tables
    earnBody.innerHTML = ''; dedBody.innerHTML = '';

    const earnings = data ? data.earnings : [];
    const deductions = data ? data.deductions : [];

    earnings.forEach(e => {
      const tr=document.createElement('tr');
      tr.innerHTML = `<td>${e.name}</td><td class="right">${fmt(e.amount)}</td>`;
      earnBody.appendChild(tr);
    });
    deductions.forEach(d => {
      const tr=document.createElement('tr');
      tr.innerHTML = `<td>${d.name}</td><td class="right">${fmt(d.amount)}</td>`;
      dedBody.appendChild(tr);
    });

    const gross = sum(earnings);
    const ded = sum(deductions);
    const take = Math.max(0, gross - ded);

    grossEl.textContent = fmt(gross);
    dedEl.textContent = fmt(ded);
    takeEl.textContent = fmt(take);
  }

  monthSel.addEventListener('change', render);
  printBtn.addEventListener('click', () => window.print());

  // init
  populateMonths();
  render();
})();