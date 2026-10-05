/* LTAB AI — shared bits: regions, country-code phone field, subpage header */
(function(){
  const $ = (s,el=document)=>el.querySelector(s), $$ = (s,el=document)=>[...el.querySelectorAll(s)];

  const REGIONS = [
    {code:'US', name:'United States', cur:'USD', tz:'America/New_York', overlap:'Morning overlap · EST/PST', iso:'US'},
    {code:'CA', name:'Canada',        cur:'CAD', tz:'America/Toronto', overlap:'Morning overlap · ET/PT', iso:'CA'},
    {code:'UK', name:'Europe & UK',   cur:'EUR · GBP', tz:'Europe/London', overlap:'4–5 hr overlap · GDPR-ready', iso:'GB'},
    {code:'AE', name:'UAE',           cur:'AED', tz:'Asia/Dubai', overlap:'Same working day · 1.5 hr apart', iso:'AE'},
    {code:'SG', name:'Singapore',     cur:'SGD', tz:'Asia/Singapore', overlap:'Same working day · 2.5 hr ahead', iso:'SG'},
    {code:'MY', name:'Malaysia',      cur:'MYR', tz:'Asia/Kuala_Lumpur', overlap:'Same working day · 2.5 hr ahead', iso:'MY'},
    {code:'AU', name:'Australia',     cur:'AUD', tz:'Australia/Sydney', overlap:'Your afternoon = our morning', iso:'AU'},
    {code:'NZ', name:'New Zealand',   cur:'NZD', tz:'Pacific/Auckland', overlap:'Your afternoon = our morning', iso:'NZ'},
  ];

  /* priority markets first, then the rest A–Z */
  const DIAL = [
    ['US','United States','+1'],['CA','Canada','+1'],['GB','United Kingdom','+44'],['AE','United Arab Emirates','+971'],
    ['SG','Singapore','+65'],['MY','Malaysia','+60'],['AU','Australia','+61'],['NZ','New Zealand','+64'],
    ['DE','Germany','+49'],['FR','France','+33'],['NL','Netherlands','+31'],['IE','Ireland','+353'],['ES','Spain','+34'],
    ['IT','Italy','+39'],['PT','Portugal','+351'],['BE','Belgium','+32'],['CH','Switzerland','+41'],['AT','Austria','+43'],
    ['SE','Sweden','+46'],['NO','Norway','+47'],['DK','Denmark','+45'],['FI','Finland','+358'],['PL','Poland','+48'],
    ['CZ','Czechia','+420'],['GR','Greece','+30'],['LU','Luxembourg','+352'],['RO','Romania','+40'],['HU','Hungary','+36'],
    ['SA','Saudi Arabia','+966'],['QA','Qatar','+974'],['KW','Kuwait','+965'],['BH','Bahrain','+973'],['OM','Oman','+968'],
    ['IN','India','+91'],['HK','Hong Kong','+852'],['JP','Japan','+81'],['KR','South Korea','+82'],['ID','Indonesia','+62'],
    ['TH','Thailand','+66'],['PH','Philippines','+63'],['VN','Vietnam','+84'],['ZA','South Africa','+27'],['NG','Nigeria','+234'],
    ['KE','Kenya','+254'],['EG','Egypt','+20'],['IL','Israel','+972'],['TR','Türkiye','+90'],['MX','Mexico','+52'],
    ['BR','Brazil','+55'],['AR','Argentina','+54'],['CL','Chile','+56'],['CO','Colombia','+57'],['PK','Pakistan','+92'],
    ['BD','Bangladesh','+880'],['LK','Sri Lanka','+94'],['NP','Nepal','+977'],
  ];

  /* ---------- animation-clock guard (runs on every page) ----------
     Some embedded previews and headless renderers run with the document timeline
     frozen: real time passes, but document.timeline.currentTime never moves. Every
     CSS transition and entry animation then rests on its first frame, so a revealed
     element still computes to opacity 0 and the page looks blank. Detect the frozen
     clock and opt the motion layer out (`data-motion`), so content is always shown. */
  /* reveal net — runs on every page, for every .rv element, independent of any
     IntersectionObserver. In a frozen or hidden document the observer callbacks
     never arrive, which would leave revealed-but-invisible content behind. */
  function sweepReveal(){
    const h = innerHeight || 800;
    document.querySelectorAll('.rv:not(.in)').forEach(el=>{
      const r = el.getBoundingClientRect();
      if(r.top < h * .95 && r.bottom > -h * .5) el.classList.add('in');
    });
  }
  function initRevealNet(){
    let tick = 0;
    const onScroll = ()=>{ if(tick) return; tick = requestAnimationFrame(()=>{ tick = 0; sweepReveal(); }); };
    addEventListener('scroll', onScroll, {passive:true});
    addEventListener('resize', onScroll, {passive:true});
    sweepReveal();
    addEventListener('load', sweepReveal, {once:true});
    setTimeout(sweepReveal, 400);
    setTimeout(sweepReveal, 1500);
  }
  function enableMotion(){
    const body = document.body;
    body.dataset.motion = 'on';
    // reveal whatever is already on screen in the SAME task, so turning the fade on
    // can never flash above-the-fold content out and back in
    sweepReveal();
    requestAnimationFrame(()=>requestAnimationFrame(()=>body.classList.add('rv-anim')));
  }
  function initMotion(){
    const body = document.body;
    if(!body) return;
    if(!document.timeline){ body.dataset.motion = 'off'; return; }
    const t0 = performance.now(), tl0 = document.timeline.currentTime || 0;
    setTimeout(()=>{
      const moved = (document.timeline.currentTime || 0) - tl0, elapsed = performance.now() - t0;
      if(elapsed > 150 && moved >= 40){ enableMotion(); return; }
      if(elapsed <= 120){ body.dataset.motion = 'off'; return; }
      setTimeout(()=>{
        const moved2 = (document.timeline.currentTime || 0) - tl0;
        if((performance.now() - t0) > 700 && moved2 >= 80) enableMotion();
        else body.dataset.motion = 'off';
      }, 650);
    }, 200);
  }

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

  /* ---------- phone field with typeable country code ----------
     <div class="phone" data-phone data-theme="dark|light"></div>
     el.phoneValue() → {dial, iso, country, number, e164} */
  function mountPhone(el){
    const regionIso = (REGIONS.find(r=>r.code===guessRegion())||REGIONS[0]).iso;
    let sel = DIAL.find(d=>d[0]===regionIso) || DIAL[0];
    el.innerHTML = `
      <div class="ph-code">
        <input class="ph-code-in" inputmode="tel" autocomplete="tel-country-code" aria-label="Country code" value="${sel[2]}">
        <span class="ph-iso">${sel[0]}</span>
        <div class="ph-list" role="listbox"></div>
      </div>
      <input class="ph-num" inputmode="tel" autocomplete="tel-national" placeholder="Phone / WhatsApp (optional)">`;
    const codeIn = $('.ph-code-in',el), iso = $('.ph-iso',el), list = $('.ph-list',el), num = $('.ph-num',el);
    let hi = 0, items = [];
    function render(q){
      const s = (q||'').trim().toLowerCase().replace(/^\+/, '');
      items = DIAL.filter(d=> !s || d[1].toLowerCase().includes(s) || d[0].toLowerCase()===s || d[2].replace('+','').startsWith(s));
      hi = 0;
      list.innerHTML = items.length ? items.map((d,i)=>`<button type="button" data-i="${i}" class="${i===0?'hi':''}"><b>${d[2]}</b><span>${d[1]}</span><i>${d[0]}</i></button>`).join('')
        : `<div class="ph-empty">Keep typing your code, e.g. +44</div>`;
    }
    function pick(d){ sel = d; codeIn.value = d[2]; iso.textContent = d[0]; close(); num.focus(); }
    function open(){ el.classList.add('open'); render(''); }
    function close(){ el.classList.remove('open'); }
    codeIn.addEventListener('focus', ()=>{ codeIn.select(); open(); });
    codeIn.addEventListener('input', ()=>{
      let v = codeIn.value;
      el.classList.add('open'); render(v);
      // exact dial match while typing → set iso live
      const clean = '+'+v.replace(/[^\d]/g,'');
      const exact = DIAL.find(d=>d[2]===clean);
      if(exact){ sel = exact; iso.textContent = exact[0]; } else if(/^\+?\d+$/.test(v)){ sel = [ '··', 'Custom', clean ]; iso.textContent='··'; }
    });
    codeIn.addEventListener('keydown', e=>{
      const btns = $$('button', list);
      if(e.key==='ArrowDown'||e.key==='ArrowUp'){ e.preventDefault(); if(!btns.length) return;
        hi = (hi + (e.key==='ArrowDown'?1:-1) + btns.length) % btns.length;
        btns.forEach((b,i)=>b.classList.toggle('hi', i===hi)); list.scrollTop = btns[hi].offsetTop - 60; }
      if(e.key==='Enter'){ e.preventDefault(); if(items[hi]) pick(items[hi]); else close(); }
      if(e.key==='Escape'){ close(); }
      if(e.key==='Tab'){ if(items[hi] && el.classList.contains('open') && codeIn.value!==sel[2]) pick(items[hi]); close(); }
    });
    codeIn.addEventListener('blur', ()=>setTimeout(()=>{ close(); if(!/^\+\d{1,4}$/.test(codeIn.value)){ codeIn.value = sel[2]; } else if(codeIn.value[0]!=='+'){ codeIn.value='+'+codeIn.value; } }, 160));
    list.addEventListener('mousedown', e=>{ const b=e.target.closest('button'); if(b){ e.preventDefault(); pick(items[+b.dataset.i]); }});
    num.addEventListener('input', ()=>{ num.value = num.value.replace(/[^\d\s()-]/g,''); });
    el.phoneValue = ()=>{ const n = num.value.replace(/\D/g,''); return {dial:sel[2], iso:sel[0], country:sel[1], number:num.value.trim(), e164: n ? sel[2]+n : ''}; };
    el.setRegion = (code)=>{ const r = REGIONS.find(x=>x.code===code); if(!r) return; const d = DIAL.find(x=>x[0]===r.iso); if(d && !num.value){ sel=d; codeIn.value=d[2]; iso.textContent=d[0]; } };
    el.setDial = (d)=>{ if(!d) return; sel = d; codeIn.value = d[2]; iso.textContent = d[0]; };
    return el;
  }

  /* ---------- subpage header (region, burger, hide on scroll, reveal) ---------- */
  function initSubpage(){
    const hdr = $('.hdr'); if(!hdr) return;
    let lastY = 0;
    addEventListener('scroll', ()=>{ const y=scrollY; hdr.classList.toggle('solid', y>40);
      hdr.classList.toggle('hide', y>lastY && y>400 && !$('.mmenu')?.classList.contains('open')); lastY=y; }, {passive:true});
    $('.burger')?.addEventListener('click', ()=>$('.mmenu').classList.add('open'));
    $$('.mmenu a, .mmenu .close').forEach(a=>a.addEventListener('click', ()=>$('.mmenu').classList.remove('open')));
    const menu = $('#regionMenu'), btn = $('#regionBtn');
    if(menu && btn){
      menu.innerHTML = REGIONS.map(r=>`<button data-r="${r.code}">${r.name}<span>${r.cur}</span></button>`).join('');
      const set = c=>{ localStorage.setItem('ltab-region', c); $('#regionLbl').textContent=c; $$('button',menu).forEach(b=>b.classList.toggle('on', b.dataset.r===c));
        $$('[data-phone]').forEach(p=>p.setRegion && p.setRegion(c)); document.dispatchEvent(new CustomEvent('ltab:region',{detail:c})); };
      btn.addEventListener('click', e=>{ e.stopPropagation(); menu.classList.toggle('open'); });
      document.addEventListener('click', ()=>menu.classList.remove('open'));
      menu.addEventListener('click', e=>{ const b=e.target.closest('button'); if(b){ set(b.dataset.r); menu.classList.remove('open'); }});
      set(guessRegion());
    }
    // header follows the theme of whatever section is under it
    const darkSecs = $$('.dark, footer');
    const themeTick = ()=>{ const y = 40; const on = darkSecs.some(s=>{ const r=s.getBoundingClientRect(); return r.top<=y && r.bottom>=y; });
      document.body.dataset.theme = on ? 'dark' : 'light'; };
    addEventListener('scroll', themeTick, {passive:true}); themeTick();
    /* scroll reveal — with two safety nets, because a stuck reveal leaves a long
       page looking blank. 1) anything already in view is revealed at once.
       2) a timed sweep reveals whatever is left if the observer never fires. */
    const rvs = $$('.rv');
    const show = el=>{ if(el && !el.classList.contains('in')) el.classList.add('in'); };
    const sweep = ()=>{ const h = innerHeight || 800; rvs.forEach(el=>{ const r = el.getBoundingClientRect();
      if(r.top < h * .95 && r.bottom > -h * .5) show(el); }); };
    let ioFired = false;
    if('IntersectionObserver' in window){
      const io = new IntersectionObserver(es=>{ ioFired = true; es.forEach(e=>{ if(e.isIntersecting){ show(e.target); io.unobserve(e.target);} }); }, {threshold:.08, rootMargin:'0px 0px -6% 0px'});
      rvs.forEach(el=>io.observe(el));
    }
    // the sweep does not depend on the observer, so scrolling always reveals
    let tick = 0;
    const onScroll = ()=>{ if(tick) return; tick = requestAnimationFrame(()=>{ tick = 0; sweep(); }); };
    addEventListener('scroll', onScroll, {passive:true});
    addEventListener('resize', onScroll, {passive:true});
    sweep();
    addEventListener('load', sweep, {once:true});
    setTimeout(sweep, 400);
    // if the observer never reported at all, the environment cannot support it:
    // reveal everything rather than leave a long page blank
    setTimeout(()=>{ if(!ioFired) rvs.forEach(show); }, 1200);

    /* Animation-clock guard. Some embedded previews and headless renderers run with
       the document timeline frozen: real time passes, but document.timeline.currentTime
       never moves, so every CSS transition and entry animation sits on its first
       frame. A revealed element then still computes to opacity 0 and a long page
       looks blank. Compare the two clocks and, if the animation clock is stuck, turn
       the motion layer off — visible content always wins over decoration. */
    const ARROW = '<svg class="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
    $$('[data-arr]').forEach(b=>b.insertAdjacentHTML('beforeend', ARROW));
  }

  const ARROW = '<svg class="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  window.LTAB = {REGIONS, DIAL, guessRegion, mountPhone, initSubpage, ARROW, sweepReveal};
  initRevealNet();
  initMotion();
})();
