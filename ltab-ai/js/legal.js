/* LTAB AI — region-aware legal layer:
   1. consent/data banner whose mode follows the selected region,
   2. every [data-legal] link points at the current region's document,
   3. the Legal Center (legal/index.html) renders region-specific documents. */
(function(){
  const $ = (s,el=document)=>el.querySelector(s), $$ = (s,el=document)=>[...el.querySelectorAll(s)];
  const DATA = window.LTAB_LEGAL_DATA;
  if(!DATA) return;

  function guess(){
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
  const region = ()=> localStorage.getItem('ltab-region') || guess();
  const jursFor = r => DATA.REGION_JUR[r] || ['US'];
  const jurFor = r => {
    const jurs = jursFor(r);
    if(jurs.length > 1){
      const savedJ = localStorage.getItem('ltab-jurisdiction');
      if(savedJ && jurs.includes(savedJ)) return savedJ;
    }
    return jurs[0];
  };

  /* ---------- consent state ---------- */
  function consent(){ try{ return JSON.parse(localStorage.getItem('ltab-consent')||'null'); }catch(e){ return null; } }
  function saveConsent(c){ localStorage.setItem('ltab-consent', JSON.stringify(c)); }

  /* ---------- 1. banner ---------- */
  const COPY = {
    'opt-in': 'This site stores only what it needs to run: your region, your place in a form, and this choice. Anything optional stays off until you say yes.',
    'notice': 'This site stores only what it needs to run: your region, your place in a form, and this choice. No advertising cookies. No trackers.',
  };
  function bannerEl(){
    let el = $('#ltabConsent');
    if(el) return el;
    el = document.createElement('div');
    el.id = 'ltabConsent'; el.className = 'cbar'; el.setAttribute('role','dialog'); el.setAttribute('aria-live','polite');
    el.innerHTML = `<div class="cbar-card">
      <div class="cbar-eyebrow"><span class="cap"></span>Cookies &amp; data · <b></b></div>
      <p class="cbar-copy"></p>
      <p class="cbar-links"><a data-legal="privacy">Privacy policy</a><i>·</i><a data-legal="cookies">Cookie notice</a><i>·</i><a data-legal="declaration">Data declaration</a></p>
      <div class="cbar-actions">
        <button class="btn btn-primary" data-c="all">Allow all</button>
        <button class="btn btn-ghost" data-c="essential">Essential only</button>
      </div></div>`;
    document.body.appendChild(el);
    el.addEventListener('click', e=>{
      const b = e.target.closest('[data-c]'); if(!b) return;
      if(e.target.closest('a')) return;
      saveConsent({v:1, mode:el.dataset.mode, choice:b.dataset.c, ts:new Date().toISOString()});
      el.classList.remove('open'); LTAB_LEGAL.links();
      if(window.LTAB3D) LTAB3D.pulse(.3);
    });
    return el;
  }
  function showBanner(force){
    const el = bannerEl();
    const mode = DATA.JURISDICTIONS[jurFor(region())].consentMode;
    const c = consent();
    el.dataset.mode = mode;
    if(!force && c && c.mode === mode){ el.classList.remove('open'); return; }
    $('.cbar-copy', el).textContent = COPY[mode] || COPY.notice;
    $('.cbar-actions', el).classList.toggle('ask', mode === 'opt-in');
    $('.cbar-eyebrow b', el).textContent = DATA.SITE_REGIONS[region()];
    el.classList.add('open');
  }

  /* ---------- 2. region-aware links ---------- */
  function setLinks(){
    const r = region();
    const base = location.pathname.includes('/legal/') ? './index.html' : 'legal/index.html';
    $$('a[data-legal]').forEach(a=>{
      const doc = a.dataset.legal;
      a.href = base + '#' + r + '/' + (doc==='gdpr' ? 'declaration' : doc);
      if(doc === 'gdpr'){
        const jurs = jursFor(r);
        a.textContent = (jurs.includes('EU')||jurs.includes('UK')) ? (jurs[0]==='UK' ? 'UK GDPR' : 'GDPR') : 'Data declaration';
      }
    });
  }

  /* ---------- 3. Legal Center ---------- */
  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function initCenter(){
    const root = $('#legalRoot'); if(!root) return;
    let doc = 'privacy';
    const m = location.hash.match(/^#([A-Z]{2})\/(\w+)$/);
    if(m && DATA.SITE_REGIONS[m[1]] && DATA.DOCS[m[2]]){ localStorage.setItem('ltab-region', m[1]); doc = m[2]; }
    function render(){
      const r = region(), jur = jurFor(r);
      const c = DATA.composeDoc(doc, jur);
      if(!c) return;
      const chk = consent();
      const ack = chk && chk.mode === DATA.JURISDICTIONS[jur].consentMode;
      root.innerHTML = `
        <div class="legal-head rv in">
          <div>
            <div class="eyebrow" style="margin-bottom:22px"><span class="cap"></span>Legal Center · follows your region</div>
            <h2 class="h2">${esc(c.meta.title)}</h2>
            <div class="lg-chips">
              <span class="lg-chip lg-orange">${esc(DATA.SITE_REGIONS[r])}</span>
              <span class="lg-chip">${esc(c.jurLabel)}</span>
              <span class="lg-chip">Effective ${esc(c.meta.version)}</span>
              <span class="lg-chip">${c.annex.consentMode==='opt-in' ? 'Asks first' : 'Tells you first'}</span>
              ${ack?'<span class="lg-chip lg-ok">Choice saved</span>':'<span class="lg-chip lg-warn">Choice pending</span>'}
            </div>
          </div>
          <button class="btn btn-ghost" id="lgPrint">Print / PDF</button>
        </div>
        <p class="lg-tag">${esc(c.meta.tag)}</p>
        <p class="lg-intro">${esc(c.meta.intro)}</p>
        <div class="lg-doc">
          ${c.blocks.map(b=> b.h ? `<h3>${esc(b.h)}</h3>` : b.li ? `<li>${esc(b.li)}</li>` : `<p>${esc(b.p)}</p>`).join('')}
          ${c.extras.length ? `<div class="lg-extra"><div class="eyebrow" style="margin-bottom:14px"><span class="cap"></span>Applies in ${esc(c.jurLabel)}</div>${c.extras.map(t=>`<p>${esc(t)}</p>`).join('')}</div>` : ''}
          <div class="lg-annex">
            <div class="eyebrow" style="margin-bottom:14px"><span class="cap"></span>Region specifics — ${esc(c.jurLabel)}</div>
            <div class="lg-row"><span class="k">Laws that apply here</span><div>${c.annex.laws.map(l=>`<b>${esc(l.name)}</b><p>${esc(l.note)}</p>`).join('')}</div></div>
            <div class="lg-row"><span class="k">Regulator</span><p>${esc(c.annex.regulator)} <a class="lg-a" href="${esc(c.annex.regulatorUrl)}" target="_blank" rel="noopener">Complain here <svg class="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a></p></div>
            <div class="lg-row"><span class="k">Your rights</span><div>${c.annex.rights.map(rt=>`<li>${esc(rt)}</li>`).join('')}</div></div>
            <div class="lg-row"><span class="k">Timing</span><p>${esc(c.annex.rightsTiming)}</p></div>
            <div class="lg-row"><span class="k">Data leaving your country</span><p>${esc(c.annex.transferNote)}</p></div>
            <div class="lg-row"><span class="k">How long we keep it</span><p>${esc(c.annex.retentionNote)}</p></div>
            <div class="lg-row"><span class="k">Questions</span><p>Write to <a class="lg-a" href="mailto:${c.contact}">${c.contact}</a> — a human answers.</p></div>
          </div>
          <p class="lg-note">Template ${esc(c.meta.version)} by LTAB AI. Have your own counsel confirm it for your business before relying on it as final.</p>
        </div>`;
      $$('#lgDocTabs button').forEach(b=>b.classList.toggle('on', b.dataset.d === doc));
      $$('#lgRegions button').forEach(b=>b.classList.toggle('on', b.dataset.r === r));
      $$('#lgJur button').forEach(b=>b.classList.toggle('on', b.dataset.j === jur));
      const pj = $('#lgJur');
      pj.style.display = jursFor(r).length > 1 ? '' : 'none';
      $('#lgPrint').onclick = ()=>print();
    }
    $('#lgDocTabs').innerHTML = [
      ['privacy','Privacy policy'], ['terms','Terms of service'], ['cookies','Cookie notice'], ['declaration','Data declaration'],
    ].map(d=>`<button data-d="${d[0]}">${d[1]}</button>`).join('');
    $('#lgRegions').innerHTML = Object.entries(DATA.SITE_REGIONS).map(([k,n])=>`<button data-r="${k}">${n}</button>`).join('');
    $('#lgJur').innerHTML = [['EU','Europe'],['UK','United Kingdom']].map(([j,n])=>`<button data-j="${j}">${n}</button>`).join('');
    $('#lgDocTabs').addEventListener('click', e=>{ const b=e.target.closest('button'); if(!b) return; doc=b.dataset.d; writeHash(); render(); });
    $('#lgRegions').addEventListener('click', e=>{
      const b=e.target.closest('button'); if(!b) return;
      localStorage.setItem('ltab-region', b.dataset.r);
      document.dispatchEvent(new CustomEvent('ltab:region',{detail:b.dataset.r})); setLinks(); writeHash(); render();
    });
    $('#lgJur').addEventListener('click', e=>{
      const b=e.target.closest('button'); if(!b) return;
      localStorage.setItem('ltab-jurisdiction', b.dataset.j); render();
    });
    addEventListener('hashchange', ()=>{ const m=location.hash.match(/^#([A-Z]{2})\/(\w+)$/); if(m && DATA.DOCS[m[2]]){ doc=m[2]; render(); } });
    render();
  }
  function writeHash(){
    const r = region();
    let doc = 'privacy';
    const tabs = $$('#lgDocTabs button');
    tabs.forEach(b=>{ if(b.classList.contains('on')) doc = b.dataset.d; });
    history.replaceState(null, '', '#'+r+'/'+doc);
  }

  /* ---------- start ---------- */
  const LTAB_LEGAL = window.LTAB_LEGAL = {
    consentFor(cat){ /* 'essential' | 'analytics' | 'marketing' */
      if(cat==='essential') return true;
      const c = consent(); if(!c) return DATA.JURISDICTIONS[jurFor(region())].consentMode !== 'opt-in';
      if(c.choice==='all') return true;
      if(c.choice==='essential') return false;
      return true;
    },
    reopen(){ showBanner(true); },
    links: setLinks,
    banner: showBanner,
    setRegion(r){ localStorage.setItem('ltab-region', r); document.dispatchEvent(new CustomEvent('ltab:region',{detail:r})); },
  };
  document.addEventListener('ltab:region', ()=>{
    setLinks();
    const c = consent();
    showBanner(!(c && c.mode === DATA.JURISDICTIONS[jurFor(region())].consentMode));
  });
  setLinks();
  if(document.body.classList.contains('lawpage')){
    if(window.LTAB) LTAB.initSubpage();
    initCenter();
  } else {
    showBanner(false);
  }
})();
