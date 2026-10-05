/* LTAB AI — page interactions */
(function(){
  const $ = (s,el=document)=>el.querySelector(s), $$ = (s,el=document)=>[...el.querySelectorAll(s)];
  const S = ()=>window.LTAB3D || {setState(){},pulse(){},snap(){}};
  const ARROW = '<svg class="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  $$('[data-arr]').forEach(b=>b.insertAdjacentHTML('beforeend', ARROW));

  /* ---------- regions ---------- */
  const REGIONS = [
    {code:'US', name:'United States', cur:'USD', tz:'America/New_York', overlap:'Morning overlap · EST/PST'},
    {code:'CA', name:'Canada',        cur:'CAD', tz:'America/Toronto', overlap:'Morning overlap · ET/PT'},
    {code:'UK', name:'Europe & UK',   cur:'EUR · GBP', tz:'Europe/London', overlap:'4–5 hr overlap · GDPR-ready'},
    {code:'AE', name:'UAE',           cur:'AED', tz:'Asia/Dubai', overlap:'Same working day · 1.5 hr apart'},
    {code:'SG', name:'Singapore',     cur:'SGD', tz:'Asia/Singapore', overlap:'Same working day · 2.5 hr ahead'},
    {code:'MY', name:'Malaysia',      cur:'MYR', tz:'Asia/Kuala_Lumpur', overlap:'Same working day · 2.5 hr ahead'},
    {code:'AU', name:'Australia',     cur:'AUD', tz:'Australia/Sydney', overlap:'Your afternoon = our morning'},
    {code:'NZ', name:'New Zealand',   cur:'NZD', tz:'Pacific/Auckland', overlap:'Your afternoon = our morning'},
  ];
  function guessRegion(){
    const saved = localStorage.getItem('ltab-region'); if(saved) return saved;
    const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone||'');
    if(tz.startsWith('Europe')) return 'UK';
    if(tz.startsWith('Australia')) return 'AU';
    if(tz.includes('Auckland')) return 'NZ';
    if(tz.includes('Dubai')) return 'AE';
    if(tz.includes('Singapore')) return 'SG';
    if(tz.includes('Kuala')) return 'MY';
    if(tz.includes('Toronto')||tz.includes('Vancouver')) return 'CA';
    return 'US';
  }
  let region = guessRegion();
  const menu = $('#regionMenu');
  menu.innerHTML = REGIONS.map(r=>`<button data-r="${r.code}">${r.name}<span>${r.cur}</span></button>`).join('');
  const mkWrap = $('#markets');
  mkWrap.innerHTML = REGIONS.map(r=>`<button class="mk" data-r="${r.code}">
      <div class="top"><span class="code">${r.code}</span><span class="time" data-clock="${r.tz}">--:--</span></div>
      <div><div class="name">${r.name}</div><div class="time" style="margin-top:6px">${r.overlap}</div></div></button>`).join('')
    + `<div class="mk hub"><div><div class="name">Engineering hub · India</div><div class="time" style="margin-top:6px">Senior engineers, testers, designers & AI video team</div></div><span class="time" data-clock="Asia/Kolkata">--:--</span></div>`;
  function setRegion(code){
    region = code; localStorage.setItem('ltab-region', code);
    const r = REGIONS.find(x=>x.code===code);
    $('#regionLbl').textContent = r.code;
    $('#heroRegion').textContent = r.name;
    $('#labRegionHint').textContent = `Detected: ${r.name}`;
    $$('#regionMenu button').forEach(b=>b.classList.toggle('on', b.dataset.r===code));
    $$('#markets .mk[data-r]').forEach(b=>b.classList.toggle('on', b.dataset.r===code));
    $$('#chipsRegion .chip').forEach(b=>b.classList.toggle('on', b.dataset.v===r.name));
    lead.region = r.name;
    const pe = document.getElementById('fPhone'); if(pe && pe.setRegion) pe.setRegion(code);
  }
  $('#regionBtn').addEventListener('click', e=>{ e.stopPropagation(); menu.classList.toggle('open'); });
  document.addEventListener('click', ()=>menu.classList.remove('open'));
  menu.addEventListener('click', e=>{ const b=e.target.closest('button'); if(b){ setRegion(b.dataset.r); menu.classList.remove('open'); }});
  mkWrap.addEventListener('click', e=>{ const b=e.target.closest('.mk[data-r]'); if(b){ setRegion(b.dataset.r); S().pulse(.4);} });
  function tick(){
    $$('[data-clock]').forEach(el=>{
      try{ el.textContent = new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:el.dataset.clock}); }catch(e){}
    });
  }
  tick(); setInterval(tick, 20000);

  /* ---------- header ---------- */
  const hdr = $('.hdr'); let lastY = 0;
  addEventListener('scroll', ()=>{
    const y = scrollY;
    hdr.classList.toggle('solid', y>40);
    hdr.classList.toggle('hide', y>lastY && y>400 && !$('.mmenu').classList.contains('open'));
    lastY = y;
  }, {passive:true});
  $('.burger').addEventListener('click', ()=>$('.mmenu').classList.add('open'));
  $$('.mmenu a, .mmenu .close').forEach(a=>a.addEventListener('click', ()=>$('.mmenu').classList.remove('open')));

  /* ---------- section → 3D state + theme ---------- */
  const zones = $$('[data-scene]');
  function updateZones(){
    const mid = innerHeight*0.5;
    let active = null;
    for(const z of zones){
      const r = z.getBoundingClientRect();
      if(r.top <= mid && r.bottom >= mid){ active = z; }
    }
    if(!active) return;
    let st = active.dataset.scene;
    if(st==='freedoms'){ st = 'fr'+frIndex; }
    if(st==='lab' && lead.sent) st = 'labdone';
    S().setState(st);
    document.body.dataset.theme = active.dataset.theme || 'light';
  }

  /* manifesto word reveal */
  const man = $('.manifesto p');
  const parts = [];
  man.childNodes.forEach(n=>{
    const accent = n.nodeType===1;
    (n.textContent||'').split(/\s+/).filter(Boolean).forEach(w=>parts.push({w, accent}));
  });
  man.innerHTML = parts.map(p=>`<span class="w${p.accent?' o':''}">${p.w}</span>`).join(' ');
  const words = $$('.manifesto .w');

  /* freedoms pinned scroll */
  const fr = $('.freedoms'); let frIndex = 0;
  const frItems = $$('.fr-item'), frSteps = $$('.fr-steps button'), frNum = $('.fr-num span');
  function setFr(i){
    if(i===frIndex && frItems[i].classList.contains('on')) return;
    frIndex = i;
    frItems.forEach((el,k)=>el.classList.toggle('on', k===i));
    frSteps.forEach((el,k)=>el.classList.toggle('on', k===i));
    frNum.style.transform = `translateY(${-i*100}%)`;
    S().pulse(.35);
  }
  frSteps.forEach((b,i)=>b.addEventListener('click', ()=>{
    const top = fr.offsetTop + (fr.offsetHeight - innerHeight) * ((i+.5)/4);
    scrollTo({top, behavior:'smooth'});
  }));
  setFr(0);

  /* path progress */
  const pathSec = $('#path'), pathFill = $('.path-line i'), steps = $$('.step');

  function onScroll(){
    // manifesto
    const mr = $('.manifesto').getBoundingClientRect();
    const mp = Math.min(1, Math.max(0, (innerHeight*.75 - mr.top) / (mr.height*.75)));
    const n = Math.round(mp*words.length);
    words.forEach((w,i)=>w.classList.toggle('on', i<n));
    // freedoms
    const fr_r = fr.getBoundingClientRect();
    const fp = Math.min(.999, Math.max(0, -fr_r.top / (fr_r.height - innerHeight)));
    setFr(Math.floor(fp*4));
    // path
    const pr = pathSec.getBoundingClientRect();
    const pp = Math.min(1, Math.max(0, (innerHeight*.7 - pr.top) / (pr.height*.7)));
    pathFill.style.width = (pp*100)+'%'; pathFill.style.setProperty('--h', (pp*100)+'%');
    steps.forEach((s,i)=>s.classList.toggle('on', pp >= i/(steps.length-1)*0.92));
    updateZones();
  }
  addEventListener('scroll', onScroll, {passive:true});
  addEventListener('resize', onScroll);

  /* reveal on view */
  const io = new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} }), {threshold:.15});
  $$('.rv').forEach(el=>io.observe(el));
  // shared safety net: reveals in-viewport content even if the observer never
  // reports (frozen or hidden document)
  if(window.LTAB && LTAB.sweepReveal) LTAB.sweepReveal();

  /* count-up */
  const cio = new IntersectionObserver(es=>es.forEach(e=>{
    if(!e.isIntersecting) return; cio.unobserve(e.target);
    const el = e.target, to = +el.dataset.count, t0 = performance.now();
    (function step(now){ const p = Math.min(1,(now-t0)/1400), v = Math.round(to*(1-Math.pow(1-p,3)));
      el.firstChild.nodeValue = v; if(p<1) requestAnimationFrame(step); })(t0);
  }), {threshold:.4});
  $$('[data-count]').forEach(el=>cio.observe(el));

  /* ---------- services tabs ---------- */
  const SERVICES = {
    build:{line:'Software shaped around how you actually work.', items:[
      ['Custom Applications','Web and mobile apps built for your workflow, not squeezed into someone else’s.'],
      ['AI Agents & AI-Powered Apps','Agentic AI that reads, decides and acts inside your tools and processes.'],
      ['Business Automation','Replace the copy-paste and the chasing. Workflows that run themselves.'],
      ['Custom Websites','High-performance, interactive sites with no template underneath.'],
      ['E-commerce','Stores and commerce apps designed around your products and customers.'],
    ]},
    grow:{line:'A brand people remember, AI content people play with, and campaigns that pay back.', items:[
      ['Branding','Identity, logo and full brand systems, from first sketch to guidelines.'],
      ['AI Digital Marketing & Ads','Performance campaigns planned, created and optimised with AI, measured on real revenue.'],
      ['AI Video Production','Brand films, ads, product videos and social content, produced with AI at a fraction of the usual time.'],
      ['Interactive AI Videos','Videos viewers can talk to, choose a path in, or shop from. AI presenters, branching stories, personalised messages.'],
      ['Interactive AI Content','Quizzes, configurators, AI assistants and playful campaign microsites that respond to each visitor.'],
    ]},
    assure:{line:'Find website and app problems before your customers do.', items:[
      ['Software Testing / QA','Independent human testing of your website or app before launch or a major update, with a clear report your developer can act on.', 'Software Testing.html'],
      ['QA for Developers & Freelancers','Built something for a client? Get a second set of eyes before handoff. White-label available.', 'Software Testing.html#packages'],
    ]},
  };
  const grid = $('#svcGrid'), lineEl = $('#svcLine');
  let pillar = 'build';
  function renderSvc(){
    const p = SERVICES[pillar];
    lineEl.textContent = p.line;
    grid.innerHTML = p.items.map((s,i)=>`<a href="${s[2]||'#lab'}" class="svc" data-svc="${s[0]}" style="animation-delay:${i*60}ms">
      <span class="go">${ARROW}</span>
      <div><span class="idx">${pillar.toUpperCase()} / 0${i+1}</span><h3>${s[0]}</h3></div><p>${s[1]}</p></a>`).join('')
      + `<a href="#lab" class="svc wide" data-svc="Everything" style="animation-delay:${p.items.length*60}ms"><span class="go">${ARROW}</span>
        <div><span class="idx" style="color:var(--orange)">END-TO-END</span><h3>Idea → Business</h3></div>
        <p>Brand, product, launch and marketing with one team. For founders who want a single partner from first idea to first customers.</p></a>`;
    $$('#svcTabs button').forEach(b=>b.classList.toggle('on', b.dataset.p===pillar));
  }
  $('#svcTabs').addEventListener('click', e=>{ const b=e.target.closest('button'); if(!b) return; pillar=b.dataset.p; renderSvc(); S().pulse(.3); });
  grid.addEventListener('click', e=>{ const a=e.target.closest('.svc'); if(!a) return; preselect(a.dataset.svc); });
  renderSvc();

  /* ---------- two paths ---------- */
  const PATHS = [
    {h:'You have an idea. We’ll help you turn it into a business.', steps:[
      'A free call where you explain it in your own words. No jargon, and nothing you need to prepare.',
      'We draw it with you: screens, flows, and what to automate from day one.',
      'Brand, product and launch from one team, at a price that works for a first business.',
      'You own everything we build. Code, design, accounts.']},
    {h:'Your business works. We’ll make it run on AI.', steps:[
      'We map where the hours go: the manual steps, the spreadsheets, the copy-paste.',
      'We plan AI agents and automations around your current process, not a new one.',
      'We connect them to the CRM, ERP and tools you already use. No forced migration.',
      'We measure it in hours saved and costs cut, and keep improving every month.']},
  ];
  const sw = $('#switch'), pc = $('#pathCard');
  function renderPath(i){
    sw.dataset.v = i;
    $$('#switch button').forEach((b,k)=>b.classList.toggle('on', k===i));
    const p = PATHS[i];
    pc.innerHTML = `<div class="fade-swap"><h3>${p.h}</h3><ol>${p.steps.map((s,k)=>`<li><b>0${k+1}</b><span>${s}</span></li>`).join('')}</ol>
      <a href="#lab" class="btn btn-primary" data-stage="${i?'Established business':'Just an idea'}">${i?'Plan my AI upgrade':'Start with my idea'}${ARROW}</a></div>`;
  }
  $$('#switch button').forEach((b,i)=>b.addEventListener('click', ()=>{ renderPath(i); S().pulse(.3); }));
  pc.addEventListener('click', e=>{ const a=e.target.closest('[data-stage]'); if(a){ lead.stage=a.dataset.stage; syncChips(); }});
  renderPath(0);

  /* ---------- QA bug hunt ---------- */
  const BUGS = [[18,22],[72,16],[40,48],[84,62],[26,78],[62,84]];
  const mock = $('#mock'), bugCount = $('#bugCount'), bugDone = $('#bugDone');
  let found = 0;
  function layBugs(){
    found = 0; bugCount.textContent = `${BUGS.length} issues found`;
    $$('.bug', mock).forEach(b=>b.remove()); bugDone.classList.remove('on');
    BUGS.forEach(([x,y])=>{
      const b = document.createElement('button'); b.className='bug'; b.style.left=x+'%'; b.style.top=y+'%'; b.setAttribute('aria-label','Fix bug');
      b.addEventListener('click', ()=>{
        if(b.classList.contains('found')) return; b.classList.add('found'); found++;
        const left = BUGS.length-found;
        bugCount.textContent = left ? `${left} issue${left>1?'s':''} left` : 'All clear';
        S().pulse(.15);
        if(!left) setTimeout(()=>bugDone.classList.add('on'), 450);
      });
      mock.appendChild(b);
    });
  }
  $('#bugReset').addEventListener('click', layBugs);
  layBugs();

  /* ---------- Freedom Lab (lead form → your CRM) ---------- */
  const lead = {idea:'', needs:[], region:'', stage:'', timeline:'', budget:'', name:'', email:'', phone:'', sent:false};
  const NEEDS = ['Custom app','AI agents','Automation','Website','E-commerce','Branding','Marketing & ads','AI video','Interactive AI','Testing / QA','Everything'];
  const STAGES = ['Just an idea','Starting a business','Established business','Developer / freelancer'];
  const TIMES = ['ASAP','1–3 months','3–6 months','Just exploring'];
  const BUDGETS = ['Under $5k','$5k–15k','$15k–50k','$50k+','Not sure yet'];
  const chip = (v, group)=>`<button type="button" class="chip" data-g="${group}" data-v="${v}">${v}</button>`;
  $('#chipsNeeds').innerHTML = NEEDS.map(v=>chip(v,'needs')).join('');
  $('#chipsRegion').innerHTML = REGIONS.map(r=>chip(r.name,'region')).join('');
  $('#chipsStage').innerHTML = STAGES.map(v=>chip(v,'stage')).join('');
  $('#chipsTime').innerHTML = TIMES.map(v=>chip(v,'timeline')).join('');
  $('#chipsBudget').innerHTML = BUDGETS.map(v=>chip(v,'budget')).join('');
  function syncChips(){
    $$('.lab .chip').forEach(c=>{
      const g=c.dataset.g, v=c.dataset.v;
      c.classList.toggle('on', g==='needs' ? lead.needs.includes(v) : lead[g]===v);
    });
  }
  $('.lab').addEventListener('click', e=>{
    const c = e.target.closest('.chip'); if(!c) return;
    const g=c.dataset.g, v=c.dataset.v;
    if(g==='needs'){ lead.needs = lead.needs.includes(v) ? lead.needs.filter(x=>x!==v) : [...lead.needs, v]; }
    else lead[g] = lead[g]===v ? '' : v;
    syncChips(); S().pulse(.12);
  });
  const MAP = {'Custom Applications':'Custom app','AI Agents & AI-Powered Apps':'AI agents','Business Automation':'Automation','Custom Websites':'Website',
    'E-commerce':'E-commerce','Branding':'Branding','Digital Marketing & Ads':'Marketing & ads','AI Video Production':'AI video',
    'Software Testing / QA':'Testing / QA','QA for Developers & Freelancers':'Testing / QA','Everything':'Everything',
    'AI Digital Marketing & Ads':'Marketing & ads','Interactive AI Videos':'Interactive AI','Interactive AI Content':'Interactive AI'};
  function preselect(name){
    const v = MAP[name]; if(v && !lead.needs.includes(v)) lead.needs.push(v);
    if(name==='QA for Developers & Freelancers') lead.stage='Developer / freelancer';
    syncChips();
  }
  $$('[data-pre]').forEach(a=>a.addEventListener('click', ()=>preselect(a.dataset.pre)));

  const phoneEl = window.LTAB.mountPhone($('#fPhone'));
  const stepsEl = $$('.lab-step'), prog = $$('.lab-prog i');
  let si = +(localStorage.getItem('ltab-lab-step')||0); if(si>=stepsEl.length-1) si=0;
  const ideaEl = $('#idea'), err = $('#labErr');
  ideaEl.addEventListener('input', ()=>{ lead.idea = ideaEl.value; S().pulse(.05); });
  function showStep(i){
    si = i; localStorage.setItem('ltab-lab-step', i);
    stepsEl.forEach((s,k)=>s.classList.toggle('on', k===i));
    prog.forEach((p,k)=>p.classList.toggle('on', k<=i));
    $('#labBack').hidden = i===0 || i===stepsEl.length-1;
    $('#labNext').style.display = i===stepsEl.length-1 ? 'none' : '';
    $('#labNext').firstChild.nodeValue = i===stepsEl.length-2 ? 'Send my idea ' : 'Continue ';
    $('.lab-nav').style.display = i===stepsEl.length-1 ? 'none' : '';
    err.textContent='';
    if(i===stepsEl.length-2) renderSummary();
  }
  function renderSummary(){
    const rows = [['Idea', lead.idea ? (lead.idea.length>60? lead.idea.slice(0,60)+'…' : lead.idea) : '—'],
      ['Needs', lead.needs.join(', ')||'—'],['Region', lead.region||'—'],['Stage', lead.stage||'—'],
      ['Timeline', lead.timeline||'—'],['Budget', lead.budget||'—']];
    $('#summary').innerHTML = rows.map(r=>`<div><span>${r[0]}</span><b style="text-align:right">${r[1]}</b></div>`).join('');
  }
  function validate(i){
    if(i===0 && lead.idea.trim().length<8){ err.textContent='Tell us a little more. One sentence is enough.'; return false; }
    if(i===1 && !lead.needs.length){ err.textContent='Pick at least one, or choose “Everything”.'; return false; }
    if(i===stepsEl.length-2){
      lead.name = $('#fName').value.trim(); lead.email = $('#fEmail').value.trim();
      const pv = phoneEl.phoneValue(); lead.phone = pv.e164; lead.phone_country = pv.country; lead.phone_dial = pv.dial;
      if(pv.number && pv.number.replace(/\D/g,'').length < 6){ err.textContent='That phone number looks short. Check it, or leave it empty.'; return false; }
      if(!lead.name){ err.textContent='What should we call you?'; return false; }
      if(!/^\S+@\S+\.\S+$/.test(lead.email)){ err.textContent='We need a valid email to reply.'; return false; }
    }
    return true;
  }
  $('#labNext').addEventListener('click', async ()=>{
    if(!validate(si)) return;
    if(si===stepsEl.length-2){ await submitLead(); }
    showStep(si+1); S().pulse(.3);
  });
  $('#labBack').addEventListener('click', ()=>showStep(Math.max(0,si-1)));
  $('#labAgain').addEventListener('click', ()=>{ lead.sent=false; ideaEl.value=''; Object.assign(lead,{idea:'',needs:[],stage:'',timeline:'',budget:''}); syncChips(); showStep(0); updateZones(); });

  /* CRM hook: replace CRM_ENDPOINT with your CRM webhook URL */
  const CRM_ENDPOINT = '';
  async function submitLead(){
    const params = new URLSearchParams(location.search);
    const payload = {...lead, sent:undefined, source:'ltab.ai/home#lab', utm_source:params.get('utm_source')||'', utm_campaign:params.get('utm_campaign')||'', submitted_at:new Date().toISOString()};
    if(CRM_ENDPOINT){
      try{ await fetch(CRM_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}); }catch(e){}
    } else { console.info('[LTAB] lead payload (connect CRM_ENDPOINT):', payload); }
    lead.sent = true; $('#doneName').textContent = lead.name.split(' ')[0];
    S().snap();
  }
  showStep(si);
  syncChips();

  /* hero quick input → lab */
  $('#ctaForm').addEventListener('submit', e=>{
    e.preventDefault(); const v = $('#ctaIdea').value.trim();
    if(v){ lead.idea = v; ideaEl.value = v; showStep(1); }
    scrollTo({top: $('#lab').offsetTop - 40, behavior:'smooth'});
  });

  setRegion(region);
  onScroll();
})();
