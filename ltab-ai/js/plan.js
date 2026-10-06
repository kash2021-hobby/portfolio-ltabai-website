/* Build-your-own testing plan: pick what to test, how much it matters, then size it.
   No prices. Output is a rough size (tester-days) + a day-by-day schedule + a plan summary
   that is sent with the intake form. A testing lead confirms the final scope in a proposal. */
(function(){
  const root = document.getElementById('bldMain');
  if(!root) return;
  const sum = document.getElementById('bldSum');
  const $ = (s,el=document)=>el.querySelector(s);

  /* ---------- what can be tested (base = tester-days at "Important") ---------- */
  const ITEMS = [
    {id:'journeys', name:'Click-through testing', d:'A real person uses your app like a customer: sign up, search, pay.', base:2},
    {id:'xbrowser', name:'Cross-browser testing', d:'Chrome, Safari, Edge, Firefox. Does it look and work the same in each?', base:1},
    {id:'compat',   name:'Phones, tablets & screens', d:'Real devices and screen sizes. Buttons you can tap, text you can read.', base:1.5},
    {id:'regress',  name:'Repeat tests for old features', d:'Check that what worked before still works. Re-run every release.', base:1.5},
    {id:'hotfix',   name:'Hotfix checks', d:'An urgent fix is on its way. We check it fast, and what it might have broken.', base:.5},
    {id:'api',      name:'Connections between tools', d:'The parts behind the screen that move data around (APIs).', base:1},
    {id:'perf',     name:'Speed testing', d:'Slow internet, many users at once, long lists. Does it keep up?', base:1.5},
    {id:'sec',      name:'Common attack checks', d:'The usual doors left open: SQL injection, weak logins, data anyone can see.', base:1},
    {id:'ai',       name:'AI feature testing', d:'Made-up answers, tricky questions, unsafe replies, leaked private info.', base:2},
    {id:'pen',      name:'Penetration testing', d:'A specialist breaks into your system on purpose, with your written permission.', base:0, special:true}
  ];
  const IMP = [['nice','Nice to have',.6],['imp','Important',1],['must','Must have',1.5]];
  const PEN_LEVEL = ['Quick scan','Standard','Deep'];
  const PEN_DATA  = ['Public info only','Personal data (names, emails)','Sensitive (payments, health, IDs)'];
  const PLATFORMS = ['Website','Web app','iOS app','Android app','API'];
  const REL = [['once','One-off'],['1','1 release a month'],['2','2 releases a month'],['4','Every week']];

  const PRESETS = {
    sprint:{ label:'Launch check', sub:'One app, one round, before launch', env:1, dev:4, days:7, rel:'once', pick:{journeys:'must',xbrowser:'imp',compat:'imp',sec:'imp',regress:'nice'} },
    managed:{ label:'Every release', sub:'A tester on every release, ongoing', env:3, dev:6, days:5, rel:'2', pick:{journeys:'must',regress:'must',xbrowser:'imp',compat:'imp',api:'imp',hotfix:'imp',sec:'nice'} },
    ai:{ label:'My app has AI', sub:'Chatbot, assistant, smart search', env:1, dev:3, days:5, rel:'once', pick:{journeys:'imp',ai:'must',sec:'imp',api:'nice'} },
    scratch:{ label:'Start from zero', sub:'Pick everything yourself', env:1, dev:2, days:5, rel:'once', pick:{} }
  };

  let st = null;
  function load(key){
    const p = PRESETS[key];
    st = { preset:key, pick:{...p.pick}, env:p.env, dev:p.dev, days:p.days, rel:p.rel, platforms:['Website'], penLevel:1, penData:1 };
  }
  load('sprint');

  /* ---------- sizing ---------- */
  function calc(){
    const rows = ITEMS.filter(i=>!i.special && st.pick[i.id]).map(i=>{
      const w = IMP.find(x=>x[0]===st.pick[i.id])[2];
      // environments and devices only widen the parts that run per environment or per device
      const envX = ['journeys','regress','api','sec'].includes(i.id) ? 1+.25*(st.env-1) : 1;
      const devX = ['compat','xbrowser','journeys'].includes(i.id) ? 1+.06*(st.dev-1) : 1;
      return {item:i, imp:st.pick[i.id], effort:i.base*w*envX*devX};
    });
    const effort = rows.reduce((a,r)=>a+r.effort,0);
    const setup = rows.length ? 1 : 0;           // plan + set-up
    const wrap  = rows.length ? 1 : 0;           // report + retest
    const total = Math.max(0, Math.round((effort+setup+wrap)*2)/2);
    const team = rows.length ? Math.max(1, Math.ceil(total/Math.max(1,st.days))) : 0;
    return {rows, total, team};
  }
  const impOrder = {must:0, imp:1, nice:2};

  function schedule(rows){
    const D = st.days; if(!rows.length) return [];
    const out = Array.from({length:D}, ()=>[]);
    if(D===1){ out[0] = ['Plan, test, report']; return out; }
    out[0] = ['Plan & set-up'];
    out[D-1] = D>2 ? ['Report & retest'] : ['Test & report'];
    const mid = D>2 ? D-2 : 0;
    const sorted = [...rows].sort((a,b)=>impOrder[a.imp]-impOrder[b.imp]);
    if(mid===0){ out[1] = ['Test & report'].concat(sorted.map(r=>r.item.name)); return out; }
    const tot = sorted.reduce((a,r)=>a+r.effort,0);
    let cum = 0;
    sorted.forEach(r=>{
      const s = Math.min(mid-1, Math.floor(cum/tot*mid));
      const e = Math.min(mid-1, Math.max(s, Math.ceil((cum+r.effort)/tot*mid)-1));
      for(let d=s; d<=e; d++) out[1+d].push(r.item.name);
      cum += r.effort;
    });
    return out;
  }

  function suggest(c){
    if(!c.rows.length) return '';
    if(st.rel!=='once') return 'Managed Release QA';
    const ai = c.rows.find(r=>r.item.id==='ai');
    if(ai && c.rows.length<=4) return 'AI Feature Check';
    return 'Release Readiness QA Sprint';
  }

  /* ---------- render: choices ---------- */
  const seg = (key, opts, cur)=>`<div class="seg" role="group">${opts.map(([v,l])=>`<button type="button" data-k="${key}-${v}" data-a="${key}" data-v="${v}" class="${cur===v?'on':''}">${l}</button>`).join('')}</div>`;
  const stepper = (key,label,help,val,min,max)=>`<div class="stp"><div><b>${label}</b><span>${help}</span></div>
    <div class="stp-c"><button type="button" data-k="${key}-m" data-a="${key}" data-v="-1" aria-label="Fewer ${label}" ${val<=min?'disabled':''}>−</button><output>${val}</output><button type="button" data-k="${key}-p" data-a="${key}" data-v="1" aria-label="More ${label}" ${val>=max?'disabled':''}>+</button></div></div>`;

  function render(){
    const active = document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.k : null;
    root.innerHTML = `
      <div class="bstep">
        <span class="bk">Step 1 · Start from</span>
        <h4>Pick a ready plan, or start from zero.</h4>
        <div class="bpre">${Object.entries(PRESETS).map(([k,p])=>`<button type="button" data-k="pre-${k}" data-a="preset" data-v="${k}" class="${st.preset===k?'on':''}"><b>${p.label}</b><span>${p.sub}</span></button>`).join('')}</div>
      </div>

      <div class="bstep">
        <span class="bk">Step 2 · What to test</span>
        <h4>Switch on what you need. Say how much it matters.</h4>
        <p class="bhelp">Must-haves are tested first and in the most depth. Nice-to-haves get a lighter pass.</p>
        <div class="bitems">${ITEMS.map(i=>{
          const on = i.special ? !!st.pick.pen : !!st.pick[i.id];
          const cur = st.pick[i.id];
          return `<div class="bit ${on?'on':''}">
            <button type="button" class="bit-t" data-k="tog-${i.id}" data-a="tog" data-v="${i.id}" aria-pressed="${on}"><i></i><span><b>${i.name}</b><em>${i.d}</em></span></button>
            ${on && !i.special ? seg('imp-'+i.id, IMP.map(x=>[x[0],x[1]]), cur).replace(/data-a="imp-[a-z]+"/g,`data-a="imp" data-id="${i.id}"`) : ''}
            ${on && i.special ? `<div class="bit-pen">
               <div><span class="bl">How deep?</span>${seg('pl',PEN_LEVEL.map((l,n)=>[String(n),l]),String(st.penLevel))}</div>
               <div><span class="bl">How sensitive is your data?</span>${seg('pd',PEN_DATA.map((l,n)=>[String(n),l]),String(st.penData))}</div>
               <p class="bhelp" style="margin:0">Penetration testing is its own specialist job. It is quoted separately and needs your written permission. We tell you early if you need it${st.penData===2?'. With payments or health data, you almost certainly do':''}.</p>
             </div>` : ''}
          </div>`;}).join('')}</div>
      </div>

      <div class="bstep">
        <span class="bk">Step 3 · Size it</span>
        <h4>How big is the job?</h4>
        <div class="bsize">
          ${stepper('days','Testing days','Days per release or round. Day 1 is plan and set-up.',st.days,1,30)}
          ${stepper('env','Environments','Where we test: dev, staging, pre-production…',st.env,1,8)}
          ${stepper('dev','Devices & browsers','Phones, tablets and browsers on your list.',st.dev,1,20)}
        </div>
        <div class="bfield"><span class="bl">What are we testing?</span>
          <div class="seg multi">${PLATFORMS.map(p=>`<button type="button" data-k="pf-${p}" data-a="pf" data-v="${p}" class="${st.platforms.includes(p)?'on':''}">${p}</button>`).join('')}</div></div>
        <div class="bfield"><span class="bl">How often?</span>${seg('rel',REL,st.rel)}</div>
      </div>`;
    if(active){ const el = root.querySelector(`[data-k="${active}"]`); if(el && !el.disabled) el.focus({preventScroll:true}); }
    renderSum();
  }

  /* ---------- render: summary ---------- */
  function renderSum(){
    const c = calc(), sched = schedule(c.rows), pk = suggest(c);
    const impL = {must:'Must have', imp:'Important', nice:'Nice to have'};
    const rowsHtml = c.rows.sort((a,b)=>impOrder[a.imp]-impOrder[b.imp]).map(r=>`<li><span>${r.item.name}</span><i class="t-${r.imp}">${impL[r.imp]}</i></li>`).join('');
    const pen = st.pick.pen ? `<li><span>Penetration testing<small>${PEN_LEVEL[st.penLevel]} · ${PEN_DATA[st.penData]}</small></span><i class="t-sep">Quoted separately</i></li>` : '';
    if(!c.rows.length && !pen){
      sum.innerHTML = `<div class="bs-empty">Nothing picked yet. Choose a ready plan or switch something on, and your plan appears here.</div>`;
      window.__ltabPlan = null; return;
    }
    const fit = c.team>1 ? `To finish in ${st.days} day${st.days>1?'s':''} we would put ${c.team} testers on it. Or add days.` : `One tester can finish this in ${st.days} day${st.days>1?'s':''}.`;
    const relL = REL.find(x=>x[0]===st.rel)[1];
    sum.innerHTML = `
      ${c.rows.length ? `<div class="bs-big"><b>~${c.total}</b><span>tester-days · ${c.team} tester${c.team>1?'s':''}<small>${fit}</small></span></div>` : ''}
      <div class="bs-facts"><span><b>${st.days}</b> day${st.days>1?'s':''}</span><span><b>${st.env}</b> environment${st.env>1?'s':''}</span><span><b>${st.dev}</b> device${st.dev>1?'s':''}</span><span>${relL}</span></div>
      <ul class="bs-list">${rowsHtml}${pen}</ul>
      ${sched.length ? `<div class="bs-k">Your testing days</div><ol class="bs-sched">${sched.map((d,i)=>`<li><b>Day ${i+1}</b><span>${[...new Set(d)].join(' · ')}</span></li>`).join('')}</ol>` : ''}
      ${pk ? `<div class="bs-match"><span>Closest ready-made plan</span><b>${pk}</b></div>` : ''}`;
    window.__ltabPlan = {
      preset:PRESETS[st.preset].label, days:st.days, environments:st.env, devices:st.dev, platforms:st.platforms, frequency:relL,
      items: c.rows.map(r=>({name:r.item.name, importance:impL[r.imp]})),
      penetration: st.pick.pen ? {level:PEN_LEVEL[st.penLevel], data:PEN_DATA[st.penData]} : null,
      rough_tester_days:c.total, testers:c.team, closest_package:pk,
      schedule: sched.map((d,i)=>`Day ${i+1}: ${[...new Set(d)].join(', ')}`)
    };
  }

  /* ---------- events ---------- */
  root.addEventListener('click', e=>{
    const b = e.target.closest('button[data-a]'); if(!b || b.disabled) return;
    const a = b.dataset.a, v = b.dataset.v;
    if(a==='preset') load(v);
    else if(a==='tog'){ if(st.pick[v]) delete st.pick[v]; else st.pick[v] = 'imp'; }
    else if(a==='imp') st.pick[b.dataset.id] = v;
    else if(a==='days') st.days = Math.min(30,Math.max(1,st.days+ +v));
    else if(a==='env')  st.env  = Math.min(8,Math.max(1,st.env+ +v));
    else if(a==='dev')  st.dev  = Math.min(20,Math.max(1,st.dev+ +v));
    else if(a==='pf'){ st.platforms = st.platforms.includes(v) ? st.platforms.filter(x=>x!==v) : [...st.platforms,v]; }
    else if(a==='rel') st.rel = v;
    else if(a==='pl') st.penLevel = +v;
    else if(a==='pd') st.penData = +v;
    render();
  });

  $('#bldReset').addEventListener('click', ()=>{ load('sprint'); render(); });
  $('#bldSend').addEventListener('click', ()=>{
    if(window.__ltabPlan) document.dispatchEvent(new CustomEvent('ltab:plan',{detail:window.__ltabPlan}));
  });

  render();
})();
