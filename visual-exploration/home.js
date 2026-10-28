function renderEditorialHome(){
 window.homeCollectionController?.destroy();
 const items=[
 {id:'aimpower',group:'design',name:'A Zoom + Web System for Stutter-Affirming Progress',tag:'UI/UX & accessibility',year:'2025',line:'Connecting in-meeting support, personal reflection and therapy goals.',image:'assets/aimpower/cover.webp',detail:'Design lead · In collaboration with AImpower.org'},
 {id:'unity',group:'design',name:'Precision Management System for Shipbuilding',tag:'Unity · Industrial UI/UX · Private',year:'2025',line:'Connecting shipbuilding progress, 3D models and precision records in one workflow.',detail:'Sole UI/UX designer · Unity internship',private:true},
 {id:'pomelox',group:'design',name:'PomeloX',tag:'UI/UX · Mobile app',year:'2025–2026',line:'A home for campus life, from finding events to building community.',image:'assets/pomelox/home.png',detail:'Interface design from early mockups to launch'},
 {id:'google',group:'research',name:'Future of Work',tag:'Google × Cornell · UX Research · Private',year:'2026',line:'Exploring how people and AI coordinate work across teams.',detail:'Team research · Google × Cornell',private:true},
 {id:'lexicon',group:'research',name:'The Lexicon of Wish',tag:'Hybrid Ecologies Creative Lab',year:'2023',line:'Giving contemporary wishes a new visual language.',image:'assets/lexicon/cover.png',detail:'Design research & generative AI'},
 {id:'quipu',group:'research',name:'Quipu',tag:'Design research',year:'2024',line:'Recorded physically. Stored digitally.',image:'assets/quipu/cover.png',detail:'Data physicalization & interaction'}
 ];
 const media=p=>p.private?`<span class="private-cover"><img class="private-cover-image" data-private-cover="${p.id}" src="assets/${p.id}-cover-blur.png" alt="${p.name} preview" ${unlocked?'data-unlocked="true"':''}><span class="private-cover-brand" data-edge-glass="off"><img src="assets/logos/${p.id==='unity'?'unity-white':'google'}.png" alt="${p.id==='unity'?'Unity':'Google'}"></span></span>`:p.id==='pomelox'?`<span class="home-device-glass"><img src="${p.image}" alt="${p.name}" decoding="async"></span>`:`<img src="${p.image}" alt="${p.name}" decoding="async">`;
 const logos=id=>{const map={aimpower:['aimpower'],unity:['unity','sws'],pomelox:['cu'],google:['google']};const labels={aimpower:'AImpower.org',unity:'Unity',sws:'Shanghai Waigaoqiao Shipbuilding',cu:'Chinese Union',google:'Google'};return map[id]?`<div class="project-logos" data-edge-glass="off">${map[id].map(brand=>`<img src="assets/logos/${brand}.png" alt="${labels[brand]}" class="brand-${brand}" decoding="async">`).join('')}</div>`:'';};
 const feature=(p,secondary=false)=>`<article class="home-feature ${secondary?'home-feature-secondary':''}">${secondary?'':'<p class="home-selection-label">Selected work</p>'}<button class="home-feature-image" data-edge-glass="${['lexicon'].includes(p.id)?'off':'on'}" data-project="${p.id}" aria-label="View ${p.name}">${media(p)}</button><div class="home-feature-copy"><p class="home-eyebrow">${p.tag} <span>${p.year}</span></p><h2><button data-project="${p.id}">${p.name}</button></h2><p>${p.line}</p><small>${p.detail}</small>${logos(p.id)}</div></article>`;
 const root=document.querySelector('#home-editorial');root.dataset.edgeGlass='off';
 root.innerHTML=`<div class="home-opening"><div class="home-bio"><p class="home-eyebrow">Hi, I'm Wenjia Shi</p><h1>Designer & researcher<br>at UX Spot.</h1><p>Cornell graduate, bridging physical and digital experiences through design, research and AI-native practice.</p><a href="#about">About me ↗</a></div>${feature(items[0])}</div>${feature(items.find(p=>p.id==='google'),true)}<section class="home-collections" aria-label="Project collections"><div class="home-collection-pin"><div class="home-collection-inner">${['design','research'].map(group=>`<section class="home-collection"><button class="home-group-toggle" aria-expanded="${group==='design'}" aria-controls="home-${group}"><span>${group==='design'?'Design':'Research'}</span><span class="home-toggle-mark" aria-hidden="true">${group==='design'?'−':'+'}</span></button><div id="home-${group}" class="home-group-panel" ${group==='research'?'hidden':''}>${items.filter(p=>p.group===group&&!['aimpower','google'].includes(p.id)).map((p,i)=>`<article class="home-project-row ${group==='design'&&i===0?'is-open':''}" data-home-item="${p.id}"><button class="home-row-toggle" aria-expanded="${group==='design'&&i===0}" aria-controls="home-preview-${p.id}"><span class="home-row-name">${p.name}</span><span class="home-row-tag">${p.tag}</span><span class="home-row-mark" aria-hidden="true">${group==='design'&&i===0?'−':'+'}</span></button><div id="home-preview-${p.id}" class="home-row-panel" ${group==='design'&&i===0?'':'inert'}><div class="home-row-content"><button data-edge-glass="${['lexicon','pomelox'].includes(p.id)?'off':'on'}" data-project="${p.id}" class="home-row-image ${p.second?'home-device-pair':''}" aria-label="View ${p.name}">${media(p)}</button><div class="home-row-description"><p>${p.line}</p><small>${p.detail} · ${p.year}</small>${p.private?`<span class="private-access-hint">${unlocked?'Project unlocked':'Enter password to view'}</span>`:''}${logos(p.id)}</div></div></div></article>`).join('')}</div></section>`).join('')}</div></div></section><div class="home-contact"><div><a href="mailto:wenjiashi616@gmail.com">Email ↗</a><a href="https://www.linkedin.com/in/wenjia-shi/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a></div></div>`;
 privateVault.hydrateCovers(root);
 window.homeCollectionController = createHomeCollectionScroll(root);
}

// Each category owns its sticky scene. The three row headings never collapse.
function createHomeCollectionScroll(root){
 const section=root.querySelector('.home-collections');
 const groups=[...section.querySelectorAll('.home-collection')];
 const events=new AbortController(),signal=events.signal;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let frame=0,step=0,lastY=scrollY,manual=null;
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const scenes=groups.map(group=>{
  const scene=document.createElement('div');scene.className='home-category-scene';
  group.before(scene);scene.append(group);
  const rows=[...group.querySelectorAll('.home-project-row')];
  group.querySelector('.home-group-panel').hidden=false;
  const heading=group.querySelector('.home-group-toggle');const slot=document.createElement('div');slot.className='home-group-anchor';heading.before(slot);slot.append(heading);
  return {scene,group,rows,active:-1,weights:rows.map(()=>0)};
 });
 function top(scene){return scene.getBoundingClientRect().top+scrollY;}
 function select(item,index){
  item.active=index;
  item.rows.forEach((row,i)=>{
   const open=i===index,panel=row.querySelector('.home-row-panel'),button=row.querySelector('.home-row-toggle');
   row.classList.toggle('is-open',open);row.dataset.focused=String(open);
   button.setAttribute('aria-expanded',String(open));row.querySelector('.home-row-mark').textContent=open?'−':'+';
   panel.inert=!open;
  });
  const button=item.group.querySelector('.home-group-toggle');button.setAttribute('aria-expanded',String(index>=0));
  button.querySelector('.home-toggle-mark').textContent=index>=0?'−':'+';
 }
 function paint(){
  frame=0;if(document.querySelector('#home').hidden)return;
  if(manual&&Math.abs(scrollY-manual.y)>40)manual=null;
  let animating=false;
  scenes.forEach(item=>{
   const progress=clamp((scrollY-top(item.scene)+step*.25)/step,0,item.rows.length-1);
   const index=manual?.item===item?manual.index:Math.round(progress);
   if(item.active!==index)select(item,index);
   item.rows.forEach((row,i)=>{
    const target=manual?.item===item?Math.max(0,index===i?1:0):clamp(1-Math.abs(progress-i),0,1);
    const previous=item.weights[i];
    const weight=reduced.matches?target:previous+(target-previous)*.22;
    item.weights[i]=weight;
    if(Math.abs(weight-target)>.003)animating=true;
    const panel=row.querySelector('.home-row-panel');
    panel.style.height=`calc(var(--preview-space) * ${weight.toFixed(4)})`;
    panel.style.opacity=String(clamp(weight*2,0,1));
   });
   item.group.style.setProperty('--copy-drift',`${clamp((scrollY-lastY)*.15,-5,5).toFixed(2)}px`);
  });
  scenes.forEach((item,g)=>{
   const button=item.group.querySelector('.home-group-toggle'),box=item.group.getBoundingClientRect();
   const next=scenes[g+1]?.group.getBoundingClientRect().top??Infinity;
   const sticky=box.top<0&&box.bottom>button.offsetHeight&&next>0;
   button.style.position=sticky?'fixed':'';
   button.style.top=sticky?`${Math.min(0,next-button.offsetHeight)}px`:'';
   button.style.left=sticky?`${box.left}px`:'';
   button.style.width=sticky?`${box.width}px`:'';
  });
  lastY=scrollY;window.edgeGlassRenderNow?.();if(animating)schedule();
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(paint);}
 function measure(){
  if(document.querySelector('#home').hidden)return;
  step=clamp(innerHeight*.68,320,680);
  scenes.forEach(item=>{
   item.scene.style.height=`${innerHeight+item.rows.length*step}px`;
   const title=item.group.querySelector('.home-group-toggle').offsetHeight;
   const headings=item.rows.reduce((sum,row)=>sum+row.querySelector('.home-row-toggle').offsetHeight,0);
   item.group.style.setProperty('--preview-space',`${Math.max(150,innerHeight-title-headings-64)}px`);
  });schedule();
 }
 function navigate(item,index){
  manual=null;select(item,index);
  scrollTo({top:top(item.scene)+index*step,behavior:reduced.matches?'instant':'smooth'});schedule();
 }
 scenes.forEach(item=>{
  item.rows.forEach((row,i)=>row.querySelector('.home-row-toggle').onclick=()=>{
   if(item.active===i){manual={item,index:-1,y:scrollY};select(item,-1);}else navigate(item,i);
  });
  item.group.querySelector('.home-group-toggle').onclick=()=>{
   if(item.active>=0){manual={item,index:-1,y:scrollY};select(item,-1);}else navigate(item,0);
  };
 });
 window.addEventListener('scroll',schedule,{passive:true,signal});
 window.addEventListener('resize',measure,{passive:true,signal});
 window.addEventListener('hashchange',measure,{signal});
 root.addEventListener('load',measure,{capture:true,signal});
 document.fonts.ready.then(()=>{if(!signal.aborted)measure();});
 document.fonts.addEventListener('loadingdone',measure,{signal});
 measure();
 return {destroy(){events.abort();cancelAnimationFrame(frame);}};
}
