(() => {
const realDocument=window.document;
const root=realDocument.createElement('section');root.id='portfolio-motion';root.setAttribute('aria-label','Selected work and archive');root.innerHTML="<main><div class=\"intro\" aria-live=\"polite\"><h1 id=\"home-title\"></h1><p id=\"home-description\"></p><p id=\"home-detail\"></p><div id=\"motion-logos\"></div></div><div class=\"archive-copy\" aria-live=\"polite\"><h2 id=\"title\"></h2><p id=\"description\"></p></div><div id=\"pm-orbit\"><div id=\"cards\" aria-label=\"Projects\"></div></div><button id=\"more\" aria-label=\"View more work in Archive\" hidden><span>More work</span></button><aside aria-label=\"Archive projects\" inert><div class=\"motion-year-filter\"><button id=\"motion-year\" type=\"button\" class=\"ui-btn ui-btn--secondary\" aria-haspopup=\"listbox\" aria-expanded=\"false\" aria-controls=\"motion-year-options\"><span>All years</span><svg viewBox=\"0 0 16 16\" aria-hidden=\"true\"><path d=\"m4 6 4 4 4-4\"/></svg></button><div id=\"motion-year-options\" role=\"listbox\" aria-label=\"Filter archive by year\" hidden></div></div><div id=\"index\"></div></aside></main>\n";const hint=realDocument.createElement('button');hint.className='scroll-cue';hint.setAttribute('aria-label','Scroll down to selected projects');hint.innerHTML='<span>Scroll to explore</span>';hint.onclick=()=>choose(0);root.append(hint);realDocument.body.append(root);realDocument.body.classList.add('motion-live');
const document={createElement:t=>realDocument.createElement(t),querySelector:s=>root.querySelector(s),querySelectorAll:s=>root.querySelectorAll(s),body:root,documentElement:realDocument.documentElement};
const homeItems=[
 {id:'aimpower',group:'design',name:'A Zoom + Web System for Stutter-Affirming Progress',tag:'UI/UX & accessibility',line:'Connecting in-meeting support, personal reflection and therapy goals.',image:'assets/aimpower/cover.webp',detail:'Design lead · In collaboration with AImpower.org'},
 {id:'unity',group:'design',name:'Precision Management System for Shipbuilding',tag:'Industrial UI/UX · Confidential',line:'Connecting shipbuilding progress, 3D models and precision records in one workflow.',detail:'Sole UI/UX designer · Unity internship',private:true},
 {id:'pomelox',group:'design',name:'PomeloX',tag:'UI/UX · Mobile app',line:'A home for campus life, from finding events to building community.',image:'assets/pomelox/home.png',detail:'Interface design from early mockups to launch'},
 {id:'google',group:'research',name:'Future of Work',tag:'UX Research · Confidential',line:'Exploring how people and AI coordinate work across teams.',detail:'Team research · Google × Cornell',private:true},
 {id:'lexicon',group:'research',name:'The Lexicon of Wish',tag:'Hybrid Ecologies Creative Lab',line:'Giving contemporary wishes a new visual language.',image:'assets/lexicon/cover.png',detail:'Design research & generative AI'},
 {id:'quipu',group:'research',name:'Quipu',tag:'Design research',line:'Recorded physically. Stored digitally.',image:'assets/quipu/cover.png',detail:'Data physicalization & interaction'}
 ];
const order=['aimpower','google','unity','pomelox','lexicon','quipu'];
const featuredCount=order.length;
const data=[...order.map(id=>{const h=homeItems.find(p=>p.id===id),n=notes.find(p=>p.id===id);return {...n,title:h.name,story:h.line,detail:h.detail,tag:h.tag,cover:h.image||n.cover};}),...notes.filter(p=>!order.includes(p.id))];
let homeActive=-1;
const stories=data.map(d=>d.story||d.description||'');
const selectedCopy=data;
let selectedYear='all';
const available=()=>mode==='home'?data.slice(0,featuredCount).map((_,i)=>i):data.map((_,i)=>i).filter(i=>selectedYear==='all'||projectEndYear(data[i])===selectedYear);
const interactable=()=>!root.hidden&&!root.inert&&!realDocument.querySelector('dialog[open]');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const mobileLayout=()=>matchMedia('(max-width:700px)').matches;
let mode='home',active=-1,frame=0,flight=false,positions=[],wheelTotal=0,lastWheel=0,drag=null,copyAnimation=[];
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const cards=data.map((d,i)=>{
 const card=document.createElement('button');card.className='card motion-card';card.setAttribute('aria-label',d.title);
 card.innerHTML=`<img src="${d.private?'assets/'+d.id+'-cover-blur.png':d.cover}" ${d.private?'data-private-cover="'+d.id+'"':''} alt="${d.title}" draggable="false">${d.private?'<span class="motion-private-logo"><img src="assets/logos/'+(d.id==='unity'?'unity-white':'google')+'.png" alt="'+d.id+'"></span>':''}`;
 const extras=d.id==='pomelox'?[['assets/pomelox/checkin.png',''],['assets/pomelox/profile.png','']]:d.id==='unity'?[['assets/unity-model-blur.png','unity-model']]:d.back?[[d.back,'']]:[];
 const front=card.querySelector(':scope > img');front.classList.add('motion-cover');
 const primary=document.createElement('span');primary.className='stack-photo motion-layer motion-primary';front.before(primary);primary.append(front);
 extras.forEach(([src,key],j)=>{const layer=document.createElement('span');layer.className='stack-photo motion-layer motion-extra';layer.dataset.layer=j;layer.innerHTML=`<img src="${src}" ${key?'data-private-cover="'+key+'"':''} alt="${d.title} — detail ${j+1}" draggable="false">`;card.prepend(layer);});
 card.classList.toggle('motion-triple',extras.length===2);card.classList.toggle('motion-pair',extras.length===1);
 card.dataset.projectId=d.id;
 card.onclick=()=>{if(!drag?.moved&&!transitioning){if(i===active){if(!flight)openProject(d.id);}else choose(i);}};document.querySelector('#cards').append(card);
 const item=document.createElement('button');item.textContent=d.title;item.onclick=()=>choose(i);document.querySelector('#index').append(item);return card;
});
let archiveCursor=null,archiveVelocity=0,cardVelocity=[],transitioning=false;
function targets(cursor=null){
 const m=mobileLayout(),stage=root.querySelector('#cards');
 const w=m?stage.clientWidth:document.documentElement.clientWidth,h=m?stage.clientHeight:innerHeight,ids=available();
 return cards.map((_,i)=>{
  // Mobile images share a bounded, in-flow stage; text stays in native page flow.
  if(m){
   const list=mode==='home'?data.slice(0,featuredCount).map((_,j)=>j):ids;
   const greeting=mode==='home'&&active<0,diff=greeting?i-1:list.indexOf(i)-(cursor??list.indexOf(active));
   const visible=list.includes(i)&&Math.abs(diff)<=1;
   const width=greeting?w*.26:Math.min(w*(mode==='home'?.72:.62),h*.8);
   return{x:greeting?w*.5+diff*w*.31:w*.5+diff*w*.86,y:h*.5,s:width/300*(greeting?1:1-Math.min(1,Math.abs(diff))*.4),r:diff*(greeting?4:3),o:visible?(greeting?.32:1-Math.min(1,Math.abs(diff))*.7):0};
  }
  if(mode==='home'){
   if(active<0){const scale=(m?w*.26:w*.14)/300;return{x:w*(m?.62:.70)+(i-1)*(m?w*.29:w*.15),y:h*(m?.98:.98),s:scale,r:(i-1)*4,o:i<3?.32:0};}
   const diff=i-active,focus=diff===0,visible=i<featuredCount&&Math.abs(diff)<=1;
   const cw=focus?(m?Math.min(w*.62,h*.31):Math.min(w*.29,h*.51)):(m?w*.27:w*.14);
   return{x:focus?w*(m?.53:.68):w*(diff<0?.015:.985)+Math.sign(diff)*Math.max(0,Math.abs(diff)-1)*w*.3,y:h*(m?.66:.53),s:cw/300,r:focus?0:Math.sign(diff)*5,o:visible?(focus?1:.22):0};
  }
  // A bounded arc: projects keep their order and never wrap around the wheel.
  const diff=ids.indexOf(i)-(cursor??ids.indexOf(active)),radius=m?h*.58:h*.85,theta=clamp(diff,-2,2)*.44,cw=m?Math.min(w*.49,h*.30):Math.min(w*.27,h*.40,380);
  // Place neighboring image bounds 40% beyond the viewport; interpolate along the arc.
  const previewScale=cw/300*.60,image=cards[i].querySelector('.motion-cover'),ratio=image.naturalWidth/image.naturalHeight||1;
  const imageHeight=Math.min(309.6,300/ratio),imageWidth=imageHeight*ratio,tilt=5*Math.PI/180;
  const previewHeight=(imageHeight*Math.cos(tilt)+imageWidth*Math.sin(tilt))*previewScale;
  const centerY=h*(m?.43:.53),edgeY=(diff<0?previewHeight*.10:h-previewHeight*.10)+25.2*previewScale*Math.cos(tilt);
  const edgeOffset=edgeY-(centerY+Math.sign(diff)*radius*Math.sin(.44)),distance=Math.abs(diff);
  return{x:w*(m?.57:.56)-radius+radius*Math.cos(theta),y:centerY+radius*Math.sin(theta)+edgeOffset*Math.min(1,distance*distance)+Math.sign(diff)*Math.max(0,distance-1)*radius*.35,s:cw/300*(1-Math.min(2,distance)*.40),r:clamp(diff,-2,2)*-5,o:!ids.includes(i)?0:1-clamp(distance,0,1)*.60-clamp(distance-1,0,1)*.40};
 });
}
function draw(){
 const ids=available(),cursor=archiveCursor??ids.indexOf(active);
 cards.forEach((c,i)=>{const p=positions[i];c.style.transform=`translate(${(p.x-150).toFixed(3)}px,${(p.y-180).toFixed(3)}px) rotate(${p.r.toFixed(3)}deg) scale(${p.s.toFixed(5)})`;c.style.opacity=p.o;c.style.zIndex=String(100-Math.round(Math.abs(mode==='archive'?ids.indexOf(i)-cursor:i-active)*10));});
 if(mode==='archive')paintIndex(cursor);
}
function updateSceneControls(){
 document.querySelector('#more').hidden=mode!=='home'||active!==featuredCount-1||flight;
 if(mode!=='home'||active>=0||flight)return;
 const bounds=cards.filter((_,i)=>positions[i].o>0).map(card=>card.getBoundingClientRect());
 const left=Math.max(0,Math.min(...bounds.map(rect=>rect.left)));
 const right=Math.min(document.documentElement.clientWidth,Math.max(...bounds.map(rect=>rect.right)));
 root.style.setProperty('--greeting-cards-center',`${(left+right)/2}px`);
 root.style.setProperty('--greeting-cards-top',`${Math.min(...bounds.map(rect=>rect.top))}px`);
}
function animate(transition=false){
 if(!transition)return animateSpring();
 transitioning=true;cardVelocity=[];archiveVelocity=0;archiveCursor=null;
 cancelAnimationFrame(frame);document.querySelector('#more').hidden=true;
 const start=performance.now(),from=positions.map(p=>({...p})),to=targets(),duration=reduced.matches?0:transition?WenjiaMotion.duration('scene'):WenjiaMotion.duration('surface');flight=true;
 function tick(now){let done=true;positions=to.map((b,i)=>{const delay=transition?Math.min(3,Math.abs(i-active))*110:Math.min(2,Math.abs(i-active))*65,t=duration?clamp((now-start-delay)/duration,0,1):1;if(t<1)done=false;const e=(1-(1+8*t)*Math.exp(-8*t))/(1-9*Math.exp(-8)),a=from[i]||b,arc=transition?Math.sin(Math.PI*e):0;return{x:a.x+(b.x-a.x)*e+arc*(innerWidth<700?25:80),y:a.y+(b.y-a.y)*e-arc*(75+Math.abs(i-active)*18),s:a.s+(b.s-a.s)*e,r:a.r+(b.r-a.r)*e+arc*(mode==='archive'?-12:10),o:a.o+(b.o-a.o)*e};});draw();if(!done||(!reduced.matches&&now-start<duration+(transition?330:130)+70))frame=requestAnimationFrame(tick);else{frame=0;flight=false;transitioning=false;updateSceneControls();}}
 frame=requestAnimationFrame(tick);
}
function paintIndex(cursor){
 const list=document.querySelector('#index'),ids=available(),lo=clamp(Math.floor(cursor),0,ids.length-1),hi=clamp(Math.ceil(cursor),0,ids.length-1),buttons=[...list.children],a=buttons[ids[lo]],b=buttons[ids[hi]];if(!a||!b)return;
 const mobile=mobileLayout(),center=el=>mobile?el.offsetLeft+el.offsetWidth/2:el.offsetTop+el.offsetHeight/2;
 const offset=center(a)+(center(b)-center(a))*(cursor-lo)-(mobile?list.clientWidth:list.clientHeight)/2;
 if(mobile)list.scrollLeft=offset;else list.scrollTop=offset;
 buttons.forEach((el,i)=>{const distance=Math.abs(ids.indexOf(i)-cursor);el.style.color=distance<.55?'#282828':'#999';});
}
function update(animateText=false){
 const copy=document.querySelector(mode==='home'?'.intro':'.archive-copy');
 const moveCopy=animateText&&!reduced.matches;
 if(moveCopy&&!root.classList.contains('is-greeting')){
  root.querySelectorAll('.motion-copy-ghost').forEach(el=>el.remove());
  const box=copy.getBoundingClientRect(),ghost=copy.cloneNode(true);
  ghost.removeAttribute('class');ghost.className=mode==='home'?'motion-copy-ghost':'archive-copy motion-copy-ghost';ghost.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));ghost.setAttribute('aria-hidden','true');ghost.inert=true;
  Object.assign(ghost.style,{left:box.left+'px',top:box.top+'px',width:box.width+'px',bottom:'auto',transition:'none'});root.append(ghost);
  ghost.animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-9px)'}],{duration:WenjiaMotion.duration('control'),easing:WenjiaMotion.easing(),fill:'forwards'}).finished.then(()=>ghost.remove(),()=>ghost.remove());
 }

 document.querySelector('.intro').inert=mode!=='home';document.querySelector('.archive-copy').inert=mode!=='archive';document.querySelector('.intro').scrollTop=0;
 const d=data[Math.max(0,active)],greeting=mode==='home'&&active<0;
 document.body.classList.toggle('is-greeting',greeting);
 if(mode==='home'){
  document.querySelector('#home-title').textContent=greeting?"Hi, I'm Wenjia Shi":d.title;document.querySelector('#home-description').textContent=greeting?'Designer & researcher at UX Spot.':stories[Math.max(0,Math.min(active,featuredCount-1))];document.querySelector('#home-detail').textContent=greeting?'Cornell graduate, bridging physical and digital experiences through design, research and AI-native practice.':selectedCopy[Math.max(0,Math.min(active,featuredCount-1))].detail;
  document.querySelector('#motion-logos').innerHTML=greeting?`<div class="intro-links"><a href="#about">About me </a><a href="https://www.linkedin.com/in/wenjia-shi/" target="_blank" rel="noopener noreferrer">LinkedIn </a><a href="mailto:wenjiashi616@gmail.com">Email </a></div>`:`<div class="motion-meta">${(d.tag||d.type||'').split(/\s+(?:·|×|&)\s+/).filter(Boolean).map(tag=>`<span class="motion-tag">${tag}</span>`).join('')}<span class="motion-tag">${d.year}</span></div>`+({aimpower:['aimpower'],google:['google'],unity:['unity','sws'],pomelox:['cu']}[d.id]||[]).map(b=>`<img src="assets/logos/${b}.png" alt="${b}">`).join('');
 }else{
  document.querySelector('#title').textContent=d.title;document.querySelector('#description').textContent=d.description;
 }
 if(moveCopy){
  copyAnimation.forEach(animation=>animation.cancel());
  copyAnimation=[...copy.children].map((el,i)=>el.animate(
   [{opacity:0,transform:'translateY(22px)'},{opacity:1,transform:'translateY(0)'}],
   {duration:WenjiaMotion.duration('control'),delay:i*30,fill:'backwards',easing:WenjiaMotion.easing()}
  ));
 }
 const ids=available();
 document.querySelectorAll('#index button').forEach((b,i)=>{b.hidden=!ids.includes(i);b.setAttribute('aria-current',String(i===active));});
 cards.forEach((b,i)=>{b.setAttribute('aria-current',String(i===active));const inView=ids.includes(i);b.inert=!inView;b.tabIndex=inView&&Math.abs(ids.indexOf(i)-ids.indexOf(active))<=1?0:-1;});
 document.body.dataset.active=active;document.body.dataset.view=mode;
 if(mode==='archive'&&!animateText)paintIndex(ids.indexOf(active));
}
// Retarget springs from their current position and velocity, without restarting motion.
function animateSpring(startIndex){
 cancelAnimationFrame(frame);flight=true;document.querySelector('#more').hidden=true;
 if(mode==='archive'&&archiveCursor===null)archiveCursor=startIndex??available().indexOf(active);
 const goal=targets(),endIndex=available().indexOf(active);let last=performance.now();
 function tick(now){
  const dt=Math.min((now-last)/1000,.032);last=now;let settled=true;
  const stiffness=mode==='archive'?210:165,damping=mode==='archive'?25:22;
  const advance=(value,velocity,target)=>{
   for(let n=0;n<4;n++){velocity+=(stiffness*(target-value)-damping*velocity)*dt/4;value+=velocity*dt/4;}
   return [value,velocity];
  };
  if(mode==='archive'){
   [archiveCursor,archiveVelocity]=advance(archiveCursor,archiveVelocity,endIndex);
   settled=Math.abs(archiveCursor-endIndex)<.001&&Math.abs(archiveVelocity)<.015;
   if(reduced.matches||settled){archiveCursor=endIndex;archiveVelocity=0;settled=true;}
   positions=targets(archiveCursor);
  }else{
   positions=goal.map((target,i)=>{
    const value={...positions[i]},velocity=cardVelocity[i]??={x:0,y:0,s:0,r:0,o:0};
    for(const key of ['x','y','s','r','o']){
     [value[key],velocity[key]]=advance(value[key],velocity[key],target[key]);
     const precision=key==='o'||key==='s'?.001:.08;
     if(reduced.matches){value[key]=target[key];velocity[key]=0;}
     else if(Math.abs(value[key]-target[key])>precision||Math.abs(velocity[key])>precision*10)settled=false;
    }
    value.o=clamp(value.o,0,1);return value;
   });
  }
  if(settled){positions=goal;archiveCursor=null;archiveVelocity=0;cardVelocity=[];frame=0;flight=false;}
  draw();if(!settled)frame=requestAnimationFrame(tick);else updateSceneControls();
 }
 frame=requestAnimationFrame(tick);
}
function choose(index){
 if(transitioning||!interactable()||(mobileLayout()&&flight))return;
 const next=clamp(index,mode==='home'?-1:0,(mode==='home'?featuredCount:data.length)-1);
 if(next===active||(mode==='archive'&&!available().includes(next)))return;
 const previousIndex=available().indexOf(active);active=next;if(mode==='home')homeActive=active;
 update(true);animateSpring(previousIndex);
}
function setMode(next){if(next===mode)return;cancelAnimationFrame(frame);transitioning=false;root.querySelectorAll('.motion-copy-ghost').forEach(el=>el.remove());copyAnimation.forEach(a=>a.cancel());if(next==='home')active=homeActive;else active=Math.max(0,active);mode=next;if(mode==='archive'){selectedYear='all';syncYears();closeYears();}if(location.hash!=='#'+mode)location.hash=mode;document.body.classList.toggle('is-archive',mode==='archive');document.querySelector('aside').inert=mode!=='archive';document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===mode)));wheelTotal=0;update(false);animate(true);}
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>setMode(b.dataset.view));document.querySelector('#more').onclick=()=>setMode('archive');
addEventListener('wheel',e=>{
 if(!interactable()||e.ctrlKey||e.target.closest?.('nav,select,.motion-year-filter'))return;
 if(mobileLayout())return;
 const hero=e.target.closest?.('.personal-hero');if(hero&&hero.scrollHeight>hero.clientHeight+1&&((e.deltaY>0&&hero.scrollTop+hero.clientHeight<hero.scrollHeight-2)||(e.deltaY<0&&hero.scrollTop>0)))return;
 e.preventDefault();if(transitioning)return;
 const now=performance.now(),delta=(Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY)*(e.deltaMode===1?16:e.deltaMode===2?innerHeight:1);
 if(now-lastWheel>200||Math.sign(delta)!==Math.sign(wheelTotal))wheelTotal=0;
 wheelTotal+=delta;
 const interval=mode==='archive'?160:290;
 if(now-lastWheel<interval||Math.abs(wheelTotal)<(mode==='archive'?12:18))return;
 step(Math.sign(wheelTotal));wheelTotal=0;lastWheel=now;
},{passive:false});
addEventListener('keydown',e=>{if(!interactable()||e.target.closest?.('input,select,textarea,button,a'))return;if(['ArrowDown','ArrowUp','ArrowLeft','ArrowRight'].includes(e.key)&&!e.target.closest?.('nav')){e.preventDefault();step(['ArrowDown','ArrowRight'].includes(e.key)?1:-1);}});
const deck=document.querySelector('#cards');
let suppressClickUntil=0;
const canStep=direction=>mode==='home'
 ?active+direction>=-1&&active+direction<featuredCount
 :available().indexOf(active)+direction>=0&&available().indexOf(active)+direction<available().length;
// Touch Events let Safari/Chrome keep native vertical scrolling until this local
// stage claims a swipe. Never cancel touchstart, multi-touch or boundary pans.
deck.addEventListener('touchstart',e=>{
 suppressClickUntil=0;
 if(!mobileLayout()||!interactable()||e.touches.length!==1){drag=null;return;}
 const t=e.touches[0];
 drag={id:t.identifier,x:t.clientX,y:t.clientY,at:performance.now(),active,mode,
  blocked:flight||transitioning,axis:null,direction:0,moved:false,claimed:false,released:false};
},{passive:true});
deck.addEventListener('touchmove',e=>{
 if(!drag)return;
 if(e.touches.length!==1||!interactable()||drag.active!==active||drag.mode!==mode){drag=null;return;}
 const t=e.touches[0];if(t.identifier!==drag.id)return;
 const dx=drag.x-t.clientX,dy=drag.y-t.clientY;
 if(Math.hypot(dx,dy)>8)drag.moved=true;
 if(drag.blocked||drag.released)return;
 if(!drag.axis){
  if(Math.max(Math.abs(dx),Math.abs(dy))<8)return;
  drag.axis=Math.abs(dx)>Math.abs(dy)?'x':'y';
  drag.direction=Math.sign(drag.axis==='x'?dx:dy);
  // Preserve long presses and the browser's edge/back gestures.
  if(performance.now()-drag.at>600||drag.x<16||drag.x>document.documentElement.clientWidth-16||!canStep(drag.direction)){
   drag.released=true;return;
  }
 }
 if(!e.cancelable){drag.released=true;return;}
 e.preventDefault();drag.claimed=true;
},{passive:false});
deck.addEventListener('touchend',e=>{
 if(!drag)return;
 const gesture=drag;drag=null;
 const t=[...e.changedTouches].find(t=>t.identifier===gesture.id);if(!t)return;
 const elapsed=performance.now()-gesture.at;
 if(gesture.moved||elapsed>600)suppressClickUntil=performance.now()+500;
 const distance=gesture.axis==='x'?gesture.x-t.clientX:gesture.y-t.clientY;
 const threshold=Math.max(36,Math.min(64,deck.clientWidth*.12));
 if(gesture.claimed&&!gesture.blocked&&!gesture.released&&elapsed<=600
  &&Math.abs(distance)>=threshold&&Math.sign(distance)===gesture.direction
  &&gesture.active===active&&gesture.mode===mode&&!flight&&!transitioning&&canStep(gesture.direction))step(gesture.direction);
},{passive:true});
deck.addEventListener('touchcancel',()=>{if(drag?.moved)suppressClickUntil=performance.now()+500;drag=null;},{passive:true});
deck.addEventListener('click',e=>{
 if(e.detail!==0&&performance.now()<suppressClickUntil){e.preventDefault();e.stopImmediatePropagation();}
},true);
addEventListener('resize',()=>{document.querySelector('.intro').scrollTop=0;cancelAnimationFrame(frame);frame=0;flight=false;transitioning=false;archiveCursor=null;archiveVelocity=0;cardVelocity=[];positions=targets();draw();updateSceneControls();});reduced.addEventListener('change',()=>{cancelAnimationFrame(frame);frame=0;flight=false;transitioning=false;archiveCursor=null;archiveVelocity=0;cardVelocity=[];positions=targets();draw();updateSceneControls();});update();positions=targets();draw();updateSceneControls();

function step(direction){if(mode==='home')return choose(active+direction);const ids=available();choose(ids[clamp(ids.indexOf(active)+direction,0,ids.length-1)]);}
document.querySelector('#index').addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();step(e.key==='ArrowDown'?1:-1);}});
const yearControl=document.querySelector('#motion-year'),yearOptions=document.querySelector('#motion-year-options');
const years=['all',...archiveYears];
yearOptions.innerHTML=years.map(y=>`<button type="button" role="option" data-year="${y}" aria-selected="${y===selectedYear}">${y==='all'?'All years':y}</button>`).join('');
function syncYears(){
 document.querySelector('#motion-year span').textContent=selectedYear==='all'?'All years':selectedYear;
 document.querySelectorAll('[data-year]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.year===selectedYear)));
}
function closeYears(focus=false){yearOptions.hidden=true;yearControl.setAttribute('aria-expanded','false');if(focus)yearControl.focus();}
function openYears(){yearOptions.hidden=false;yearControl.setAttribute('aria-expanded','true');yearOptions.querySelector('[aria-selected="true"]').focus();}
yearControl.onclick=()=>yearOptions.hidden?openYears():closeYears();
yearControl.onkeydown=e=>{if(['ArrowDown','ArrowUp'].includes(e.key)){e.preventDefault();openYears();}};
// Keep focus in the popup until the click selects the option.
yearOptions.addEventListener('pointerdown',e=>{if(e.target.closest('[data-year]'))e.preventDefault();});
yearOptions.onclick=e=>{
 const option=e.target.closest('[data-year]');if(!option)return;
 closeYears(true);
 if(option.dataset.year===selectedYear)return;
 selectedYear=option.dataset.year;active=available()[0];
 // The filtered orbit starts at its first item. Discard motion in the old index.
 cancelAnimationFrame(frame);frame=0;flight=false;transitioning=false;archiveCursor=null;archiveVelocity=0;
 cardVelocity=[];wheelTotal=0;drag=null;
 syncYears();update(true);positions=targets();draw();
};
yearOptions.onkeydown=e=>{
 const buttons=[...yearOptions.children],i=buttons.indexOf(realDocument.activeElement);
 if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();buttons[e.key==='Home'?0:e.key==='End'?buttons.length-1:clamp(i+(e.key==='ArrowDown'?1:-1),0,buttons.length-1)].focus();}
};
realDocument.addEventListener('keydown',e=>{if(e.key==='Escape'&&!yearOptions.hidden){e.preventDefault();closeYears(true);}});
realDocument.addEventListener('pointerdown',e=>{if(!e.target.closest('.motion-year-filter'))closeYears();});
root.querySelector('.motion-year-filter').addEventListener('focusout',e=>{if(!e.currentTarget.contains(e.relatedTarget))closeYears();});
document.querySelector('#home-title').onclick=()=>{if(active>=0&&!flight)openProject(data[active].id);};document.querySelector('#home-title').tabIndex=0;
document.querySelector('#title').onclick=()=>{if(!flight)openProject(data[active].id);};document.querySelector('#title').tabIndex=0;
for(const el of [document.querySelector('#home-title'),document.querySelector('#title')])el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();el.click();}};
function refreshCovers(){root.classList.toggle('motion-unlocked',unlocked);privateVault.hydrateCovers(root);update();}
renderEditorialHome=()=>{window.homeCollectionController?.destroy();refreshCovers();};
renderArchive=()=>refreshCovers();
const originalShowPage=showPage;showPage=dest=>{originalShowPage(dest);root.hidden=!['home','archive'].includes(dest);if(!root.hidden){if(mode!==dest){flight=false;setMode(dest);}else{update();}}};
const originalOpenReading=openReading;openReading=id=>{originalOpenReading(id);root.inert=!realDocument.querySelector('#note-reading').hidden;};
const originalCloseNote=closeNote;closeNote=(...args)=>{root.inert=false;originalCloseNote(...args);};
realDocument.addEventListener('click',e=>{
 const link=e.target.closest?.('a[href="#home"],a[href="#archive"]');
 if(link?.classList.contains('identity')){
  e.preventDefault();e.stopImmediatePropagation();homeActive=-1;transitioning=false;closeNote(false);
  if(page!=='home')showPage('home');else{active=-1;update(true);animateSpring();}
  if(location.hash!=='#home')location.hash='home';return;
 }
 if(link&&transitioning&&!mobileLayout()){e.preventDefault();e.stopImmediatePropagation();}
},true);
root.hidden=location.hash==='#about';refreshCovers();if(page==='archive')setMode('archive');
})();
