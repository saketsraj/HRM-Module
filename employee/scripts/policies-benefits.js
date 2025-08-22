(function(){
  const searchEl = document.getElementById('search');
  const benefitsList = document.getElementById('benefitsList');
  const policiesList = document.getElementById('policiesList');
  const benefitsCount = document.getElementById('benefitsCount');
  const policiesCount = document.getElementById('policiesCount');
  const totalCount = document.getElementById('count');

  function key(){ return 'hrm:benefits_policies'; }
  function load(){ const raw=localStorage.getItem(key()); return raw? JSON.parse(raw) : { benefits: [], policies: [] }; }
  function save(data){ localStorage.setItem(key(), JSON.stringify(data)); }

  function chip(t){ return `<span class="tag">${t}</span>`; }
  function fmtDate(d){ if(!d) return '—'; const x=new Date(d); return x.toLocaleDateString(undefined,{year:'numeric',month:'short',day:'2-digit'}); }

  function cardHTML(rec){
    const tags = (rec.tags||[]).filter(Boolean).map(chip).join('');
    const link = rec.link ? `<a class="link" href="${rec.link}" target="_blank" rel="noopener">Open</a>` : '';
    return `
      <div class="item" data-id="${rec.id}">
        <div>
          <h4>${rec.title||'(Untitled)'}</h4>
          <div class="meta">Effective: ${fmtDate(rec.date)} • Updated: ${fmtDate(rec.updated)}</div>
          <div class="meta">${rec.desc||''}</div>
          <div class="tagrow">${tags}</div>
        </div>
        <div class="actions">${link}</div>
      </div>`;
  }

  function render(){
    const data = load();
    const q = (searchEl.value||'').toLowerCase();

    function matches(rec){
      if(!q) return true;
      const hay = [rec.title, rec.desc, ...(rec.tags||[])].join(' ').toLowerCase();
      return hay.includes(q);
    }

    const b = data.benefits.filter(matches);
    const p = data.policies.filter(matches);

    benefitsList.innerHTML = b.map(cardHTML).join('');
    policiesList.innerHTML = p.map(cardHTML).join('');

    benefitsCount.textContent = `${b.length} item${b.length!==1?'s':''}`;
    policiesCount.textContent = `${p.length} item${p.length!==1?'s':''}`;
    totalCount.textContent = `${b.length + p.length} items`;
  }

  // Seed with sample data if empty
  (function seed(){
    const data = load();
    if(data.benefits.length===0 && data.policies.length===0){
      const now = Date.now();
      data.benefits = [
        { id:'b1', title:'Health Insurance', date:new Date('2025-01-01').getTime(), desc:'Group medical coverage for employee + dependents.', tags:['medical','insurance'], link:'', updated:now },
        { id:'b2', title:'Gym Reimbursement', date:new Date('2025-04-01').getTime(), desc:'₹1,000/month fitness stipend.', tags:['wellness'], link:'', updated:now },
      ];
      data.policies = [
        { id:'p1', title:'Code of Conduct', date:new Date('2025-02-01').getTime(), desc:'Professional behavior and anti-harassment policy.', tags:['compliance'], link:'', updated:now },
        { id:'p2', title:'IT Usage Policy', date:new Date('2025-03-15').getTime(), desc:'Guidelines for company devices and data security.', tags:['security','it'], link:'', updated:now },
      ];
      save(data);
    }
  })();

  searchEl.addEventListener('input', render);
  render();
})();