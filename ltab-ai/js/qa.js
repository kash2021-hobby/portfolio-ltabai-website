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
      'We agree the product, the journeys that matter most, the devices, the timing and the price. Then we write it all down so you can see exactly what you are buying.',
      ['A short kickoff call','A written scope you approve before any testing starts','A clear price and a date'],
      ['What you are launching and when','Who uses it, and on what','Anything you already know is broken']],
    ['Prepare','Set up the lab',
      'We build the test environment: the browsers, phones and tablets your customers use, accounts for each type of user, realistic sample data, and one place to record every issue.',
      ['A test environment that mirrors the real world','Test accounts and sample data','Nothing touching your live site'],
      ['Access to a test or staging build','Permission to create test accounts','Details of who the users are']],
    ['Test','Use it like a real customer',
      'Our testers go through your product the way your customers will, and also the ways they should not: bad input, no internet, an expired card, a slow reply. Everything gets recorded with evidence.',
      ['Every issue written up with steps to repeat it','Screenshots or short recordings','Severity and impact explained in plain words'],
      ['A stable build','Someone to answer product questions','An agreed test window']],
    ['Report','Tell you clearly, in priority order',
      'You get one clear report: what was checked, what is broken, what needs fixing before launch, what can wait, and what risk is left. Your testing lead walks you through it.',
      ['A live progress board you can open any time','A prioritised issue list','A summary you can send to a client'],
      ['A short review call','A decision on what gets fixed']],
    ['Fix','Your team fixes, we stay close',
      'Your developer makes the fixes. We stay available for questions, and we do not disappear the moment the report is sent.',
      ['Fast answers on any finding','Help deciding what really must be fixed','No surprise charges for a quick question'],
      ['A new build with a note of what changed','A named person who owns the fixes']],
    ['Verify & release','Check the fixes, then decide',
      'We retest every fix, plus the nearby areas a fix might have broken. Then you get the final word on what was checked and what remains, so you can release with your eyes open.',
      ['A retest result for every issue','A final report with the remaining risk named','Your release recommendation'],
      ['The fixed build','A decision on anything you choose to accept as-is']],
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
     sub:'The document that says exactly what will be tested, how, on what, and by when. Nothing gets tested that you have not seen written down.',
     li:['The features and journeys in scope, and the ones left out','The browsers, devices and screen sizes we will use','The kinds of users and the test data we will create','What counts as a pass, and how serious each issue type is','Dates, responsibilities and how changes get handled'],
     note:'You approve it before testing starts, so there are no surprises in the invoice or the report.'},
    {t:'Live progress', n:'02', s:'Open any time while we test',
     h:'Watch the testing happen, not just the result.',
     sub:'A live board you can open whenever you like. No waiting for a phone call to find out where things stand.',
     li:['A running list of every issue found, as we find it','The current status of each one: new, confirmed, fixed, retest, accepted','A burn-down chart showing what is left to check','Daily progress against the agreed plan','Notes on anything that is blocked and why'],
     note:'Agencies often share a read-only view with their own client. Just ask.'},
    {t:'Bug reports & evidence', n:'03', s:'The core of the work',
     h:'Every issue with proof behind it.',
     sub:'A developer should be able to read one of our bug reports and reproduce the problem without asking a single question.',
     li:['Clear steps to repeat the problem, numbered','What should have happened, and what actually happened','Screenshots, and short screen recordings for anything visual or timed','The exact browser, device and version where it happened','How serious it is, and who it affects','A suggested priority, so your team knows what to fix first'],
     note:'This is the part that saves developers the most time: no hunting, no guessing, no back and forth.'},
    {t:'Final test report', n:'04', s:'At the end of the engagement',
     h:'The document you keep, and share.',
     sub:'One readable report that answers the question your client, your investor or your boss will actually ask: is this ready?',
     li:['A plain summary of the whole engagement','What was tested, and what was not','Every issue found, and its final status','What was fixed, what was accepted, and what is still open','The remaining risk, named honestly','Our release recommendation, and the decision left to you'],
     note:'Written to be read by someone who is not technical. No jargon wall.'},
    {t:'Retest report', n:'05', s:'After your fixes',
     h:'Proof that the fixes actually worked.',
     sub:'A fix is not done until someone independent has confirmed it. That is this document.',
     li:['Every reported issue, checked again on the new build','Pass or fail for each fix, with evidence','Any new problem the fix introduced','The areas near each fix that we checked as well','A clear count of what is closed and what is still open'],
     note:'Included in every package. One retest round is standard; more rounds can be added.'},
    {t:'Handover pack', n:'06', s:'Everything, at the end',
     h:'All the assets, in one place.',
     sub:'When the engagement finishes, everything we produced is handed to you. Nothing is held back and nothing is locked to us.',
     li:['The approved test plan and the final report','All screenshots, recordings and log files','Test cases and checklists we wrote','The test data we created, and how to reset it','Any automation scripts, if they were in scope','An optional short session to walk your team through it'],
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
    if(code==='US'){ $('#pkNote').textContent = 'Prices are indicative "starting from" amounts in US dollars (USD). The final quote depends on the product, the number of pages or journeys, the devices, your access, the deadline, follow-up checks and any scope changes.'; return; }
    $('#pkNote').textContent = `Prices are shown in US dollars (USD) as indicative "starting from" amounts. For ${r.name} we will send a written quote in ${CUR[code]||'your local currency'} after we have seen your product, journeys, devices, access and deadline.`;
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
    if(product.length<6){ err.textContent='Tell us briefly what you’re shipping.'; return; }
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
