/* Build-your-own testing plan: a short interview about the project, then the plan.
   No prices. Sizes in QA points (1 point = half a tester's focused day), builds a rough
   schedule, and sends the whole plan with the intake form. A testing lead confirms
   the final scope in a proposal; penetration testing is always quoted separately. */
(function(){
  const root = document.getElementById('bldMain');
  if(!root) return;
  const sum = document.getElementById('bldSum');
  const $ = (s,el=document)=>el.querySelector(s);
  const $$ = (s,el=document)=>[...el.querySelectorAll(s)];
  const esc = t=>String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;');

  const STEPS = [
    ['Project','about your project'],
    ['Coverage','what to cover'],
    ['Security','security and depth'],
    ['Depth','feature depth'],
    ['Timeline','dates and devices'],
    ['Review','your plan'],
  ];

  const IMP = [['nice','Nice to have',.6],['imp','Important',1],['must','Must have',1.5]];
  const IMPK = IMP.map(x=>x[0]);
  const impW = i=>{ const x=IMP.find(y=>y[0]===i); return (x||IMP[1])[2]; };
  const impL = {must:'Must have', imp:'Important', nice:'Nice to have'};
  const impOrder = {must:0, imp:1, nice:2};
  const PEN_LEVEL = ['Quick scan','Standard','Deep'];
  const PEN_DATA  = ['Public info only','Personal data (names, emails)','Sensitive (payments, health, IDs)'];
  const PLATFORMS = ['Website','Web app','iOS app','Android app','API'];
  const REL = [['once','One-off'],['1','1 release a month'],['2','2 releases a month'],['4','Every week']];
  const GRAN = [['lite','One pass per feature','We click through each feature once, the way a new user would.'],
                ['std','One story, several cases','Main case, plus the obvious bad-input tries.'],
                ['deep','Deep: bad input and worse','Sign-up, wrong password, no internet, weird input. The lot.']];
  const GRAN_M = {lite:.75, std:1, deep:1.5};
  const DOCS = ['PRD or product docs','Functional spec','Release notes','API list','None yet — we can work from a demo'];

  /* all the checks a plan can contain, with base effort in tester-days at "Important" */
  const DEFS = [
    {id:'journeys', name:'Every feature, tested', d:'Click through each feature like a new user. Scales with how many features you have.',
      base:()=>Math.max(2, st.modules*.35*GRAN_M[st.gran]), x:'env', imp:()=>st.a.functional==='yes'?'must':'imp',
      on:()=>st.a.functional==='yes'||(st.preset!=='scratch'&&st.a.functional==='unsure')},
    {id:'e2e', name:'End-to-end, like a real user', d:'First visit to the last step: the whole trip, top to bottom, like your best and worst customer.',
      base:()=>2.5, x:'env', imp:()=>'imp', on:()=>st.a.e2e==='yes'||(st.preset!=='scratch'&&st.a.e2e==='unsure')},
    {id:'api', name:'Connections to other services', d:'Do the outside data sources answer, answer right, and survive a slow day?',
      base:()=>1, x:'env', imp:()=>st.a.apiTest==='yes'?'must':'imp', on:()=>st.a.api==='yes'&&st.a.apiTest!=='no'},
    {id:'db', name:'Database checks', d:'Saved today, still there tomorrow. Records come back exactly as stored.',
      base:()=>1, x:'env', imp:()=>'imp', on:()=>st.a.db==='yes'||(st.preset!=='scratch'&&st.a.db==='unsure')},
    {id:'regress', name:'Old features, re-checked', d:'What worked last release must still work. Run every release.',
      base:()=>1.5, x:'env', imp:()=>['must','nice'].includes(st.a.regress)?st.a.regress:'imp', on:()=>['must','nice'].includes(st.a.regress)},
    {id:'hotfix', name:'Hotfix checks', d:'An urgent fix is on its way. Checked fast, and checked for what it might have broken.',
      base:()=>.5, x:null, imp:()=>'imp', on:()=>!!st.a.keep&&st.rel!=='once'},
    {id:'xbrowser', name:'Cross-browser testing', d:'Chrome, Safari, Edge, Firefox. Does it look and work the same in each?',
      base:()=>1, x:null, imp:()=>'imp', on:()=>st.preset!=='scratch'},
    {id:'compat', name:'Phones, tablets & screens', d:'Real devices and screen sizes. Buttons you can tap, text you can read.',
      base:()=>1.5, x:'dev', imp:()=>'imp', on:()=>st.preset!=='scratch'},
    {id:'sec', name:'Common attack checks', d:'The usual doors left open: SQL injection, weak logins, data anyone can read.',
      base:()=>1, x:'env', imp:()=>st.sec==='full'?'must':'imp', on:()=>st.sec!=='none'},
    {id:'perf', name:'Speed testing', d:'Slow internet, many users at once, long lists. Does it keep up?',
      base:()=>1.5, x:null, imp:()=>'imp', on:()=>!!st.a.speed},
    {id:'ai', name:'AI feature testing', d:'Made-up answers, tricky questions, unsafe replies, leaked private info.',
      base:()=>2, x:null, imp:()=>'must', on:()=>st.a.ai==='yes'||(st.preset!=='scratch'&&st.a.ai==='unsure')},
  ];
  const XF = { env:()=>1+.25*(st.env-1), dev:()=>1+(st.dev-1)*.06 };

  const PRESETS = {
    sprint:{ label:'Launch check', sub:'One app, one round, before launch',
      v:{env:1,dev:4,days:7,rel:'once',gran:'std',auto:false,sec:'basic',pen:false,modules:6,
         a:{functional:'yes',api:'no',db:'no',e2e:'yes',ai:'no',regress:'nice',keep:false,speed:false}} },
    managed:{ label:'Every release', sub:'A tester on every release, ongoing',
      v:{env:3,dev:6,days:5,rel:'2',gran:'std',auto:false,sec:'basic',pen:false,modules:8,
         a:{functional:'yes',api:'yes',apiTest:'yes',db:'no',e2e:'yes',ai:'no',regress:'must',keep:true,speed:false}} },
    ai:{ label:'My app has AI', sub:'Chatbot, assistant, smart search',
      v:{env:1,dev:3,days:5,rel:'once',gran:'std',auto:false,sec:'full',pen:false,modules:5,
         a:{functional:'yes',api:'no',db:'no',e2e:'no',ai:'yes',regress:'nice',keep:false,speed:false}} },
    scratch:{ label:'Start from zero', sub:'Answer the questions yourself',
      v:{env:1,dev:2,days:5,rel:'once',gran:'std',auto:false,sec:'none',pen:false,modules:6,
         a:{functional:'unsure',api:'unsure',db:'unsure',e2e:'unsure',ai:'unsure',regress:'unsure',keep:false,speed:false}} }
  };

  let st = null;
  function load(key){
    const p = PRESETS[key].v;
    st = { preset:key, step:0, about:'', modules:p.modules, a:{...p.a},
      gran:p.gran, auto:p.auto, autoScripts:0, sec:p.sec, pen:p.pen, penLevel:1, penData:1,
      rel:p.rel, env:p.env, dev:p.dev, platforms:['Website'], days:p.days, date:'', docs:[] };
    syncAutoScripts();
  }
  function syncAutoScripts(){ if(st.auto && !st.autoScripts) st.autoScripts = Math.max(2, st.modules); }

  /* importance: review-step override wins */
  const importance = id => {
    if(st.a['f_'+id]==='off') return null;
    const d = DEFS.find(x=>x.id===id); if(!d) return null;
    const raw = st.a['f_'+id] || d.imp();
    return IMPK.includes(raw) ? raw : 'imp';
  };

  function calc(){
    const rows = [];
    for(const d of DEFS){
      const imp = importance(d.id);
      if(!d.on() || !imp) continue;
      const x = d.x ? XF[d.x]() : 1;
      rows.push({id:d.id, name:d.name, d:d.d, imp, effort:d.base()*impW(imp)*x});
    }
    const effort = rows.reduce((s,r)=>s+r.effort,0);
    const testerDays = rows.length ? Math.round((effort + (st.auto?st.autoScripts*.25:0) + 2)*2)/2 : 0; // +2: plan/set-up + report/retest
    const qaPoints = Math.round((testerDays*2 + (st.auto?st.autoScripts*.5:0))*2)/2;
    const team = rows.length ? Math.max(1, Math.ceil(testerDays/Math.max(1,st.days))) : 0;
    return {rows, testerDays, qaPoints, team};
  }

  function schedule(rows){
    const D = st.days; if(!rows.length) return [];
    const out = Array.from({length:D}, ()=>[]);
    if(D===1){ out[0] = ['Plan, test, report']; return out; }
    out[0] = ['Plan & set-up'];
    out[D-1] = D>2 ? ['Report & retest'] : ['Test & report'];
    const mid = D>2 ? D-2 : 0;
    const sorted = [...rows].sort((a,b)=>impOrder[a.imp]-impOrder[b.imp]);
    if(mid===0){ out[1] = [...new Set(['Test & report', ...sorted.map(r=>r.name)])]; return out; }
    const tot = sorted.reduce((a,r)=>a+r.effort,0);
    let cum = 0;
    sorted.forEach(r=>{
      let s = Math.min(mid-1, Math.floor(cum/tot*mid));
      let e = Math.min(mid-1, Math.max(s, Math.ceil((cum+r.effort)/tot*mid)-1));
      for(let d=s; d<=e; d++) out[1+d].push(r.name);
      cum += r.effort;
    });
    return out;
  }

  function suggest(c){
    if(!c.rows.length) return '';
    if(st.rel!=='once') return 'Managed Release QA';
    if(st.a.ai==='yes') return 'AI Feature Check';
    return 'Release Readiness QA Sprint';
  }

  /* ---------- small builders ---------- */
  const seg = (a,v,opts,cls)=>`<div class="seg ${cls||''}">${opts.map(([val,l])=>`<button type="button" data-a="${a}" data-v="${esc(val)}" class="${String(v)===String(val)?'on':''}">${l}</button>`).join('')}</div>`;
  const yn = (a,v)=>seg(a,v,[['yes','Yes'],['no','No']]);
  const stepper = (a,label,help,val,min,max)=>`<div class="stp"><div><b>${label}</b><span>${help}</span></div>
    <div class="stp-c"><button type="button" data-a="${a}" data-v="-1" aria-label="Fewer ${esc(label)}" ${val<=min?'disabled':''}>−</button><output>${val}</output><button type="button" data-a="${a}" data-v="1" aria-label="More ${esc(label)}" ${val>=max?'disabled':''}>+</button></div></div>`;

  /* ---------- step bodies ---------- */
  function body(){
    switch(st.step){
      case 0: return `
        <span class="bk">Step 1 · ${STEPS[0][1]}</span>
        <h4>What are we testing?</h4>
        <div class="bpre">${Object.entries(PRESETS).map(([k,p])=>`<button type="button" data-a="preset" data-v="${k}" class="${st.preset===k?'on':''}"><b>${p.label}</b><span>${p.sub}</span></button>`).join('')}</div>
        <div class="bfield"><span class="bl">One line, what is this project?</span>
          <textarea class="bta" id="bAbout" rows="2" placeholder="e.g. A booking app for clinics — patients pick a slot and pay">${esc(st.about)}</textarea></div>
        <div class="bfield"><span class="bl">What kind of product is it?</span>
          <div class="seg multi">${PLATFORMS.map(p=>`<button type="button" data-a="ptype" data-v="${p}" class="${st.platforms.includes(p)?'on':''}">${p}</button>`).join('')}</div></div>
        ${stepper('modules','Main features or sections','Sign-up, booking, dashboard… count the big ones.',st.modules,1,40)}`;
      case 1: return `
        <span class="bk">Step 2 · ${STEPS[1][1]}</span>
        <h4>What should get covered?</h4>
        <p class="bhelp">Your answers switch whole areas of the plan on or off. You can fine-tune everything in the last step.</p>
        <div class="bq"><div class="bq-t"><b>Does each feature need functional testing?</b><span>Click through every feature and see it actually work.</span></div>${seg('c-functional',st.a.functional,[['yes','Yes'],['no','No'],['unsure','Not sure']])}</div>
        <div class="bq"><div class="bq-t"><b>Do you pull data from other services?</b><span>Payments, maps, email tools… some people call them APIs.</span></div>${yn('c-api',st.a.api)}</div>
        ${st.a.api==='yes'?`<div class="bq sub"><div class="bq-t"><b>Should we test those connections too?</b></div>${yn('c-apiTest',st.a.apiTest||'yes')}</div>`:''}
        <div class="bq"><div class="bq-t"><b>Test the end-to-end journey?</b><span>Like a regular user: sign up, do the main thing, get the confirmation.</span></div>${yn('c-e2e',st.a.e2e)}</div>
        <div class="bq"><div class="bq-t"><b>Check the database?</b><span>Saved today, still there tomorrow. What you store is what you get back.</span></div>${yn('c-db',st.a.db)}</div>
        <div class="bq"><div class="bq-t"><b>Does your app use AI?</b><span>A chatbot, smart answers, summaries. Those fail in their own ways, so we test them differently.</span></div>${yn('c-ai',st.a.ai)}</div>
        <div class="bq"><div class="bq-t"><b>Will you keep building after this release?</b><span>New features and fixes will keep coming.</span></div>${yn('c-keep',st.a.keep?'yes':'no')}</div>
        <div class="bq"><div class="bq-t"><b>One-off check, or testing on every release?</b><span>Repeat work gets cheaper once we plan it for every release.</span></div>${seg('rel',st.rel,REL)}</div>
        ${st.rel!=='once'?`<div class="bq"><div class="bq-t"><b>Re-check old features every release?</b><span>What worked before must keep working. That is regression testing.</span></div>${seg('c-regress',st.a.regress,[['must','Every time'],['nice','Light pass'],['no','No']])}</div>`:''}`;
      case 2: return `
        <span class="bk">Step 3 · ${STEPS[2][1]}</span>
        <h4>How careful on security?</h4>
        <div class="bq"><div class="bq-t"><b>Common attack checks</b><span>SQL injection, weak logins, data left where anyone can read it.</span></div>${seg('sec',st.sec,[['none','Skip for now'],['basic','Basic checks'],['full','In depth']])}</div>
        <div class="bq"><div class="bq-t"><b>Full penetration testing?</b><span>A specialist tries to break in on purpose, with your written permission.</span></div>${seg('pen',st.pen?'1':'0',[[0,'Not this time'],[1,'Include it']])}</div>
        ${st.pen?`<div class="bq sub"><div class="bq-t"><b>How deep?</b></div>${seg('pl',st.penLevel,PEN_LEVEL.map((l,n)=>[n,l]))}
          <div class="bq-t" style="margin-top:14px"><b>How sensitive is your data?</b><span>How bad would it be, if this data leaked?</span></div>${seg('pd',st.penData,PEN_DATA.map((l,n)=>[n,l]))}
          <p class="bhelp" style="margin:8px 0 0">Penetration testing is its own specialist job, quoted separately. We only nudge it up when your data is sensitive${st.penData===2?' — yours is, so plan for it':''}.</p></div>`:''}
        <div class="bq"><div class="bq-t"><b>Test it under pressure?</b><span>Slow internet, many users at once, long lists.</span></div>${yn('c-speed',st.a.speed?'yes':'no')}</div>`;
      case 3: return `
        <span class="bk">Step 4 · ${STEPS[3][1]}</span>
        <h4>How deep on each feature?</h4>
        <p class="bhelp">We size the work in <b>QA points</b>. One user story is one point — however you split it into test cases. A story with a happy path, a wrong password and a no-internet case is still one story.</p>
        <div class="bq"><div class="bq-t"><b>Depth per feature</b><span>More depth means more points.</span></div>${seg('gran',st.gran,GRAN.map(g=>[g[0],g[1]]))}
          <p class="bhelp" style="margin:8px 0 0">${GRAN.find(g=>g[0]===st.gran)[2]}</p></div>
        <div class="bq"><div class="bq-t"><b>Record automation scripts too?</b><span>Every testing step saved as a script your team can re-run later.</span></div>${seg('auto',st.auto?'1':'0',[[0,'No scripts'],[1,'Yes, record scripts']])}</div>
        ${st.auto?`<div class="bq sub"><div class="bq-t"><b>About how many scripts?</b><span>Typically one per user story. We agree the list before we record anything.</span></div>${stepper('autoScripts','Scripts','Roughly one per story.',st.autoScripts,1,200)}</div>`:''}`;
      case 4: return `
        <span class="bk">Step 5 · ${STEPS[4][1]}</span>
        <h4>When, and on what?</h4>
        <div class="bq"><div class="bq-t"><b>Release date or deadline</b><span>Rough is fine. It changes how we plan the days.</span></div><input type="date" class="bta" id="bDate" value="${esc(st.date)}"></div>
        ${stepper('days','Testing days we plan for','Day 1 is plan and set-up. The last day is report and retest.',st.days,1,30)}
        ${stepper('env','Environments','Where we test: dev, staging, pre-production…',st.env,1,8)}
        ${stepper('dev','Devices & browsers','Phones, tablets and browsers on your list.',st.dev,1,20)}
        <div class="bfield" style="margin-top:12px"><span class="bl">What documents do you have?</span>
          <div class="seg multi">${DOCS.map(d=>`<button type="button" data-a="doc" data-v="${esc(d)}" class="${st.docs.includes(d)?'on':''}">${d}</button>`).join('')}</div></div>`;
      default: return `
        <span class="bk">Step 6 · ${STEPS[5][1]}</span>
        <h4>Anything to adjust?</h4>
        <p class="bhelp">This list came straight from your answers. Switch things on or off, and set how much each one matters.</p>
        <div class="bitems">${DEFS.map(d=>{
          const imp = importance(d.id), on = d.on() && imp;
          if(d.on() && !imp && d.id!=='journeys') { /* tuned off: still show, allow re-on */ }
          const show = d.on() || st.a['f_'+d.id]!==undefined;
          if(!show) return '';
          return `<div class="bit ${on?'on':''}">
            <button type="button" class="bit-t" data-a="ft" data-v="${d.id}" aria-pressed="${on?'true':'false'}"><i></i><span><b>${d.name}</b><em>${d.d}</em></span></button>
            ${on?seg('imp',imp,IMP.map(x=>[x[0],x[1]])):''}</div>`;}).join('')}</div>
        <p class="bhelp" style="margin:4px 0 0">Devices and browsers are already counted in Step 5. Penetration testing, if you picked it, is quoted separately.</p>`;
    }
  }

  /* ---------- render main ---------- */
  function render(){
    root.innerHTML = `
      <div class="bprog" role="tablist">${STEPS.map((s,n)=>{
        const cls = n===st.step?'now':(n<st.step?'done':'');
        return `<button type="button" data-a="step" data-v="${n}" class="${cls}" aria-label="Step ${n+1}: ${s[0]}"><span class="bdot"></span><span class="blab">${s[0]}</span></button>`;}).join('')}</div>
      <div class="bstep" id="bCard">${body()}</div>
      <div class="bnav">
        ${st.step>0?'<button type="button" class="bn-b" data-a="back">Back</button>':''}
        <span class="bn-l">Step ${st.step+1} of ${STEPS.length}</span>
        ${st.step<STEPS.length-1
          ?`<button type="button" class="btn btn-primary" data-a="next">Next: ${STEPS[st.step+1][0]}</button>`
          :`<button type="button" class="btn btn-primary" id="bldSend2">Send this plan</button>`}
      </div>`;
    const el = $('#bAbout'); if(el && document.activeElement===el){ el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
    renderSum();
  }

  /* ---------- summary ---------- */
  function renderSum(){
    const c = calc(), sched = schedule(c.rows), pk = suggest(c);
    const relL = REL.find(x=>x[0]===st.rel)[1];
    const extras = [];
    if(st.auto) extras.push(`<li><span>Automation scripts<small>${st.autoScripts} scripts, one per story, agreed first</small></span><i class="t-nice">+${(st.autoScripts*.5).toFixed(1).replace(/\.0$/,'')} pts</i></li>`);
    if(st.pen) extras.push(`<li><span>Penetration testing<small>${PEN_LEVEL[st.penLevel]} · ${PEN_DATA[st.penData]}</small></span><i class="t-sep">Separate</i></li>`);
    if(st.docs.includes(DOCS[4])) extras.push('<li><span>Starting from a demo<small>We plan from the working app itself</small></span><i class="t-nice">OK</i></li>');
    if(!c.rows.length && !extras.length){
      sum.innerHTML = '<div class="bs-empty">Answer a few questions, and your plan builds here.</div>';
      window.__ltabPlan = null; return;
    }
    const fit = c.team>1
      ? `${c.testerDays} tester-days in total. In ${st.days} day${st.days>1?'s':''}, that takes ${c.team} testers. Or add days.`
      : `${c.testerDays} tester-days in total. One tester can finish in ${st.days} day${st.days>1?'s':''}.`;
    const rowsHtml = c.rows.slice().sort((a,b)=>impOrder[a.imp]-impOrder[b.imp])
      .map(r=>`<li><span>${r.name}</span><i class="t-${r.imp}">${impL[r.imp]}</i></li>`).join('');
    sum.innerHTML = `
      ${c.rows.length?`<div class="bs-big"><b>~${c.qaPoints%1?(c.qaPoints.toFixed(1)):(c.qaPoints)}</b><span>QA points<small>${fit}</small></span></div>`:''}
      <div class="bs-facts"><span><b>${st.days}</b> day${st.days>1?'s':''}</span><span><b>${st.env}</b> environment${st.env>1?'s':''}</span><span><b>${st.dev}</b> device${st.dev>1?'s':''}</span><span>${relL}</span></div>
      <ul class="bs-list">${rowsHtml}${extras.join('')}</ul>
      ${c.rows.length?`<div class="bs-k">Your testing days</div><ol class="bs-sched">${sched.map((d,i)=>`<li><b>Day ${i+1}</b><span>${[...new Set(d)].join(' · ')||'&nbsp;'}</span></li>`).join('')}</ol>`:''}
      ${pk?`<div class="bs-match"><span>Closest ready-made plan</span><b>${pk}</b></div>`:''}
      ${st.about?`<div class="bs-proj"><span>Your project</span><p>${esc(st.about)}</p></div>`:''}`;
    window.__ltabPlan = {
      preset:PRESETS[st.preset].label, step:st.step+1,
      project:{about:st.about, modules:st.modules, platforms:st.platforms},
      answers:{functional:st.a.functional, apis:st.a.api==='yes'&&st.a.apiTest!=='no', e2e:st.a.e2e==='yes',
        database:st.a.db==='yes', ai:st.a.ai==='yes', speed:!!st.a.speed, keep_building:!!st.a.keep,
        frequency:relL, regression:st.a.regress||null},
      depth:{granularity:GRAN.find(g=>g[0]===st.gran)[1], automation_scripts:st.auto?st.autoScripts:0},
      security:{attacks:st.sec, penetration:st.pen?{level:PEN_LEVEL[st.penLevel], data:PEN_DATA[st.penData]}:null},
      items:c.rows.map(r=>({name:r.name, importance:impL[r.imp]})),
      timeline:{release_date:st.date||null, days:st.days, environments:st.env, devices:st.dev, documents:st.docs},
      qa_points:c.qaPoints, rough_tester_days:c.testerDays, testers:c.team, closest_package:pk||null,
      schedule: sched.map((d,i)=>`Day ${i+1}: ${[...new Set(d)].join(', ')}`),
      note:`About ${c.qaPoints%1?c.qaPoints.toFixed(1):c.qaPoints} QA points · ${c.rows.length} area${c.rows.length===1?'':'s'} · ${st.days} day${st.days>1?'s':''} · ${st.env} environment${st.env>1?'s':''} · ${st.dev} device${st.dev>1?'s':''}`
    };
  }

  /* ---------- events ---------- */
  root.addEventListener('input', e=>{
    if(e.target.id==='bAbout'){ st.about = e.target.value; renderSum(); }
    if(e.target.id==='bDate'){ st.date = e.target.value; renderSum(); }
  });
  root.addEventListener('click', e=>{
    const b = e.target.closest('button'); if(!b || b.disabled) return;
    if(b.id==='bldSend2'){ send(); return; }
    const a = b.dataset.a; if(!a) return; const v = b.dataset.v;
    switch(a){
      case 'preset': load(v); break;
      case 'step': st.step = Math.min(STEPS.length-1, Math.max(0, +v)); break;
      case 'next': st.step = Math.min(STEPS.length-1, st.step+1); break;
      case 'back': st.step = Math.max(0, st.step-1); break;
      case 'ptype': { const on = st.platforms.includes(v); st.platforms = on? st.platforms.filter(x=>x!==v) : [...st.platforms, v]; if(!st.platforms.length) st.platforms = [v]; break; }
      case 'c-functional': case 'c-db': case 'c-e2e': case 'c-ai': st.a[a.slice(2)] = v; break;
      case 'c-api': st.a.api = v; if(v!=='yes') st.a.apiTest = 'no'; break;
      case 'c-apiTest': st.a.apiTest = v; break;
      case 'c-keep': st.a.keep = v==='yes'; break;
      case 'c-speed': st.a.speed = v==='yes'; break;
      case 'c-regress': st.a.regress = v; break;
      case 'rel': st.rel = v; break;
      case 'sec': st.sec = v; break;
      case 'pen': st.pen = v==='1'; break;
      case 'pl': st.penLevel = +v; break;
      case 'pd': st.penData = +v; break;
      case 'gran': st.gran = v; break;
      case 'auto': st.auto = v==='1'; syncAutoScripts(); break;
      case 'doc': st.docs = st.docs.includes(v)? st.docs.filter(x=>x!==v) : [...st.docs, v];
        if(st.docs.includes(DOCS[4]) && st.docs.length>1) st.docs = st.docs.filter(x=>x!==DOCS[4]); break;
      case 'days': st.days = Math.min(30,Math.max(1,st.days+ +v)); break;
      case 'env': st.env = Math.min(8,Math.max(1,st.env+ +v)); break;
      case 'dev': st.dev = Math.min(20,Math.max(1,st.dev+ +v)); break;
      case 'autoScripts': st.autoScripts = Math.min(200,Math.max(1,st.autoScripts+ +v)); break;
      case 'modules': st.modules = Math.min(40,Math.max(1,st.modules+ +v)); break;
      case 'ft': { const d = DEFS.find(x=>x.id===v); const cur = d && d.on() && importance(v); st.a['f_'+v] = cur ? 'off' : 'imp'; break; }
      case 'imp': { const row = b.closest('.bit'); const id = row && row.querySelector('[data-a="ft"]')?.dataset.v; if(id) st.a['f_'+id] = v; break; }
    }
    render();
  });

  function send(){
    if(window.__ltabPlan){
      document.dispatchEvent(new CustomEvent('ltab:plan',{detail:window.__ltabPlan}));
      window.location.hash = '#start';
    }
  }
  $('#bldSend').addEventListener('click', send);
  $('#bldReset').addEventListener('click', ()=>{ load(st.preset); render(); });
  load('sprint');
  render();
})();
