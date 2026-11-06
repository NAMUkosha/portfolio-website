(() => {
const realDocument=window.document;
const root=realDocument.createElement('section');root.id='portfolio-motion';root.setAttribute('aria-label','Selected work and archive');root.innerHTML="<main><div class=\"intro\" aria-live=\"polite\"><h1 id=\"home-title\"></h1><p id=\"home-description\"></p><p id=\"home-detail\"></p><div id=\"motion-logos\" data-edge-glass=\"off\"></div></div><div class=\"archive-copy\" aria-live=\"polite\"><h2 id=\"title\"></h2><p id=\"description\"></p></div><div id=\"pm-orbit\"><div id=\"cards\" aria-label=\"Projects\"></div></div><button id=\"more\" aria-label=\"View more work in Archive\" hidden><span class=\"more-arrow\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4 12h15m-6-6 6 6-6 6\"/></svg></span><span>More work</span></button><aside aria-label=\"Archive projects\" inert><select id=\"motion-year\" aria-label=\"Filter archive by year\"></select><div id=\"index\"></div></aside></main>\n<div class=\"controls\" inert><button id=\"previous\" aria-label=\"Previous project\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M12 19V5m-6 6 6-6 6 6\"/></svg></button><button id=\"next\" aria-label=\"Next project\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M12 5v14m-6-6 6 6 6-6\"/></svg></button></div>\n";realDocument.body.append(root);realDocument.body.classList.add('motion-live');
const document={createElement:t=>realDocument.createElement(t),querySelector:s=>root.querySelector(s),querySelectorAll:s=>root.querySelectorAll(s),body:root,documentElement:realDocument.documentElement,dispatchEvent:e=>realDocument.dispatchEvent(e)};
const homeItems=[
 {id:'aimpower',group:'design',name:'A Zoom + Web System for Stutter-Affirming Progress',tag:'UI/UX & accessibility',year:'2025',line:'Connecting in-meeting support, personal reflection and therapy goals.',image:'assets/aimpower/cover.webp',detail:'Design lead · In collaboration with AImpower.org'},
 {id:'unity',group:'design',name:'Precision Management System for Shipbuilding',tag:'Unity · Industrial UI/UX · Private',year:'2025',line:'Connecting shipbuilding progress, 3D models and precision records in one workflow.',detail:'Sole UI/UX designer · Unity internship',private:true},
 {id:'pomelox',group:'design',name:'PomeloX',tag:'UI/UX · Mobile app',year:'2025–2026',line:'A home for campus life, from finding events to building community.',image:'assets/pomelox/home.png',detail:'Interface design from early mockups to launch'},
 {id:'google',group:'research',name:'Future of Work',tag:'Google × Cornell · UX Research · Private',year:'2026',line:'Exploring how people and AI coordinate work across teams.',detail:'Team research · Google × Cornell',private:true},
 {id:'lexicon',group:'research',name:'The Lexicon of Wish',tag:'Hybrid Ecologies Creative Lab',year:'2023',line:'Giving contemporary wishes a new visual language.',image:'assets/lexicon/cover.png',detail:'Design research & generative AI'},
 {id:'quipu',group:'research',name:'Quipu',tag:'Design research',year:'2024',line:'Recorded physically. Stored digitally.',image:'assets/quipu/cover.png',detail:'Data physicalization & interaction'}
 ];
const order=['aimpower','google','unity','pomelox','lexicon','quipu'];
const featuredCount=order.length;
const data=[...order.map(id=>{const h=homeItems.find(p=>p.id===id),n=notes.find(p=>p.id===id);return {...n,title:h.name,story:h.line,detail:h.detail,tag:h.tag,year:h.year,cover:h.image||n.cover};}),...notes.filter(p=>!order.includes(p.id))];
let homeActive=-1;
const stories=data.map(d=>d.story||d.description||'');
const selectedCopy=data;
let selectedYear='all';
const available=()=>mode==='home'?data.slice(0,featuredCount).map((_,i)=>i):data.map((_,i)=>i).filter(i=>selectedYear==='all'||String(data[i].year).includes(selectedYear));
const interactable=()=>!root.hidden&&!root.inert&&!realDocument.querySelector('dialog[open]');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let mode='home',active=-1,frame=0,flight=false,positions=[],wheelTotal=0,lastWheel=0,drag=null,copyAnimation=[];
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const cards=data.map((d,i)=>{
 const card=document.createElement('button');card.className='card motion-card';card.setAttribute('aria-label',d.title);
 card.innerHTML=`<img src="${d.private?'assets/'+d.id+'-cover-blur.png':d.cover}" ${d.private?'data-private-cover="'+d.id+'"':''} alt="${d.title}" draggable="false">${d.private?'<span class="motion-private-logo" data-edge-glass="off"><img src="assets/logos/'+(d.id==='unity'?'unity-white':'google')+'.png" alt="'+d.id+'"></span>':''}`;
 const extras=d.id==='pomelox'?[['assets/pomelox/checkin.png',''],['assets/pomelox/profile.png','']]:d.id==='unity'?[['assets/unity-model-blur.png','unity-model']]:d.back?[[d.back,'']]:[];
 const front=card.querySelector(':scope > img');front.classList.add('motion-cover');
 const primary=document.createElement('span');primary.className='stack-photo motion-layer motion-primary';front.before(primary);primary.append(front);
 extras.forEach(([src,key],j)=>{const layer=document.createElement('span');layer.className='stack-photo motion-layer motion-extra';layer.dataset.layer=j;layer.innerHTML=`<img src="${src}" ${key?'data-private-cover="'+key+'"':''} alt="${d.title} — detail ${j+1}" draggable="false">`;card.prepend(layer);});
 card.classList.toggle('motion-triple',extras.length===2);card.classList.toggle('motion-pair',extras.length===1);
 card.addEventListener('pointerenter',()=>{if(mode==='archive'&&!flight)window.edgeGlassRefresh?.(900);});card.addEventListener('pointerleave',()=>window.edgeGlassRefresh?.(900));
 card.dataset.projectId=d.id;if(d.id==='lexicon')card.dataset.edgeGlass='off';
 card.onclick=()=>{if(!drag?.moved&&!flight){if(i===active)openProject(d.id);else choose(i);}};document.querySelector('#cards').append(card);
 const item=document.createElement('button');item.textContent=d.title;item.onclick=()=>choose(i);document.querySelector('#index').append(item);return card;
});
let archiveCursor=null;
function targets(cursor=null){
 const w=document.documentElement.clientWidth,h=innerHeight,m=w<700;
 return cards.map((_,i)=>{
  if(mode==='home'){
   if(active<0)return{x:w*(m?.5:.67)+(i-1)*(m?w*.3:w*.14),y:h*(m?.8:.77),s:(m?w*.23:w*.13)/300,r:(i-1)*4,o:i<3?.18:0};
   const diff=i-active,focus=diff===0,visible=i<featuredCount&&Math.abs(diff)<=1;
   const cw=focus?(m?Math.min(w*.62,h*.31):Math.min(w*.29,h*.51)):(m?w*.27:w*.14);
   return{x:focus?w*(m?.53:.68):w*(diff<0?.015:.985)+Math.sign(diff)*Math.max(0,Math.abs(diff)-1)*w*.3,y:h*(m?.66:.53),s:cw/300,r:focus?0:Math.sign(diff)*5,o:visible?(focus?1:.22):0};
  }
  // A bounded arc: projects keep their order and never wrap around the wheel.
  const ids=available(),diff=ids.indexOf(i)-(cursor??ids.indexOf(active)),radius=m?h*.58:h*.85,theta=clamp(diff,-2,2)*.44,cw=m?Math.min(w*.49,h*.30):Math.min(w*.27,h*.40,380);
  return{x:w*(m?.57:.56)-radius+radius*Math.cos(theta),y:h*(m?.43:.53)+radius*Math.sin(theta)+Math.sign(diff)*Math.max(0,Math.abs(diff)-2)*radius*.65,s:cw/300*(1-Math.min(2,Math.abs(diff))*.16),r:clamp(diff,-2,2)*-5,o:!ids.includes(i)?0:1-clamp(Math.abs(diff),0,1)*.60-clamp(Math.abs(diff)-1,0,1)*.40};
 });
}
function draw(){
 cards.forEach((c,i)=>{const p=positions[i];c.style.transform=`translate(${(p.x-150).toFixed(3)}px,${(p.y-180).toFixed(3)}px) rotate(${p.r.toFixed(3)}deg) scale(${p.s.toFixed(5)})`;c.style.opacity=p.o;c.style.zIndex=String(100-Math.round(Math.abs(mode==='archive'?available().indexOf(i)-(archiveCursor??available().indexOf(active)):i-active)*10));});
 // The existing unified edge-glass renderer updates synchronously on scroll.
 window.edgeGlassRenderNow?.();if(mode==='archive')paintIndex(archiveCursor??available().indexOf(active));
}
function updateMore(){document.querySelector('#more').hidden=mode!=='home'||active!==featuredCount-1||flight;}
function animate(transition=false){
 cancelAnimationFrame(frame);document.querySelector('#more').hidden=true;
 const start=performance.now(),from=positions.map(p=>({...p})),to=targets(),duration=reduced.matches?0:transition?2100:1350;flight=true;
 function tick(now){let done=true;positions=to.map((b,i)=>{const delay=transition?Math.min(3,Math.abs(i-active))*110:Math.min(2,Math.abs(i-active))*65,t=duration?clamp((now-start-delay)/duration,0,1):1;if(t<1)done=false;const e=(1-(1+8*t)*Math.exp(-8*t))/(1-9*Math.exp(-8)),a=from[i]||b,arc=transition?Math.sin(Math.PI*e):0;return{x:a.x+(b.x-a.x)*e+arc*(innerWidth<700?25:80),y:a.y+(b.y-a.y)*e-arc*(75+Math.abs(i-active)*18),s:a.s+(b.s-a.s)*e,r:a.r+(b.r-a.r)*e+arc*(mode==='archive'?-12:10),o:a.o+(b.o-a.o)*e};});draw();if(!done||(!reduced.matches&&now-start<duration+(transition?330:130)+70))frame=requestAnimationFrame(tick);else{frame=0;flight=false;updateMore();}}
 frame=requestAnimationFrame(tick);
}
function paintIndex(cursor){
 const list=document.querySelector('#index'),ids=available(),lo=clamp(Math.floor(cursor),0,ids.length-1),hi=clamp(Math.ceil(cursor),0,ids.length-1),buttons=[...list.children],a=buttons[ids[lo]],b=buttons[ids[hi]];if(!a||!b)return;
 const mobile=innerWidth<700,center=el=>mobile?el.offsetLeft+el.offsetWidth/2:el.offsetTop+el.offsetHeight/2;
 const offset=center(a)+(center(b)-center(a))*(cursor-lo)-(mobile?list.clientWidth:list.clientHeight)/2;
 if(mobile)list.scrollLeft=offset;else list.scrollTop=offset;
 buttons.forEach((el,i)=>{const distance=Math.abs(ids.indexOf(i)-cursor);el.style.color=distance<.55?'#282828':'#999';});
}
function update(animateText=false){
 if(animateText&&!reduced.matches&&mode==='home'){
  const source=document.querySelector('.intro'),box=source.getBoundingClientRect(),ghost=source.cloneNode(true);
  ghost.removeAttribute('class');ghost.className='motion-copy-ghost';ghost.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));ghost.setAttribute('aria-hidden','true');ghost.inert=true;
  Object.assign(ghost.style,{left:box.left+'px',top:box.top+'px',width:box.width+'px'});root.append(ghost);
  ghost.animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-9px)'}],{duration:300,easing:'ease-out',fill:'forwards'}).finished.then(()=>ghost.remove()).catch(()=>ghost.remove());
 }

 document.querySelector('.intro').scrollTop=0;
 const d=data[Math.max(0,active)],greeting=mode==='home'&&active<0;
 document.body.classList.toggle('is-greeting',greeting);
 document.querySelector('#home-title').textContent=greeting?"Hi, I'm Wenjia Shi":d.title;document.querySelector('#home-description').textContent=greeting?'Designer & researcher at UX Spot.':stories[Math.max(0,Math.min(active,featuredCount-1))];document.querySelector('#home-detail').textContent=greeting?'Cornell graduate, bridging physical and digital experiences through design, research and AI-native practice.':selectedCopy[Math.max(0,Math.min(active,featuredCount-1))].detail;
 document.querySelector('#motion-logos').innerHTML=greeting?`<p class="motion-scroll-hint">Scroll to explore selected work ↓</p><a href="#about">About me ↗</a> · <a href="mailto:wenjiashi616@gmail.com">Email ↗</a> · <a href="https://www.linkedin.com/in/wenjia-shi/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>`:`<div class="motion-meta"><span class="motion-tag">${d.tag||d.type}</span><span class="motion-year-tag">${d.year}</span>${d.private&&!unlocked?'<span class="motion-access-tag">Enter password to view</span>':''}</div>`+({aimpower:['aimpower'],google:['google'],unity:['unity','sws'],pomelox:['cu']}[d.id]||[]).map(b=>`<img src="assets/logos/${b}.png" alt="${b}">`).join('');document.querySelector('#title').textContent=d.title;document.querySelector('#description').textContent=d.description;
 if(animateText&&!reduced.matches){copyAnimation.forEach(a=>a.cancel());copyAnimation=[...document.querySelectorAll(mode==='home'?'.intro h1,.intro > p,.intro #motion-logos':'.archive-copy h2,.archive-copy p')].map((el,i)=>el.animate([{opacity:0,transform:'translateY(22px)'},{opacity:1,transform:'translateY(0)'}],{duration:mode==='archive'?360:850,delay:mode==='archive'?35+i*55:240+i*95,fill:'backwards',easing:'cubic-bezier(.16,.65,.2,1)'}));}
 document.querySelectorAll('#index button').forEach((b,i)=>{b.hidden=!available().includes(i);b.setAttribute('aria-current',String(i===active));});
 cards.forEach((b,i)=>{b.setAttribute('aria-current',String(i===active));b.tabIndex=(mode==='home'?i<featuredCount&&Math.abs(i-active)<=1:Math.abs(i-active)<=1)?0:-1;});
 document.querySelector('#previous').disabled=active===available()[0];document.querySelector('#next').disabled=active===available().at(-1);
 document.body.dataset.active=active;document.body.dataset.view=mode;
 if(mode==='archive'&&!animateText)paintIndex(available().indexOf(active));
}
// All thumbnails follow one interpolated wheel position, including intermediate projects.
function animateArchive(startIndex){
 cancelAnimationFrame(frame);flight=true;document.querySelector('#more').hidden=true;
 const endIndex=available().indexOf(active),distance=Math.abs(endIndex-startIndex),duration=reduced.matches?0:Math.min(1900,500+distance*95),start=performance.now();
 function tick(now){
  const t=duration?clamp((now-start)/duration,0,1):1,e=t*t*t*(t*(t*6-15)+10);
  archiveCursor=startIndex+(endIndex-startIndex)*e;positions=targets(archiveCursor);draw();
  if(t<1)frame=requestAnimationFrame(tick);else{archiveCursor=null;frame=0;flight=false;updateMore();}
 }
 frame=requestAnimationFrame(tick);
}
function choose(index){if(flight||!interactable())return;const next=clamp(index,mode==='home'?-1:0,(mode==='home'?featuredCount:data.length)-1);if(next===active)return;const previousIndex=available().indexOf(active);active=next;if(mode==='home')homeActive=active;update(true);if(mode==='archive')animateArchive(previousIndex);else animate();}
function setMode(next){if(flight)return;if(next===mode)return;copyAnimation.forEach(a=>a.cancel());if(next==='home')active=homeActive;else active=Math.max(0,active);mode=next;if(mode==='archive'){selectedYear='all';document.querySelector('#motion-year').value='all';}if(location.hash!=='#'+mode)location.hash=mode;document.body.classList.toggle('is-archive',mode==='archive');document.querySelector('aside').inert=mode!=='archive';document.querySelector('.controls').inert=mode!=='archive';document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===mode)));wheelTotal=0;update(true);animate(true);}
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>setMode(b.dataset.view));document.querySelector('#more').onclick=()=>setMode('archive');document.querySelector('#next').onclick=()=>step(1);document.querySelector('#previous').onclick=()=>step(-1);
addEventListener('wheel',e=>{if(!interactable())return;if(e.ctrlKey||e.target.closest?.('nav,select'))return;e.preventDefault();if(flight)return;const now=performance.now();if(now-lastWheel<250)return;const delta=(Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY)*(e.deltaMode===1?16:e.deltaMode===2?innerHeight:1);if(Math.sign(delta)!==Math.sign(wheelTotal))wheelTotal=0;wheelTotal+=delta;if(Math.abs(wheelTotal)<(mode==='archive'?16:24))return;step(Math.sign(wheelTotal));wheelTotal=0;lastWheel=now;},{passive:false});
addEventListener('keydown',e=>{if(!interactable()||e.target.closest?.('input,select,textarea,button,a'))return;if(['ArrowDown','ArrowUp','ArrowLeft','ArrowRight'].includes(e.key)&&!e.target.closest?.('nav')){e.preventDefault();step(['ArrowDown','ArrowRight'].includes(e.key)?1:-1);}});
const deck=document.querySelector('#cards');deck.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse')return;drag={x:e.clientX,y:e.clientY,moved:false};});deck.addEventListener('pointermove',e=>{if(!drag)return;if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>12)drag.moved=true;});deck.addEventListener('pointerup',e=>{if(!drag)return;const distance=mode==='home'?drag.x-e.clientX:drag.y-e.clientY;if(Math.abs(distance)>35)step(Math.sign(distance));setTimeout(()=>drag=null,0);});deck.addEventListener('pointercancel',()=>drag=null);
addEventListener('resize',()=>{document.querySelector('.intro').scrollTop=0;cancelAnimationFrame(frame);frame=0;flight=false;archiveCursor=null;positions=targets();draw();updateMore();});reduced.addEventListener('change',()=>{cancelAnimationFrame(frame);frame=0;flight=false;archiveCursor=null;positions=targets();draw();updateMore();});positions=targets();draw();update();updateMore();

function step(direction){if(mode==='home')return choose(active+direction);const ids=available();choose(ids[clamp(ids.indexOf(active)+direction,0,ids.length-1)]);}
document.querySelector('#index').addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();step(e.key==='ArrowDown'?1:-1);}});
const yearControl=document.querySelector('#motion-year');yearControl.innerHTML='<option value="all">All years</option>'+[...new Set(notes.map(n=>n.year))].sort().reverse().map(y=>`<option>${y}</option>`).join('');
yearControl.onchange=()=>{if(flight){yearControl.value=selectedYear;return;}selectedYear=yearControl.value;active=available()[0];update(true);animate();};
document.querySelector('#home-title').onclick=()=>{if(active>=0&&!flight)openProject(data[active].id);};document.querySelector('#home-title').tabIndex=0;
document.querySelector('#title').onclick=()=>{if(!flight)openProject(data[active].id);};document.querySelector('#title').tabIndex=0;
for(const el of [document.querySelector('#home-title'),document.querySelector('#title')])el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();el.click();}};
function refreshCovers(){root.classList.toggle('motion-unlocked',unlocked);privateVault.hydrateCovers(root);update();window.edgeGlassRefresh?.();}
renderEditorialHome=()=>{window.homeCollectionController?.destroy();refreshCovers();};
renderArchive=()=>refreshCovers();
const originalShowPage=showPage;showPage=dest=>{originalShowPage(dest);root.hidden=!['home','archive'].includes(dest);if(!root.hidden){if(mode!==dest){flight=false;setMode(dest);}else{update();}}};
const originalOpenReading=openReading;openReading=id=>{originalOpenReading(id);root.inert=!realDocument.querySelector('#note-reading').hidden;};
const originalCloseNote=closeNote;closeNote=(...args)=>{originalCloseNote(...args);root.inert=false;};
realDocument.addEventListener('click',e=>{const link=e.target.closest?.('a[href="#home"],a[href="#archive"]');if(link&&flight){e.preventDefault();e.stopImmediatePropagation();}},true);
root.hidden=location.hash==='#about';refreshCovers();if(page==='archive')setMode('archive');
})();
