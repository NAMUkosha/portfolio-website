function renderEditorialHome(){
 window.homeCollectionController?.destroy();
 const items=[
 {id:'aimpower',group:'design',name:'A Zoom + Web System for Stutter-Affirming Progress',tag:'UI/UX & accessibility',year:'2025',line:'Connecting in-meeting support, personal reflection and therapy goals.',image:'assets/aimpower/cover.webp',detail:'Design lead · In collaboration with AImpower.org'},
 {id:'unity',group:'design',name:'Precision Management System for Shipbuilding',tag:'Unity · Industrial UI/UX · Private',year:'2025',line:'Connecting shipbuilding progress, 3D models and precision records in one workflow.',detail:'Sole UI/UX designer · Unity internship',private:true},
 {id:'pomelox',group:'design',name:'PomeloX',tag:'UI/UX · Mobile app',year:'2025–2026',line:'A home for campus life, from finding events to building community.',image:'assets/pomelox/home.png',detail:'Interface design from early mockups to launch'},
 {id:'google',group:'research',name:'Future of Work',tag:'Google × Cornell · UX Research · Private',year:'2026',line:'A confidential research collaboration exploring the future of work.',detail:'Team research · Google × Cornell',private:true},
 {id:'lexicon',group:'research',name:'The Lexicon of Wish',tag:'Hybrid Ecologies Creative Lab',year:'2023',line:'Giving contemporary wishes a new visual language.',image:'assets/lexicon/cover.png',detail:'Design research & generative AI'},
 {id:'quipu',group:'research',name:'Quipu',tag:'Design research',year:'2024',line:'Recorded physically. Stored digitally.',image:'assets/quipu/09.png',detail:'Data physicalization & interaction'}
 ];
 const media=p=>p.private?`<span class="unity-preview" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="private-preview-label">${unlocked?(p.id==='unity'?'Unity':'Google × Cornell'):'Private project'}</span>`:p.video?`<video data-auto-preview muted loop playsinline preload="none" src="${p.video}" poster="${p.image}" aria-label="${p.name} preview"></video>`:`<img src="${p.image}" alt="${p.name}" decoding="async">${p.second?`<img class="home-device-secondary" src="${p.second}" alt="${p.name} watch interface">`:''}`;
 const logos=id=>{const map={aimpower:['cornell','aimpower'],unity:['unity'],pomelox:['cu'],google:['google','cornell']};const labels={cornell:'Cornell Bowers',aimpower:'AImpower.org',unity:'Unity',cu:'Chinese Union',google:'Google'};return map[id]?`<div class="project-logos" data-edge-glass="off">${map[id].map(brand=>`<img src="assets/logos/${brand}.png" alt="${labels[brand]}" class="brand-${brand}" decoding="async">`).join('')}</div>`:'';};
 const feature=(p,secondary=false)=>`<article class="home-feature ${secondary?'home-feature-secondary':''}"><button class="home-feature-image" data-edge-glass="${p.id==='lexicon'?'off':'on'}" data-project="${p.id}" aria-label="View ${p.name}">${media(p)}</button><div class="home-feature-copy"><p class="home-eyebrow">${p.tag} <span>${p.year}</span></p><h2><button data-project="${p.id}">${p.name} <span>↗</span></button></h2><p>${p.line}</p><small>${p.detail}</small>${logos(p.id)}</div></article>`;
 const root=document.querySelector('#home-editorial');
 root.innerHTML=`<div class="home-opening"><div class="home-bio"><p class="home-eyebrow">Wenjia Shi</p><h1>Designer & researcher<br>at UX Spot.</h1><p>Cornell graduate, bridging physical and digital experiences through design, research and AI-native practice.</p><a href="#about">About me ↗</a></div>${feature(items[0])}</div>${feature(items.find(p=>p.id==='lexicon'),true)}<section class="home-collections" aria-label="Project collections"><div class="home-collection-pin"><div class="home-collection-inner">${['design','research'].map(group=>`<section class="home-collection"><button class="home-group-toggle" aria-expanded="${group==='design'}" aria-controls="home-${group}"><span>${group==='design'?'Design':'Research'}</span><span class="home-toggle-mark" aria-hidden="true">${group==='design'?'−':'+'}</span></button><div id="home-${group}" class="home-group-panel" ${group==='research'?'hidden':''}>${items.filter(p=>p.group===group).map((p,i)=>`<article class="home-project-row ${group==='design'&&i===0?'is-open':''}" data-home-item="${p.id}"><button class="home-row-toggle" aria-expanded="${group==='design'&&i===0}" aria-controls="home-preview-${p.id}"><span class="home-row-name">${p.name}</span><span class="home-row-tag">${p.tag}</span><span class="home-row-mark" aria-hidden="true">${group==='design'&&i===0?'−':'+'}</span></button><div id="home-preview-${p.id}" class="home-row-panel" ${group==='design'&&i===0?'':'inert'}><div class="home-row-content"><button data-edge-glass="${['lexicon','unity','google','pomelox'].includes(p.id)?'off':'on'}" data-project="${p.id}" class="home-row-image ${p.second?'home-device-pair':''}" aria-label="View ${p.name}">${media(p)}</button><div class="home-row-description"><p>${p.line}</p><small>${p.detail} · ${p.year}</small>${logos(p.id)}</div></div></div></article>`).join('')}</div></section>`).join('')}</div></div></section><div class="home-contact"><span>Get in touch</span><div><a href="mailto:wenjiashi616@gmail.com">Email ↗</a><a href="https://www.linkedin.com/in/wenjia-shi/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a></div></div>`;
 window.homeCollectionController = createHomeCollectionScroll(root);
}

// Shared native-scroll timeline: DOM media stays in the browser's scroll layer.
function createHomeCollectionScroll(root){
 const section=root.querySelector('.home-collections');
 const pin=section.querySelector('.home-collection-pin');
 const inner=section.querySelector('.home-collection-inner');
 const rows=[...section.querySelectorAll('.home-project-row')];
 const groupButtons=[...section.querySelectorAll('.home-group-toggle')];
 const groupPanels=groupButtons.map(button=>document.getElementById(button.getAttribute('aria-controls')));
 const groupOf=rows.map(row=>groupPanels.findIndex(panel=>panel.contains(row)));
 const panels=rows.map(row=>row.querySelector('.home-row-panel'));
 const toggles=rows.map(row=>row.querySelector('.home-row-toggle'));
 const headings=toggles.map(button=>{const wrapper=document.createElement('div');wrapper.className='home-row-heading';button.before(wrapper);wrapper.append(button);return wrapper;});
 const contents=rows.map(row=>row.querySelector('.home-row-content'));
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 const events=new AbortController();
 const weights=rows.map((_,i)=>i===0?1:0), groupWeights=[1,0];
 let previewHeights=[], headingHeights=[], step=0, tick=0, lastTime=0, lastY=scrollY;
 let shift=0, drift=0, manual=null, navigating=null, active=0;
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
 const ease=t=>{t=clamp(t,0,1);return t*t*(3-2*t);};
 const sectionTop=()=>scrollY+section.getBoundingClientRect().top;
 const isHome=()=>!document.querySelector('#home').hidden;
 groupPanels.forEach(panel=>{panel.hidden=false;});

 function targetAtScroll(y){
  const cursor=clamp((y-sectionTop())/step-.5,0,rows.length-1);
  const index=Math.floor(cursor), blend=ease((cursor-index-.2)/.6);
  const target=rows.map(()=>0);
  target[index]=1-blend;
  if(index+1<rows.length)target[index+1]=blend;
  return target;
 }
 function paint(now){
  tick=0;
  if(!isHome()){lastTime=0;return;}
  const dt=lastTime?clamp(now-lastTime,1,40):16.7;
  lastTime=now;
  const y=scrollY, delta=y-lastY;
  lastY=y;
  if(manual&&Math.abs(y-manual.y)>36)manual=null;
  if(navigating&&(Math.abs(y-navigating.target)<2||now>navigating.until))navigating=null;
  let target=targetAtScroll(y);
  let targetGroups;
  if(navigating)target=rows.map((_,i)=>i===navigating.index?1:0);
  if(manual){
   target=rows.map(()=>0);
   targetGroups=groupPanels.map((_,i)=>manual.type==='row'&&i===manual.group?1:0);
  }else targetGroups=groupPanels.map((_,g)=>target.reduce((sum,w,i)=>sum+(groupOf[i]===g?w:0),0));
  const nextActive=target.indexOf(Math.max(...target));
  if(!manual&&active!==nextActive){active=nextActive;observeProjectVideos();}
  const alpha=motion.matches?1:1-Math.exp(-dt/85);
  let unsettled=false;
  weights.forEach((value,i)=>{
   const next=value+(target[i]-value)*alpha;
   weights[i]=Math.abs(next-target[i])<.0005?target[i]:next;
   if(Math.abs(weights[i]-target[i])>.0005)unsettled=true;
  });
  groupWeights.forEach((value,g)=>{
   const next=value+(targetGroups[g]-value)*alpha;
   groupWeights[g]=Math.abs(next-targetGroups[g])<.0005?targetGroups[g]:next;
   if(Math.abs(groupWeights[g]-targetGroups[g])>.0005)unsettled=true;
  });
  const frameRect=pin.getBoundingClientRect();
  const inView=frameRect.bottom>0&&frameRect.top<innerHeight;
  const maxDrift=innerWidth<=700?5:8;
  const desiredDrift=motion.matches||!inView?0:clamp(delta/dt*3.5,-maxDrift,maxDrift);
  drift+=(desiredDrift-drift)*(motion.matches?1:1-Math.exp(-dt/130));
  if(Math.abs(drift)<.025)drift=0;
  if(Math.abs(drift-desiredDrift)>.025)unsettled=true;
  inner.style.setProperty('--copy-drift',`${drift.toFixed(3)}px`);
  rows.forEach((row,i)=>{
   const w=weights[i], gw=groupWeights[groupOf[i]];
   headings[i].style.height=`${headingHeights[i]*gw}px`;
   headings[i].style.opacity=String(ease((gw-.15)/.65));
   toggles[i].style.transform=`translate3d(0,${-(1-gw)*headingHeights[i]*.5}px,0)`;
   panels[i].style.height=`${previewHeights[i]*w}px`;
   panels[i].style.opacity=String(ease(w/.28));
   contents[i].style.transform=`translate3d(0,${-(1-w)*previewHeights[i]*.5}px,0)`;
   row.style.borderTopWidth=`${gw}px`;
   row.classList.toggle('is-open',w>.001);
   const expanded=!manual&&i===active;
   toggles[i].setAttribute('aria-expanded',String(expanded));
   const mark=row.querySelector('.home-row-mark'),label=expanded?'−':'+';
   if(mark.textContent!==label)mark.textContent=label;
   if(panels[i].inert!==(w<.5))panels[i].inert=w<.5;
  });
  groupButtons.forEach((button,g)=>{
   const open=targetGroups[g]>.5;
   button.setAttribute('aria-expanded',String(open));
   const mark=button.querySelector('.home-toggle-mark'),label=open?'−':'+';
   if(mark.textContent!==label)mark.textContent=label;
   if(groupPanels[g].inert!==(groupWeights[g]<.5))groupPanels[g].inert=groupWeights[g]<.5;
  });
  // Blend the outgoing and incoming anchors, instead of jumping to the next row.
  let anchor=0,total=0;
  panels.forEach((panel,i)=>{
   if(weights[i]<.001)return;
   const r=panel.getBoundingClientRect();
   anchor+=(r.top+r.height*.5)*weights[i];total+=weights[i];
  });
  if(total>.001){
   shift+=frameRect.top+frameRect.height*.5-anchor/total;
   inner.style.transform=`translate3d(0,${shift}px,0)`;
  }
  if(section.dataset.activeProject!==rows[active].dataset.homeItem)section.dataset.activeProject=rows[active].dataset.homeItem;
  // The edge pass uses this frame's layout, without a second RAF of latency.
  window.edgeGlassRenderNow?.();
  if(unsettled||Math.abs(delta)>.01||navigating)tick=requestAnimationFrame(paint);
  else lastTime=0;
 }
 function schedule(){if(!tick)tick=requestAnimationFrame(paint);}
 function measure(){
  if(!isHome())return;
  step=clamp(innerHeight*.65,300,620);
  section.style.height=`${innerHeight+rows.length*step}px`;
  headingHeights=toggles.map(button=>button.getBoundingClientRect().height);
  previewHeights=contents.map(content=>content.getBoundingClientRect().height);
  schedule();
 }
 function navigate(index){
  manual=null;
  const target=sectionTop()+(index+.5)*step;
  navigating={index,target,until:performance.now()+1800};
  scrollTo({top:target,behavior:motion.matches?'instant':'smooth'});
  schedule();
 }
 rows.forEach((row,index)=>{
  toggles[index].onclick=()=>{
   if(['unity','google'].includes(row.dataset.homeItem)&&!unlocked){openProject(row.dataset.homeItem);return;}
   if(index===active&&weights[index]>.9&&!manual){
    manual={type:'row',group:groupOf[index],y:scrollY};navigating=null;schedule();
   }else navigate(index);
  };
 });
 groupButtons.forEach((button,g)=>{
  button.onclick=()=>{
   if(button.getAttribute('aria-expanded')==='true'&&!manual){
    manual={type:'group',group:g,y:scrollY};navigating=null;schedule();
   }else navigate(groupOf.findIndex(group=>group===g));
  };
 });
 const options={passive:true,signal:events.signal};
 window.addEventListener('scroll',schedule,options);
 window.addEventListener('resize',measure,options);
 window.addEventListener('hashchange',()=>{lastY=scrollY;lastTime=0;measure();schedule();},options);
 const resume=()=>{manual=null;navigating=null;schedule();};
 section.addEventListener('wheel',resume,options);
 section.addEventListener('touchstart',resume,options);
 root.addEventListener('load',measure,{capture:true,signal:events.signal});
 document.fonts.ready.then(()=>{if(!events.signal.aborted)measure();});
 document.fonts.addEventListener('loadingdone',measure,{signal:events.signal});
 motion.addEventListener('change',schedule,{signal:events.signal});
 section.dataset.activeProject=rows[0].dataset.homeItem;
 measure();
 return {destroy(){events.abort();cancelAnimationFrame(tick);}};
}
