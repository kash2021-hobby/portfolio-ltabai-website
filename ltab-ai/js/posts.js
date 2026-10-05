/* Recent Developments page: posts data, filters, reader with interactive demos */
(function(){
  const $=(s,e=document)=>e.querySelector(s), $$=(s,e=document)=>[...e.querySelectorAll(s)];
  LTAB.initSubpage();
  /* Each post: id, cat, title, excerpt, read, date, interactive demo type, body paragraphs, stack.
     Replace with your own posts. Demo types: chat | flow | toggle | none */
  const POSTS = [
    {id:'d1', cat:'AI Agents', big:true, title:'An agent that answers WhatsApp leads, qualifies them, then books the visit.', ex:'How we connected an AI agent to WhatsApp, a CRM and a calendar, so a service business stopped losing leads after hours.', read:'6 min', date:'Sep 2026', demo:'chat',
      body:['A home-services client was losing evening and weekend leads. Nobody was there to reply, and by morning the customer had booked someone else.','We built an agent that replies within seconds, asks the three questions the team always asks, checks the technicians’ calendar, and books the visit. The full conversation lands in the CRM for a human to review.'],
      stack:['WhatsApp Business API','LLM agent','CRM webhook','Google Calendar']},
    {id:'d2', cat:'Interactive AI video', title:'A product video viewers can ask questions to.', ex:'An AI presenter that pauses, listens and answers, then picks up where it left off.', read:'4 min', date:'Aug 2026', demo:'toggle',
      body:['Normal product videos are one-way. We built a video where the presenter stops when the viewer asks a question, answers from the product documentation, then carries on.','It turns a passive ad into a conversation, and every question becomes data for the sales team.'],
      stack:['AI avatar','Speech-to-text','RAG on product docs','Web player']},
    {id:'d3', cat:'Automation', title:'Invoices in, ledger updated: no one touches a spreadsheet.', ex:'Reading supplier invoices from email, checking them, and posting them to accounting automatically.', read:'5 min', date:'Aug 2026', demo:'flow',
      body:['The finance team spent two days a month typing invoice lines into accounting software.','Now invoices are read the moment they arrive, matched to purchase orders, and posted. Anything that doesn’t match goes to a person with the reason highlighted.'],
      stack:['Email parser','Document AI','Accounting API','Slack alerts']},
    {id:'d4', cat:'E-commerce', title:'A store that rearranges itself for each shopper.', ex:'Personalised home pages generated per visitor from browsing intent.', read:'5 min', date:'Jul 2026', demo:'none', body:['Write-up coming soon. Replace with your own post.'], stack:['Headless commerce','Recommendation model']},
    {id:'d5', cat:'Interactive AI content', title:'A quiz that designs your kitchen.', ex:'Five playful questions, one AI-generated render of your kitchen, one lead.', read:'3 min', date:'Jul 2026', demo:'none', body:['Write-up coming soon. Replace with your own post.'], stack:['Image generation','Lead capture']},
    {id:'d6', cat:'Software testing', title:'How we test checkout flows across 14 devices in a day.', ex:'Our release-check routine for e-commerce launches.', read:'4 min', date:'Jun 2026', demo:'none', body:['Write-up coming soon. Replace with your own post.'], stack:['Device lab','Issue tracker'], link:'software-testing.html'},
    {id:'d7', cat:'AI Agents', title:'A support agent that knows when to hand over to a human.', ex:'Confidence thresholds, tone detection and a clean handoff.', read:'6 min', date:'Jun 2026', demo:'none', body:['Write-up coming soon. Replace with your own post.'], stack:['LLM agent','Helpdesk API']},
  ];
  const cats = ['All', ...new Set(POSTS.map(p=>p.cat))];
  let cat = 'All', q = '';
  $('#filters').innerHTML = cats.map(c=>`<button data-c="${c}" class="${c==='All'?'on':''}">${c}<span class="c">${c==='All'?POSTS.length:POSTS.filter(p=>p.cat===c).length}</span></button>`).join('');
  const DEMO_LABEL = {chat:'Interactive · try it', flow:'Interactive · try it', toggle:'Interactive · try it'};
  function render(){
    const list = POSTS.filter(p=>(cat==='All'||p.cat===cat) && (!q || (p.title+p.ex+p.cat).toLowerCase().includes(q)));
    $('#posts').innerHTML = list.length ? list.map((p,i)=>`<button class="post rv in ${p.big && cat==='All' && !q ?'big':''}" data-id="${p.id}">
      <div class="viz">${DEMO_LABEL[p.demo]?`<span class="live">${DEMO_LABEL[p.demo]}</span>`:''}[ cover image / screen recording ]</div>
      <div class="body"><div class="meta"><span>${p.cat}</span><span>${p.date} · ${p.read}</span></div><h3>${p.title}</h3><p>${p.ex}</p></div></button>`).join('')
      : `<p class="lede">Nothing matches that yet.</p>`;
  }
  $('#filters').addEventListener('click', e=>{ const b=e.target.closest('button'); if(!b) return; cat=b.dataset.c; $$('#filters button').forEach(x=>x.classList.toggle('on',x===b)); render(); });
  $('#q').addEventListener('input', e=>{ q=e.target.value.trim().toLowerCase(); render(); });
  render();

  /* reader with interactive demos */
  const reader = $('#reader'), panel = $('#readerPanel');
  function demoHTML(p){
    if(p.demo==='chat') return `<div class="demo"><div class="dl">Interactive · replay the agent</div><div class="chat" id="chat"></div><button class="btn btn-primary" id="chatGo" style="margin-top:18px;height:46px">Play conversation</button></div>`;
    if(p.demo==='flow') return `<div class="demo"><div class="dl">Interactive · run the workflow</div><div class="flow" id="flow">${['Email arrives','AI reads invoice','Match PO','Post to ledger','Done'].map((n,i)=>(i?'<span class="sep"></span>':'')+`<span class="node">${n}</span>`).join('')}</div><button class="btn btn-primary" id="flowGo" style="margin-top:18px;height:46px">Run it</button></div>`;
    if(p.demo==='toggle') return `<div class="demo"><div class="dl">Interactive · normal vs interactive video</div><div class="switch" id="vt" data-v="0" style="margin:0 0 18px"><span class="thumb"></span><button class="on">Normal video</button><button>Interactive</button></div><p id="vtOut" style="font-size:17px">The viewer watches 30 seconds, then leaves. You learn nothing.</p></div>`;
    return '';
  }
  function open(id){
    const p = POSTS.find(x=>x.id===id); if(!p) return;
    panel.innerHTML = `<button class="reader-close" aria-label="Close">×</button><div class="eyebrow"><span class="cap"></span>${p.cat} · ${p.date} · ${p.read}</div>
      <h2>${p.title}</h2><div class="rbody"><p style="font-size:20px;color:var(--muted)">${p.ex}</p>
      <div class="ph" style="min-height:280px;margin:26px 0"><span class="lbl">[ hero image / video ]</span></div>
      ${p.body.map(t=>`<p>${t}</p>`).join('')}${demoHTML(p)}<h4>Built with</h4><div class="stack">${p.stack.map(s=>`<span>${s}</span>`).join('')}</div>
      <div style="margin-top:40px;display:flex;gap:10px;flex-wrap:wrap"><a href="index.html#lab" class="btn btn-primary">Build something like this${LTAB.ARROW}</a>${p.link?`<a href="${p.link}" class="btn btn-ghost">Learn more</a>`:''}</div></div>`;
    reader.classList.add('open'); document.body.style.overflow='hidden'; history.replaceState(null,'','#'+id);
    panel.scrollTop = 0; wire(p);
  }
  function close(){ reader.classList.remove('open'); document.body.style.overflow=''; history.replaceState(null,'',location.pathname); }
  function wire(p){
    $('.reader-close',panel).onclick = close;
    if(p.demo==='chat'){
      const msgs=[['u','Hi, my AC isn’t cooling. Villa in Al Barsha.'],['a','Sorry to hear that! Is it all units or just one room?'],['u','Just the master bedroom.'],['a','Got it. Earliest technician slot is tomorrow 10:00. Shall I book it?'],['u','Yes please'],['a','Booked ✓ Yousef will arrive 10:00–10:30. You’ll get a reminder tonight.']];
      $('#chatGo').onclick = ()=>{ const c=$('#chat'); c.innerHTML=''; msgs.forEach((m,i)=>setTimeout(()=>{ c.insertAdjacentHTML('beforeend',`<div class="m ${m[0]}">${m[1]}</div>`); }, i*800)); };
    }
    if(p.demo==='flow'){
      $('#flowGo').onclick = ()=>{ const ns=$$('#flow .node'); ns.forEach(n=>n.classList.remove('on')); ns.forEach((n,i)=>setTimeout(()=>n.classList.add('on'), i*550)); };
    }
    if(p.demo==='toggle'){
      const outs=['The viewer watches 30 seconds, then leaves. You learn nothing.','The viewer asks “Does it work with Shopify?”, gets an answer in the presenter’s voice, and books a demo. You get their question.'];
      $$('#vt button').forEach((b,i)=>b.onclick=()=>{ $('#vt').dataset.v=i; $$('#vt button').forEach((x,k)=>x.classList.toggle('on',k===i)); $('#vtOut').textContent=outs[i]; });
    }
  }
  $('#posts').addEventListener('click', e=>{ const b=e.target.closest('.post'); if(b) open(b.dataset.id); });
  reader.addEventListener('click', e=>{ if(e.target===reader) close(); });
  addEventListener('keydown', e=>{ if(e.key==='Escape') close(); });
  if(location.hash) open(location.hash.slice(1));

  $('#sub').addEventListener('submit', e=>{ e.preventDefault(); const v=$('#subEmail').value.trim();
    $('#subMsg').textContent = /^\S+@\S+\.\S+$/.test(v) ? 'You’re in. First update lands when we next ship.' : 'That email doesn’t look right.'; });
})();
