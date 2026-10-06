/* Software Testing page interactions */
(function(){
  const $ = (s,el=document)=>el.querySelector(s), $$ = (s,el=document)=>[...el.querySelectorAll(s)];
  LTAB.initSubpage();

  /* ---------- release readiness panel: three sample states ---------- */
  const RR = [
    {pass:151, fail:19, block:10, alert:'1 critical issue needs attention', tone:'crit'},
    {pass:168, fail:7,  block:5,  alert:'Fixes received · 7 issues left to recheck', tone:'warn'},
    {pass:177, fail:2,  block:1,  alert:'Ready with known risks · 2 low issues accepted', tone:'pass'},
  ];
  const total = 180;
  function setRR(k){
    const s = RR[k];
    ['pass','fail','block'].forEach(key=>{
      const el = $(`[data-n="${key}"]`), from = +el.textContent, to = s[key], t0 = performance.now();
      (function step(now){ const p=Math.min(1,(now-t0)/900); el.textContent = Math.round(from+(to-from)*(1-Math.pow(1-p,3))); if(p<1) requestAnimationFrame(step); })(t0);
      $(`[data-b="${key}"]`).style.width = (to/total*100)+'%';
    });
    const a = $('#rrAlert'); a.querySelector('span:last-child').textContent = s.alert;
    const c = {crit:['rgba(220,38,38,.12)','#fca5a5','var(--crit)'], warn:['rgba(245,158,11,.12)','#fcd34d','var(--warn)'], pass:['rgba(22,163,74,.12)','#86efac','var(--pass)']}[s.tone];
    a.style.background=c[0]; a.style.color=c[1]; a.querySelector('.d').style.background=c[2];
    $$('#rrTabs button').forEach((b,i)=>b.classList.toggle('on', i===k));
  }
  $('#rrTabs').addEventListener('click', e=>{ const b=e.target.closest('button'); if(b){ setRR(+b.dataset.k); auto=false; }});
  let auto = true, ak = 0;
  setTimeout(()=>setRR(0), 300);
  setInterval(()=>{ if(!auto) return; ak=(ak+1)%3; setRR(ak); }, 3600);

  /* ---------- testing life cycle stepper (6 steps) ---------- */
  const PROC = [
    ['Plan','Decide what gets tested',
      'We agree what to test, on which devices, by when, and for what price. Then we write it all down — so you see exactly what you are buying.',
      ['A short kickoff call','A written plan you approve first','A clear price and a date'],
      ['What you are launching, and when','Who uses it, and on what','Anything you already know is broken']],
    ['Prepare','Set up the lab',
      'We set up the practice ground: your customers\u2019 browsers, phones and tablets, test accounts, safe sample data, and one log for every issue.',
      ['A test set-up like the real world','Test accounts and sample data','Your live site stays untouched'],
      ['A test link to your app','A yes to creating test accounts','Who the users are']],
    ['Test','Use it like a real customer',
      'We use it like your best customer. Then like your worst: wrong input, no internet, an expired card. Every problem is written down with proof.',
      ['Each bug with steps to repeat it','Screenshots or short recordings','How bad it is, in plain words'],
      ['A stable build','Someone to answer questions','A test window we agree on']],
    ['Report','You get the report',
      'One clear report: what we checked, what is broken, what to fix before launch, what can wait. Your testing lead walks you through it.',
      ['A progress board, open any time','A fix-first priority list','A summary you can send to a client'],
      ['A short call to review','A decision on what to fix']],
    ['Fix','Your team fixes, we stay close',
      'Your team fixes. We stay close for questions. We do not vanish after the report.',
      ['Fast answers on any finding','Help deciding what to fix first','No surprise charge for a question'],
      ['A new build, with what changed','One person who owns the fixes']],
    ['Verify & release','Check the fixes, then decide',
      'We retest every fix — and the parts that touch it. You get the final list: what is fixed, what is left. Then you release with open eyes.',
      ['A pass or fail for every fix','The final report: what risk is left','Our release recommendation'],
      ['The fixed build','Your “accept as-is” list, if any']],
  ];
  const proc = $('#proc'), panel = $('#procPanel');
  proc.innerHTML = PROC.map((p,i)=>`<button data-i="${i}"><span>0${i+1}</span>${p[0]}</button>`).join('');
  let pi = 0, pAuto = true;
  function setProc(i){
    pi = i;
    $$('button', proc).forEach((b,k)=>{ b.classList.toggle('on', k===i); b.classList.toggle('done', k<i); });
    const p = PROC[i];
    panel.innerHTML = `<div class="card fade"><span class="k">Step 0${i+1} · ${p[0]}</span><h4>${p[1]}</h4><p class="muted">${p[2]}</p></div>
      <div class="card fade"><span class="k">What you receive</span><ul>${p[3].map(x=>`<li>${x}</li>`).join('')}</ul>
      <span class="k" style="display:block;margin-top:24px">What we need from you</span><ul>${p[4].map(x=>`<li>${x}</li>`).join('')}</ul></div>`;
  }
  proc.addEventListener('click', e=>{ const b=e.target.closest('button'); if(b){ pAuto=false; setProc(+b.dataset.i); }});
  setProc(0);
  let procVisible = false;
  const procIO = new IntersectionObserver(es=>es.forEach(e=>{ procVisible = e.isIntersecting; }), {threshold:.3});
  procIO.observe($('#proc'));
  setInterval(()=>{ if(pAuto && procVisible) setProc((pi+1)%PROC.length); }, 3400);

  /* ---------- what you receive (deliverables) ---------- */
  const DEL = [
    {t:'Test plan', n:'01', s:'Agreed before we start',
     h:'A written plan you approve first.',
     sub:'What gets tested, how, when. Nothing gets tested that you have not seen written down.',
     li:['What\u2019s in — and what\u2019s out','The phones, browsers and screens we\u2019ll use','The test users and test data we\u2019ll create','What counts as "pass" — and how bad each problem can be','Dates, duties, and how changes are handled'],
     note:'You approve it first. No surprise in the invoice or the report.'},
    {t:'Live progress', n:'02', s:'Open any time while we test',
     h:'Watch the testing happen, not just the result.',
     sub:'A live board you can open any time. No waiting for a call to know what\u2019s happening.',
     li:['Every issue lands here as we find it','Status for each one: new, confirmed, fixed, retest, accepted','A chart of what\u2019s left to check','Daily progress against the plan','What\u2019s blocked, and why'],
     note:'Agencies often share a read-only view with their own client. Just ask.'},
    {t:'Bug reports & evidence', n:'03', s:'The core of the work',
     h:'Every issue with proof behind it.',
     sub:'Your developer reads the report and repeats the bug. No questions needed.',
     li:['Numbered steps that repeat the bug','What should happen vs what happens','Screenshots and short recordings','The exact browser and device it hit','How serious it is, and who it hits','A priority, so your team fixes the right things first'],
     note:'No hunting. No guessing. No back-and-forth. This is the part that saves your developer hours.'},
    {t:'Final test report', n:'04', s:'At the end of the work',
     h:'The document you keep, and share.',
     sub:'One short report that answers the big question: is this ready to ship?',
     li:['A plain summary, start to finish','What we tested — and what we didn\u2019t','Every issue and its final status','Fixed, accepted, still open','The risk that remains, named honestly','Our recommendation; the decision stays yours'],
     note:'Written to be read by someone who is not technical. No jargon wall.'},
    {t:'Retest report', n:'05', s:'After your fixes',
     h:'Proof that the fixes actually worked.',
     sub:'A fix isn\u2019t done until someone independent says so. That someone is us.',
     li:['Every issue, rechecked on the new build','Pass or fail for each fix, with proof','New problems the fix might have caused','The areas near the fix, also checked','What\u2019s closed, what\u2019s open — counted'],
     note:'Included in every package. One retest round is standard; more rounds can be added.'},
    {t:'Handover pack', n:'06', s:'Everything, at the end',
     h:'All the assets, in one place.',
     sub:'When we finish, everything is yours. Nothing held back, nothing locked to us.',
     li:['The test plan and the final report','Every screenshot, recording and log','The test cases we wrote','The test data, and how to reset it','Automation scripts, if they were in scope','A short walk-through for your team, if you want it'],
     note:'Yours to keep and reuse. If you come back for a later release, we start from what we already know.'},
  ];
  const list = $('#repList'), det = $('#repDetail');
  list.innerHTML = DEL.map((r,i)=>`<button class="rep-item" data-i="${i}"><div><span class="n">${r.n}</span><b>${r.t}</b><small>${r.s}</small></div><span class="tap" aria-hidden="true">→</span></button>`).join('');
  function setRep(i){
    $$('.rep-item').forEach((b,k)=>b.classList.toggle('on', k===i));
    const r = DEL[i];
    det.innerHTML = `<div class="fade">
      <span class="sev ok">${r.n}</span>
      <h4>${r.h}</h4>
      <p class="sub">${r.sub}</p>
      <ul class="del">${r.li.map(x=>`<li>${x}</li>`).join('')}</ul>
      <p class="dnote">${r.note}</p></div>`;
  }
  list.addEventListener('click', e=>{ const b=e.target.closest('.rep-item'); if(b) setRep(+b.dataset.i); });
  setRep(0);

  /* ---------- region-aware pricing note (USD base) ---------- */
  const CUR = {US:'USD',CA:'CAD',UK:'GBP or EUR',AE:'AED',SG:'SGD',MY:'MYR',AU:'AUD',NZ:'NZD'};
  function pkNote(code){
    const r = LTAB.REGIONS.find(x=>x.code===code) || LTAB.REGIONS[0];
    if(code==='US'){ $('#pkNote').textContent = 'Every package has a fixed scope and a fixed timeline. The final price depends on the app, the journeys, the devices, your access and the deadline — all of it confirmed in the proposal before anything starts.'; return; }
    $('#pkNote').textContent = `Every package has a fixed scope and a fixed timeline. For ${r.name} we quote in ${CUR[code]||'your local currency'} after we see your product, journeys, devices, access and deadline — all confirmed in the proposal before anything starts.`;
  }
  document.addEventListener('ltab:region', e=>pkNote(e.detail)); pkNote(LTAB.guessRegion());

  /* ---------- country select + phone field ---------- */
  const cs = $('#qCountry');
  cs.innerHTML = '<option value="">Country</option>' + LTAB.DIAL.map(d=>`<option value="${d[0]}" data-dial="${d[2]}">${d[1]} (${d[2]})</option>`).join('');
  const phone = LTAB.mountPhone($('#qPhone'));
  cs.addEventListener('change', ()=>{ const o = cs.selectedOptions[0]; if(o && o.dataset.dial){ const d = LTAB.DIAL.find(x=>x[2]===o.dataset.dial && x[0]===o.value); if(d){ phone.setDial(d); } } });

  /* ---------- intake form ---------- */
  const form = $('#qaForm'), err = $('#qErr');
  const state = {focus:[], platform:[], services:[], package:'', start:'', access:''};
  $$('[data-group]', form).forEach(grp=>{
    const key = grp.dataset.group, single = grp.hasAttribute('data-single');
    grp.addEventListener('click', e=>{ const c=e.target.closest('.chip'); if(!c) return; const v=c.textContent;
      if(single){ state[key] = state[key]===v ? '' : v; $$('.chip',grp).forEach(x=>x.classList.toggle('on', x.textContent===state[key])); }
      else { state[key] = state[key].includes(v) ? state[key].filter(x=>x!==v) : [...state[key], v]; c.classList.toggle('on'); } });
  });
  $$('[data-pkg]').forEach(a=>a.addEventListener('click', ()=>{ state.package = a.dataset.pkg; $$('[data-group="package"] .chip').forEach(x=>x.classList.toggle('on', x.textContent===state.package)); }));
  const CRM_ENDPOINT = ''; // ← your CRM webhook
  form.addEventListener('submit', async e=>{
    e.preventDefault(); err.textContent='';
    const name=$('#qName').value.trim(), email=$('#qEmail').value.trim(), product=$('#qProduct').value.trim(), pv=phone.phoneValue();
    if(product.length<6){ err.textContent='Tell us briefly what you\u2019re shipping.'; return; }
    if(!name){ err.textContent='What should we call you?'; return; }
    if(!/^\S+@\S+\.\S+$/.test(email)){ err.textContent='We need a valid email to reply.'; return; }
    if(pv.number && pv.number.replace(/\D/g,'').length<6){ err.textContent='That phone number looks short.'; return; }
    const payload = {
      type:'qa_assessment', product, focus:state.focus, platform:state.platform, stack:$('#qStack').value.trim(),
      services:state.services, package:state.package, start:state.start, access:state.access,
      release_date:$('#qDate').value, name, email, role:$('#qRole').value.trim(), company:$('#qCompany').value.trim(),
      country: cs.value || pv.country, phone:pv.e164, phone_country:pv.country, phone_dial:pv.dial,
      region:localStorage.getItem('ltab-region')||'', source:'ltab.ai/software-testing', submitted_at:new Date().toISOString()
    };
    if(CRM_ENDPOINT){ try{ await fetch(CRM_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}); }catch(_){} }
    else console.info('[LTAB QA] lead payload (connect CRM_ENDPOINT):', payload);
    $('#qDoneName').textContent = name.split(' ')[0]; $('#intake').classList.add('sent');
  });
})();
