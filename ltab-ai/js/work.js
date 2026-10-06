/* Our Work page: archive data, filters, list/grid view, reader */
(function(){
  const $=(s,e=document)=>e.querySelector(s), $$=(s,e=document)=>[...e.querySelectorAll(s)];
  LTAB.initSubpage();
  /* Placeholder archive. Replace with your real project list:
     [name, service, industry, region, one-liner] */
  const SVC = ['Custom app','AI agents','Automation','Website','E-commerce','Branding','Marketing','AI video','Interactive AI','Testing'];
  const IND = ['Retail','Healthcare','Real estate','Logistics','Hospitality','Education','Finance','Home services','Fashion','Food & beverage'];
  const REG = ['USA','Canada','Europe','UK','UAE','Singapore','Malaysia','Australia','New Zealand'];
  const PROJ = Array.from({length:48},(_,i)=>({id:i+1, name:`Project ${String(i+1).padStart(2,'0')}`, svc:SVC[(i*7)%SVC.length], svc2:SVC[(i*3+2)%SVC.length], ind:IND[(i*5)%IND.length], reg:REG[(i*4)%REG.length]}));
  let svc='All', reg='All', q='', shown=12, view='grid';
  const pill=(id,arr,cur)=>$(id).innerHTML=['All',...arr].map(v=>`<button data-v="${v}" class="${v===cur?'on':''}">${v}</button>`).join('');
  pill('#fSvc',SVC,svc); pill('#fReg',REG,reg);
  $('#fReg').querySelectorAll('button').forEach(b=>{ if(b.dataset.v==='All') b.textContent='All regions'; });
  function list(){ return PROJ.filter(p=>(svc==='All'||p.svc===svc||p.svc2===svc)&&(reg==='All'||p.reg===reg)&&(!q||(p.name+p.svc+p.svc2+p.ind+p.reg).toLowerCase().includes(q))); }
  function render(){
    const l=list(); $('#count').textContent=`Showing ${Math.min(shown,l.length)} of ${l.length} projects`;
    $('#grid').className='wgrid'+(view==='list'?' list':'');
    $('#grid').innerHTML=l.slice(0,shown).map(p=>`<button class="wcard" data-id="${p.id}"><div class="shot">[ screenshot ]</div>
      <div class="info"><h3>${p.name}</h3><div class="tags"><span>${p.svc}</span>${p.svc2!==p.svc?`<span>${p.svc2}</span>`:''}<span>${p.ind}</span><span class="rg">${p.reg}</span></div></div></button>`).join('')
      || '<p class="lede" style="grid-column:1/-1">Nothing matches. Try another filter.</p>';
    $('#more').style.display = shown<l.length ? '' : 'none';
  }
  $('#fSvc').addEventListener('click',e=>{const b=e.target.closest('button'); if(!b)return; svc=b.dataset.v; shown=12; $$('#fSvc button').forEach(x=>x.classList.toggle('on',x===b)); render();});
  $('#fReg').addEventListener('click',e=>{const b=e.target.closest('button'); if(!b)return; reg=b.dataset.v; shown=12; $$('#fReg button').forEach(x=>x.classList.toggle('on',x===b)); render();});
  $('#q').addEventListener('input',e=>{q=e.target.value.trim().toLowerCase(); shown=12; render();});
  $('#view').addEventListener('click',e=>{const b=e.target.closest('button'); if(!b)return; view=b.dataset.v; $$('#view button').forEach(x=>x.classList.toggle('on',x===b)); render();});
  $('#more').addEventListener('click',()=>{shown+=12; render();});
  render();

  const reader=$('#reader'), panel=$('#readerPanel');
  $('#grid').addEventListener('click',e=>{ const b=e.target.closest('.wcard'); if(!b) return; const p=PROJ.find(x=>x.id==b.dataset.id);
    panel.innerHTML=`<button class="reader-close">×</button><div class="eyebrow"><span class="cap"></span>${p.ind} · ${p.reg}</div><h2>${p.name}</h2>
    <div class="rbody"><div class="ph" style="min-height:300px;margin-bottom:26px"><span class="lbl">[ hero screenshot ]</span></div>
    <h4>Challenge</h4><p>What the client was struggling with, in their own words.</p><h4>What we built</h4><p>The product, the AI and automation pieces, and why it fits how they work.</p>
    <h4>Results</h4><p>Real, client-approved numbers: hours saved, revenue, conversion.</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:22px 0"><div class="ph" style="min-height:160px"><span class="lbl">[ screen ]</span></div><div class="ph" style="min-height:160px"><span class="lbl">[ screen ]</span></div></div>
    <div class="stack"><span>${p.svc}</span><span>${p.svc2}</span></div>
    <a href="index.html#lab" class="btn btn-primary" style="margin-top:34px">Build something like this${LTAB.ARROW}</a></div>`;
    reader.classList.add('open'); document.body.style.overflow='hidden'; panel.scrollTop=0;
    $('.reader-close',panel).onclick=close; });
  function close(){ reader.classList.remove('open'); document.body.style.overflow=''; }
  reader.addEventListener('click',e=>{ if(e.target===reader) close(); });
  addEventListener('keydown',e=>{ if(e.key==='Escape') close(); });
})();
