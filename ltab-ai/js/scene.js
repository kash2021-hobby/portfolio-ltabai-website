/* LTAB AI — "The Free L" 3D scene
   One shared WebGL scene. The two capsules of the logo's L split, float,
   re-arrange per section and snap back together. */
(function(){
  const canvas = document.getElementById('gl');
  if(!window.THREE || !canvas){ return; }
  const T = THREE;
  let renderer;
  try{
    renderer = new T.WebGLRenderer({canvas, antialias:true, alpha:true, powerPreference:'high-performance'});
  }catch(e){ canvas.style.display='none'; return; }
  const isMobile = matchMedia('(max-width:760px)').matches || matchMedia('(pointer:coarse)').matches;
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  renderer.setPixelRatio(Math.min(devicePixelRatio, isMobile?1.5:1.8));
  renderer.outputEncoding = T.sRGBEncoding;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0,0,11);

  /* ---- lights: orange stays hero, colour lives only in reflections ---- */
  scene.add(new T.HemisphereLight(0xfff4ea, 0x2a1408, 0.9));
  const key = new T.DirectionalLight(0xffffff, 1.6); key.position.set(4,6,8); scene.add(key);
  const rimA = new T.PointLight(0xff3fa4, 2.4, 30); rimA.position.set(-5,3,3); scene.add(rimA);   // magenta
  const rimB = new T.PointLight(0x3f7bff, 2.6, 30); rimB.position.set(5,-4,2); scene.add(rimB);   // electric blue
  const rimC = new T.PointLight(0xc8ff3f, 1.2, 24); rimC.position.set(0,5,-4); scene.add(rimC);   // lime
  const fill = new T.PointLight(0xffd2a8, 0.7, 30); fill.position.set(0,-2,7); scene.add(fill);

  const orangeMat = new T.MeshPhysicalMaterial({
    color:0xff6a00, roughness:0.22, metalness:0.05, clearcoat:1, clearcoatRoughness:0.12,
    sheen:0.6, sheenColor:new T.Color(0xffb27a), emissive:0x3a1200, emissiveIntensity:0.35
  });
  const deepMat = orangeMat.clone(); deepMat.color = new T.Color(0xf25a00);

  /* ---- the L: two capsules ---- */
  const R = 0.44;
  const root = new T.Group(); scene.add(root);
  const L = new T.Group(); root.add(L);
  const vGeo = new T.CapsuleGeometry(R, 1.75, 16, 48);
  const hGeo = new T.CapsuleGeometry(R, 1.55, 16, 48);
  const pivA = new T.Group(), pivB = new T.Group();
  const capA = new T.Mesh(vGeo, orangeMat);
  const capB = new T.Mesh(hGeo, deepMat); capB.rotation.z = Math.PI/2;
  pivA.add(capA); pivB.add(capB); L.add(pivA, pivB);
  const baseA = new T.Vector3(-0.78, 0.36, 0);
  const baseB = new T.Vector3(0.2, -0.86, 0.02);
  pivA.position.copy(baseA); pivB.position.copy(baseB);

  /* ---- swarm of small capsules (ideas / modules / blocks) ---- */
  const SW = isMobile ? 12 : 18;
  const swGeo = new T.CapsuleGeometry(0.11, 0.26, 6, 16);
  const swMats = [
    orangeMat,
    new T.MeshPhysicalMaterial({color:0xffffff, roughness:.25, clearcoat:1}),
    new T.MeshPhysicalMaterial({color:0x1a1a1a, roughness:.3, clearcoat:1}),
  ];
  const swarm = [];
  for(let i=0;i<SW;i++){
    const m = new T.Mesh(swGeo, swMats[i%3]);
    m.userData = {seed:Math.random()*100, a:(i/SW)*Math.PI*2, r:2.4+Math.random()*1.1, y:(Math.random()-.5)*2.6};
    m.scale.setScalar(0.001);
    root.add(m); swarm.push(m);
  }

  /* ---- state machine: every section declares a target ---- */
  // x,y in fractions of half-viewport; s = scale; split; swarm 0..1; mode for swarm formation; spin
  const STATES = {
    hero:      {x:.46, y:.02, s:1.25, split:0,    swarm:0,  mode:'orbit', spin:.15, tilt:1},
    manifesto: {x:.62, y:-.1, s:.75,  split:.55,  swarm:0,  mode:'orbit', spin:.35, tilt:.5},
    fr0:       {x:-.48,y:.02, s:1.0,  split:1.2,  swarm:1,  mode:'orbit', spin:.2,  tilt:.6},   // thinking
    fr1:       {x:-.48,y:.02, s:1.1,  split:.5,   swarm:.7, mode:'ring',  spin:.6,  tilt:.6},   // design
    fr2:       {x:-.48,y:.02, s:1.0,  split:.9,   swarm:1,  mode:'grid',  spin:.05, tilt:.4},   // development
    fr3:       {x:-.48,y:.02, s:1.15, split:0,    swarm:.8, mode:'belt',  spin:1.1, tilt:.4},   // business
    services:  {x:.92, y:.72, s:.32,  split:0,    swarm:0,  mode:'orbit', spin:.5,  tilt:.2},
    path:      {x:.9,  y:-.7, s:.35,  split:.3,   swarm:0,  mode:'orbit', spin:.5,  tilt:.2},
    work:      {x:1.6, y:0,   s:.4,   split:0,    swarm:0,  mode:'orbit', spin:.3,  tilt:0},
    qa:        {x:.55, y:.55, s:.4,   split:.25,  swarm:0,  mode:'orbit', spin:.6,  tilt:.3},
    proof:     {x:1.6, y:0,   s:.4,   split:0,    swarm:0,  mode:'orbit', spin:.3,  tilt:0},
    lab:       {x:-.52,y:-.25,s:.95,  split:.7,   swarm:.6, mode:'orbit', spin:.25, tilt:.8},
    labdone:   {x:-.52,y:-.25,s:1.05, split:0,    swarm:0,  mode:'orbit', spin:.9,  tilt:.8},
    footer:    {x:.6,  y:.3,  s:.7,   split:0,    swarm:0,  mode:'orbit', spin:.4,  tilt:.6},
  };
  const MOBILE_OVERRIDE = {
    hero:{x:0, y:.42, s:.78},
    manifesto:{x:.55, y:.62, s:.4},
    fr0:{x:0,y:.5,s:.62}, fr1:{x:0,y:.5,s:.66}, fr2:{x:0,y:.5,s:.62}, fr3:{x:0,y:.5,s:.68},
    services:{x:1.4}, path:{x:1.4}, qa:{x:.6,y:.78,s:.28},
    lab:{x:.55,y:.82,s:.3}, labdone:{x:.55,y:.82,s:.36}, footer:{x:.5,y:.55,s:.4}
  };
  let target = 'hero';
  const cur = Object.assign({}, STATES.hero);
  function getState(name){
    const st = Object.assign({}, STATES[name] || STATES.hero);
    if(isMobile && MOBILE_OVERRIDE[name]) Object.assign(st, MOBILE_OVERRIDE[name]);
    return st;
  }

  /* ---- input: pointer tilt, drag-to-split, gyro ---- */
  const ptr = {x:0,y:0, tx:0, ty:0};
  const drag = {on:false, sx:0, sy:0, dx:0, dy:0, vel:0, extraSplit:0, rotY:0, rotX:0};
  addEventListener('pointermove', e=>{
    ptr.tx = (e.clientX/innerWidth)*2-1; ptr.ty = (e.clientY/innerHeight)*2-1;
    if(drag.on){
      drag.dx = e.clientX-drag.sx; drag.dy = e.clientY-drag.sy;
    }
  }, {passive:true});
  const dragZone = document.querySelector('.hero-drag');
  if(dragZone){
    dragZone.addEventListener('pointerdown', e=>{
      drag.on = true; drag.sx = e.clientX; drag.sy = e.clientY; drag.dx = drag.dy = 0;
      dragZone.setPointerCapture && dragZone.setPointerCapture(e.pointerId);
    });
    const up = ()=>{ if(!drag.on) return; drag.on=false; drag.rotY += drag.dx*0.006; drag.rotX += drag.dy*0.004; drag.dx=drag.dy=0; pulse(0.6); };
    dragZone.addEventListener('pointerup', up);
    dragZone.addEventListener('pointercancel', up);
    dragZone.addEventListener('pointermove', e=>{ if(drag.on){ drag.dx = e.clientX-drag.sx; drag.dy = e.clientY-drag.sy; }});
  }
  addEventListener('deviceorientation', e=>{
    if(e.gamma==null) return;
    ptr.tx = Math.max(-1,Math.min(1,e.gamma/30));
    ptr.ty = Math.max(-1,Math.min(1,(e.beta-45)/30));
  }, {passive:true});

  /* ---- external API ---- */
  let pulseV = 0;
  function pulse(a){ pulseV = Math.min(1.2, pulseV + (a||0.25)); }
  window.LTAB3D = {
    setState(n){ if(STATES[n]) target = n; },
    pulse,
    snap(){ target = 'labdone'; pulse(1); }
  };

  /* ---- resize ---- */
  let halfW=1, halfH=1;
  function resize(){
    const w = innerWidth, h = innerHeight;
    renderer.setSize(w,h,false);
    camera.aspect = w/h; camera.updateProjectionMatrix();
    halfH = Math.tan(T.MathUtils.degToRad(camera.fov/2))*camera.position.z;
    halfW = halfH*camera.aspect;
  }
  addEventListener('resize', resize); resize();

  /* ---- loop ---- */
  const clock = new T.Clock();
  const tmp = new T.Vector3();
  let running = true;
  document.addEventListener('visibilitychange', ()=>{ running = !document.hidden; if(running){ clock.getDelta(); loop(); }});
  const lerp=(a,b,t)=>a+(b-a)*t;

  function loop(){
    if(!running) return;
    requestAnimationFrame(loop);
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    const goal = getState(target);
    const k = 1 - Math.pow(0.0015, dt);      // smooth follow
    for(const key in goal){ if(typeof goal[key]==='number') cur[key] = lerp(cur[key], goal[key], k); }
    cur.mode = goal.mode;

    ptr.x = lerp(ptr.x, ptr.tx, 1-Math.pow(0.002,dt));
    ptr.y = lerp(ptr.y, ptr.ty, 1-Math.pow(0.002,dt));
    pulseV = lerp(pulseV, 0, 1-Math.pow(0.05,dt));

    // drag split: distance pulls capsules apart, release springs back
    const dragDist = drag.on ? Math.min(1.6, Math.hypot(drag.dx, drag.dy)/160) : 0;
    drag.extraSplit = lerp(drag.extraSplit, dragDist, 1-Math.pow(drag.on?0.0005:0.02, dt));
    drag.rotY = lerp(drag.rotY, 0, 1-Math.pow(0.35,dt));
    drag.rotX = lerp(drag.rotX, 0, 1-Math.pow(0.35,dt));

    // root placement
    root.position.set(cur.x*halfW, cur.y*halfH + (reduce?0:Math.sin(t*.8)*.06), 0);
    const sc = cur.s*(1+pulseV*.08);
    root.scale.setScalar(sc);

    // L rotation: idle sway + pointer tilt + drag
    const live = drag.on ? drag.dx*0.006 : 0, liveX = drag.on ? drag.dy*0.004 : 0;
    L.rotation.y = (reduce?0:Math.sin(t*cur.spin*.6)*.45) + ptr.x*.5*cur.tilt + drag.rotY + live;
    L.rotation.x = (reduce?0:Math.cos(t*.5)*.08) + ptr.y*.3*cur.tilt + drag.rotX + liveX;
    L.rotation.z = (cur.mode==='belt' ? t*cur.spin*.4 : lerp(L.rotation.z % (Math.PI*2), 0, .03)) ;

    // split the two capsules along the logo's diagonal cut (up-left / down-right)
    const sp = cur.split + drag.extraSplit + pulseV*.25;
    pivA.position.set(baseA.x - sp*.55, baseA.y + sp*.55, sp*.35);
    pivB.position.set(baseB.x + sp*.6,  baseB.y - sp*.45, -sp*.25);
    pivA.rotation.z = sp*.28 + (reduce?0:Math.sin(t*.9)*sp*.08);
    pivB.rotation.z = -sp*.22 + (reduce?0:Math.cos(t*.7)*sp*.08);
    pivA.rotation.x = sp*.3; pivB.rotation.y = sp*.4;

    // swarm formations
    swarm.forEach((m,i)=>{
      const u = m.userData; let x,y,z,rz=0;
      if(cur.mode==='grid'){            // development: blocks assembling
        const cols = 6, cx = (i%cols)-(cols-1)/2, cy = Math.floor(i/cols)-1;
        x = cx*.62; y = cy*.62 - 1.0; z = .4; rz = Math.PI/2;
        y += Math.sin(t*2+i)*.04;
      }else if(cur.mode==='ring'){      // design: a colour wheel / brush ring
        const a = u.a + t*.5; x = Math.cos(a)*2.5; y = Math.sin(a)*2.5; z = Math.sin(a*2)*.5; rz = a;
      }else if(cur.mode==='belt'){      // business: a running loop
        const a = u.a - t*1.1; x = Math.cos(a)*3.0; y = Math.sin(a)*1.1 - .1; z = Math.sin(a)*1.4; rz = a+Math.PI/2;
      }else{                             // thinking: free orbit of ideas
        const a = u.a + t*.25 + Math.sin(t*.3+u.seed)*.3;
        x = Math.cos(a)*u.r; z = Math.sin(a)*u.r*.6; y = u.y + Math.sin(t*.7+u.seed)*.25; rz = t+u.seed;
      }
      tmp.set(x,y,z);
      m.position.lerp(tmp, 1-Math.pow(0.01,dt));
      m.rotation.z = lerp(m.rotation.z, rz, .08); m.rotation.x = t*.4+u.seed;
      const ts = cur.swarm*(.85+Math.sin(t*1.3+u.seed)*.15);
      m.scale.setScalar(Math.max(0.001, lerp(m.scale.x, ts, 1-Math.pow(0.02,dt))));
    });

    // lights drift so reflections shift colour
    rimA.position.x = -5 + Math.sin(t*.4)*2; rimB.position.y = -4 + Math.cos(t*.3)*2;

    renderer.render(scene, camera);
  }
  loop();
})();
