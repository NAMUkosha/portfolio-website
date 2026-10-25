const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),desktop=matchMedia('(min-width:701px)');
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const projects=[
 {id:'listening',title:'An object for listening',type:'Object & interaction',asset:1,private:true,summary:'Exploring the relationship between an object and a gesture.'},
 {id:'structure',title:'A softer structure',type:'Material & form',asset:2,summary:'An exploration of material, proportion and touch.'},
 {id:'folds',title:'Between folds',type:'Visual & spatial',asset:3,summary:'Thinking through paper, light and space.'},
 {id:'perspective',title:'A different perspective',type:'Spatial experiment',asset:4,private:true,summary:'A study of how a simple form changes with a new viewpoint.'}
];
projects.unshift({id:'aimpower',title:'AImpower',type:'UI/UX & accessibility',year:'2025',cover:'assets/aimpower/cover.webp',private:false,summary:'A Zoom + Web system for stutter-affirming progress.'});
projects.push({id:'lexicon',title:'The Lexicon of Wish',type:'Design Research',cover:'assets/lexicon/cover.png',private:false});
projects.push({id:'quipu',title:'Quipu',type:'Design Research',cover:'assets/quipu/09.png',private:false});
const notes=[
 {id:'melodeck',title:'Melodeck',year:'2024',type:'Product Design',cover:'assets/melodeck/01.png',back:'assets/melodeck/04.png',description:'A skateboard that turns city surfaces into sound.'},
 {id:'company',title:'Company',year:'2022',type:'Poster Design',cover:'assets/company/01.png',single:true,description:'Fifty years of a musical, explored through visual information design.'},
 {id:'gpixel',title:'G-PIXEL',year:'2022',type:'Brand Design',cover:'assets/gpixel/gallery-front.png',back:'assets/gpixel/gallery-back.png'},
 {id:'quipu',title:'Quipu',year:'2024',type:'Design Research',cover:'assets/quipu/09.png',back:'assets/quipu/12.png',description:'Recorded physically. Stored digitally.'},
 {id:'lexicon',title:'The Lexicon of Wish',year:'2023',type:'Design Research',cover:'assets/lexicon/cover.png',back:'assets/lexicon/hy-lab/Plant3_edited.png',description:'Giving contemporary wishes a new visual language.'},
 {id:'steampunk',title:'Steampunk',year:'2022',type:'Poster Design',cover:'assets/steampunk/01.png',single:true,description:'Steam aesthetics meet Victorian elegance.'},
 {id:'ultravision',title:'Ultra Vision',year:'2022',type:'Car Interior & Interaction Design',cover:'assets/ultravision/08.png',back:'assets/ultravision/24.png',description:'Making driving information part of the interior.'},
 {id:'gofie',title:'Gofie',year:'2023',type:'UI/UX Design',cover:'assets/gofie/11.png',back:'assets/gofie/14.png',description:'A more approachable way to play golf.'},
 {id:'ariel',title:'Ariel',year:'2022',type:'Service Design',cover:'assets/ariel/09.png',back:'assets/ariel/23.png',description:'Connecting marine waste to a circular service.'}
];
projects.push(...notes.filter(n=>['ultravision','gofie','ariel','melodeck'].includes(n.id)));
let category='design',page='home',unlocked=false,pending=null,year='all',active=0,arrangement='arc',angle=0,targetAngle=0,orbitFrame=0,filmDistance=0,filmFrame=0,drag=null,moved=false,canvas={x:0,y:0},returnFocus=null,homeScroll=0;
try{unlocked=sessionStorage.getItem('wenjia-visual-unlocked')==='yes';}catch{}
const selected=()=>category==='design'?projects.filter(p=>!['lexicon','quipu'].includes(p.id)):projects.filter(p=>['lexicon','quipu'].includes(p.id));
const visibleNotes=()=>notes.filter(n=>year==='all'||n.year===year);
const locked=p=>p.private&&!unlocked;
const picture=(p,cls)=>`<div class="${cls} ${locked(p)?'locked':''}">${p.video?`<video class="project-preview-video" data-auto-preview muted loop playsinline preload="none" poster="${p.cover}" src="${p.video}" aria-label="${p.title} video preview"></video>`:`<img src="${p.cover||`assets/study-${p.asset}.svg`}" alt="${p.cover?p.title:`Illustrative ${p.type.toLowerCase()}`}" draggable="false">`}${locked(p)?'<span class="locked-mark"><span>Private ↗</span></span>':''}</div>`;
let previewObserver=null;
function observeProjectVideos(){
 previewObserver?.disconnect();
 previewObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{const v=entry.target;if(entry.isIntersecting&&!reduced.matches&&!document.hidden&&!v.dataset.userControlled){v.muted=true;v.play().catch(()=>{});}else if(!entry.isIntersecting||document.hidden){v.pause();}}),{threshold:.2});
 $$('video[data-auto-preview]').forEach(v=>{previewObserver.observe(v);});
}
document.addEventListener('pointerdown',e=>{if(e.target.matches('video[controls]'))e.target.dataset.userControlled='true';});
document.addEventListener('visibilitychange',()=>{if(document.hidden)$$('video').forEach(v=>v.pause());else observeProjectVideos();});
reduced.addEventListener('change',()=>{if(reduced.matches)$$('video').forEach(v=>v.pause());observeProjectVideos();});

function renderWork(){renderEditorialHome();$('#access').textContent=unlocked?'Access granted · Reset':'Private access';requestAnimationFrame(observeProjectVideos);}
function requestUnlock(action){pending=action;$('#password').value='';$('#password-error').textContent='';$('#password-dialog').showModal();}
$('#password-close').onclick=()=>$('#password-dialog').close();
$('#password-dialog').addEventListener('close',()=>{pending=null;});
$('#password-form').onsubmit=e=>{e.preventDefault();if($('#password').value!=='preview'){$('#password-error').textContent='Use “preview” for this visual study.';return;}unlocked=true;try{sessionStorage.setItem('wenjia-visual-unlocked','yes');}catch{}const next=pending;pending=null;$('#password-dialog').close();renderWork();renderArchive();if(next)next();};
$('#access').onclick=()=>{if(!unlocked){requestUnlock(null);return;}unlocked=false;try{sessionStorage.removeItem('wenjia-visual-unlocked');}catch{}closeNote();if(page==='project')location.hash='home';renderWork();renderArchive();};
function openProject(id){const p=projects.find(p=>p.id===id);if(!p)return;if(locked(p))return requestUnlock(()=>openProject(id));location.hash=`project/${id}`;}
function projectMarkup(p){if(p.id==='aimpower'){$('#project-content').innerHTML=aimpowerMarkup();return;}if(['ultravision','gofie','ariel','melodeck'].includes(p.id)){$('#project-content').innerHTML=p.id==='melodeck'?melodeckMarkup():importedArchiveMarkup(p.id);return;}if(p.id==='quipu'){$('#project-content').innerHTML=quipuMarkup();return;}if(p.id==='lexicon'){$('#project-content').innerHTML=lexiconMarkup();return;}$('#project-content').innerHTML=`<div class="project-layout"><div><h1>${p.title}</h1><p class="project-summary">${p.type}</p><img src="assets/study-${p.asset}.svg" alt="Illustrative project cover"></div><aside class="project-description"><h2>${p.summary}</h2><p>This space will hold the project context, your role and the decisions behind the work. Images and process can continue down the left column.</p><dl><div><dt>Discipline</dt><dd>${p.type}</dd></div><div><dt>Access</dt><dd>${p.private?'Shared privately':'Public'}</dd></div></dl><p class="draft-note">Illustrative content for this visual exploration. This is not a real project or a verified claim about Wenjia’s work.</p><a class="inline-link" href="#home">Selected work ↗</a></aside></div>`;}
function route(){
 const hash=location.hash.slice(1)||'home',id=hash.startsWith('project/')?hash.slice(8):null;
 const dest=id?'project':['home','archive','about'].includes(hash)?hash:'home';
 if(id){const p=projects.find(p=>p.id===id);if(!p){location.hash='home';return;}if(locked(p)){history.replaceState(null,'','#home');showPage('home');requestUnlock(()=>openProject(id));return;}projectMarkup(p);}
 showPage(dest);
}
function showPage(dest){$$('video').forEach(v=>v.pause());stopLexiconMotion();if(page==='home'&&dest!=='home')homeScroll=scrollY;closeNote();page=dest;document.body.dataset.page=page;$$('.page').forEach(p=>p.hidden=p.id!==page);$$('.site-header nav a, #tool-menu nav a').forEach(a=>{const current=a.hash==='#'+(page==='project'?'home':page);if(current)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});closeTools();scrollTo({top:0,behavior:'instant'});requestAnimationFrame(()=>{if(page==='home'){measureFilm();scrollTo({top:homeScroll,behavior:'instant'});}if(page==='archive'){renderArchive();}if(page==='about'){enterAbout();}if(page==='project'&&$('.lexicon-case'))startLexiconMotion();observeProjectVideos();configureProjectTools();if(page==='project'&&$('.aimpower-case'))startAimpowerInteractions();updateTools();});}
window.addEventListener('hashchange',route);$('#project-back').onclick=()=>{location.hash='home';};
document.addEventListener('click',e=>{const p=e.target.closest('[data-project]');if(p)openProject(p.dataset.project);const cat=e.target.closest('[data-category]');if(cat){unfoldWork(cat);}const arr=e.target.closest('[data-arrangement]');if(arr){arrangement=arr.dataset.arrangement;$$('[data-arrangement]').forEach(b=>b.setAttribute('aria-pressed',b===arr));canvas={x:0,y:0};renderArchive();}const yr=e.target.closest('[data-year]');if(yr){year=yr.dataset.year;active=0;angle=targetAngle=0;$$('[data-year]').forEach(b=>b.setAttribute('aria-pressed',b===yr));renderArchive();}});
let filmPosition=0,filmTime=0,filmPlan=null;
function renderFilmTracks(){
 const existing=$('#research-exhibition');
 if(!existing){const panel=document.createElement('div');panel.id='research-exhibition';panel.className='sequence-panel';panel.innerHTML='<div class="film-window" tabindex="0" aria-label="Research projects; use left and right arrow keys"><div id="research-track" class="sequence-track"></div></div>';document.querySelector('[data-category="research"]').after(panel);}
 $('#work-exhibition').classList.add('sequence-panel');$('#film-track').classList.add('sequence-track');
 for(const group of ['design','research']){
 const track=group==='design'?$('#film-track'):$('#research-track');
 track.innerHTML=projects.filter(p=>group==='design'?!['lexicon','quipu'].includes(p.id):['lexicon','quipu'].includes(p.id)).map(p=>`<article class="film-card"><button data-project="${p.id}" aria-label="${locked(p)?'Unlock':'Open'} ${p.title}">${picture(p,'film-image')}<div class="film-caption"><span>${p.title}</span><span aria-hidden="true">↗</span></div></button></article>`).join('');
 const viewport=track.parentElement;
 viewport.onkeydown=e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();const dir=e.key==='ArrowLeft'?-1:1;if(sequenceEnabled()&&filmPlan){const offset=group==='design'?0:filmPlan.researchStart;const distance=group==='design'?filmPlan.designDistance:filmPlan.researchDistance;const top=scrollY+$('#filmstrip').getBoundingClientRect().top;scrollTo({top:top+offset+clamp(scrollY-top-offset+dir*(track.firstElementChild.offsetWidth+30),0,distance),behavior:'smooth'});}else viewport.scrollBy({left:dir*viewport.clientWidth*.8,behavior:reduced.matches?'instant':'smooth'});}};
 track.onfocusin=e=>{if(!sequenceEnabled()||!filmPlan)return;const card=e.target.closest('.film-card');if(!card)return;const offset=group==='design'?0:filmPlan.researchStart;const max=group==='design'?filmPlan.designDistance:filmPlan.researchDistance;const top=scrollY+$('#filmstrip').getBoundingClientRect().top;const r=card.getBoundingClientRect(),v=viewport.getBoundingClientRect();if(r.left<v.left||r.right>v.right)scrollTo({top:top+offset+clamp(card.offsetLeft,0,max),behavior:'instant'});};
 }
}
function sequenceEnabled(){return desktop.matches&&!reduced.matches;}
function measureFilm(){
 if(page!=='home'||!$('#research-track'))return;
 const section=$('#filmstrip'),design=$('#work-exhibition'),research=$('#research-exhibition');
 section.classList.remove('folded');design.hidden=false;research.hidden=false;
 section.classList.toggle('scroll-sequence',sequenceEnabled());
 const designDistance=Math.max(0,$('#film-track').scrollWidth-design.clientWidth);
 const researchDistance=Math.max(0,$('#research-track').scrollWidth-research.clientWidth);
 const hold=clamp(innerHeight*.18,100,200),transition=clamp(innerHeight*.7,420,750);
 filmPlan={designDistance,researchDistance,hold,transition,transitionStart:designDistance+hold,researchStart:designDistance+hold+transition,designHeight:design.firstElementChild.offsetHeight+46,researchHeight:research.firstElementChild.offsetHeight+46};
 filmDistance=filmPlan.researchStart+researchDistance+hold;
 section.style.height=sequenceEnabled()?`${$('.film-pin').offsetHeight+filmDistance}px`:'auto';
 cancelAnimationFrame(filmFrame);filmFrame=0;filmTime=0;
 // Measure without easing after resize or route restoration.
 filmPosition=clamp(-section.getBoundingClientRect().top,0,filmDistance);
 paintFilm();scheduleFilm();
}
function paintFilm(){
 if(!filmPlan)return;
 const d=$('#work-exhibition'),r=$('#research-exhibition'),enabled=sequenceEnabled();
 const raw=enabled?clamp((filmPosition-filmPlan.transitionStart)/filmPlan.transition,0,1):1;
 const blend=raw*raw*(3-2*raw);
 d.style.height=enabled?`${filmPlan.designHeight*(1-blend)}px`:'';
 r.style.height=enabled?`${filmPlan.researchHeight*blend}px`:'';
 d.style.opacity=enabled?String(1-clamp(blend*1.7,0,1)):'';
 r.style.opacity=enabled?String(clamp((blend-.2)/.8,0,1)):'';
 d.inert=enabled&&blend>.75;r.inert=enabled&&blend<.75;
 $('#film-track').style.transform=enabled?`translate3d(${-clamp(filmPosition,0,filmPlan.designDistance)}px,0,0)`:'';
 $('#research-track').style.transform=enabled?`translate3d(${-clamp(filmPosition-filmPlan.researchStart,0,filmPlan.researchDistance)}px,0,0)`:'';
 for(const group of ['design','research']){const button=document.querySelector(`[data-category="${group}"]`);const open=!enabled||(group==='design'?blend<.5:blend>=.5);button.setAttribute('aria-expanded',open);button.setAttribute('aria-label',`View ${group} projects`);button.querySelector('.fold-action').textContent=open?'−':'+';button.setAttribute('aria-controls',group==='design'?'work-exhibition':'research-exhibition');}
 const video=r.querySelector('video');if(video&&enabled&&blend<.2&&!video.paused)video.pause();
}
function updateFilm(time=performance.now()){
 filmFrame=0;if(page!=='home'||!filmPlan){filmTime=0;return;}
 const target=clamp(-$('#filmstrip').getBoundingClientRect().top,0,filmDistance);
 const dt=filmTime?Math.min(64,time-filmTime):16.7;filmTime=time;
 filmPosition+=(target-filmPosition)*(1-Math.exp(-dt/85));
 if(Math.abs(target-filmPosition)<.2)filmPosition=target;
 paintFilm();if(Math.abs(target-filmPosition)>.2)filmFrame=requestAnimationFrame(updateFilm);else filmTime=0;
}
function scheduleFilm(){if(!filmFrame)filmFrame=requestAnimationFrame(updateFilm);}
window.addEventListener('scroll',scheduleFilm,{passive:true});
function renderArchive(){
 cancelAnimationFrame(orbitFrame);orbitFrame=0;
 const years=[...new Set(notes.map(n=>n.year))].sort((a,b)=>Number(b)-Number(a));
 if(year!=='all'&&!years.includes(year))year='all';
 $('.years').innerHTML=['all',...years].map(y=>`<button data-year="${y}" aria-pressed="${y===year}">${y==='all'?'All':y}</button>`).join('');
 const list=visibleNotes();active=clamp(active,0,Math.max(0,list.length-1));angle=targetAngle=active;
$('.archive-space').dataset.arrangement=arrangement;$('#orbit').innerHTML=list.map((n,i)=>{const front=n.cover||`assets/study-${n.asset}.svg`;const back=n.back||(n.id==='melodeck'?'assets/melodeck/04.png':n.id==='gpixel'?'assets/gpixel/12.png':(n.id==='company'||n.single)?front:`assets/study-${n.asset%4+1}.svg`);return `<button class="orbit-note photo-note ${n.id==='lexicon'?'lexicon-note':n.id==='steampunk'?'poster-note':n.id==='gpixel'?'square-note':n.id==='gofie'?'gofie-note':n.id==='company'?'company-note':''} ${(n.id==='company'||n.single)?'single-photo':'paired-photos'} ${locked(n)?'locked':''}" style="--photo-width:${[235,225,210,230][i%4]}px;--photo-height:${[158,165,175,155][i%4]}px;--back-angle:${i%2?7:-7}deg" data-orbit="${i}" aria-label="${n.title}${locked(n)?', private':''}" aria-pressed="${i===active}"><span class="photo-stack">${(n.id==='company'||n.single)?'':`<span class="stack-photo photo-back"><img src="${back}" alt="" draggable="false"></span>`}<span class="stack-photo photo-front"><img src="${front}" alt="${n.cover?n.title:'Illustrative archive image'}" draggable="false">${locked(n)?'<span class="locked-mark"><span>Private ↗</span></span>':''}</span></span></button>`;}).join('');$('#archive-list').innerHTML=list.map((n,i)=>`<button class="archive-choice" data-choice="${i}" aria-current="${active===i}">${n.title}${locked(n)?'<span class="private-symbol">⌑</span>':''}</button>`).join('');$$('[data-choice]').forEach(b=>b.onclick=()=>selectNote(Number(b.dataset.choice)));$$('[data-orbit]').forEach(b=>b.onclick=()=>{if(moved)return;const i=Number(b.dataset.orbit);if(i===active)openNote();else selectNote(i);});attachArchivePressure();updateCaption();positionOrbit();}
function resetArchivePressure(button){
 button.style.setProperty('--press-x','0deg');button.style.setProperty('--press-y','0deg');button.style.setProperty('--press-z','0px');button.style.setProperty('--shadow-x','5px');button.style.setProperty('--shadow-y','9px');button.classList.remove('is-pressed');
}
function attachArchivePressure(){
 $$('[data-orbit]').forEach(button=>{
 button.onpointermove=e=>{
 if(e.pointerType!=='mouse'||reduced.matches||drag){resetArchivePressure(button);return;}
 const r=button.getBoundingClientRect();
 const x=clamp((e.clientX-r.left)/r.width*2-1,-1,1),y=clamp((e.clientY-r.top)/r.height*2-1,-1,1);
 button.style.setProperty('--press-x',`${-y*9}deg`);button.style.setProperty('--press-y',`${x*9}deg`);button.style.setProperty('--press-z','-5px');
 button.style.setProperty('--shadow-x',`${5-x*4}px`);button.style.setProperty('--shadow-y',`${9-y*4}px`);
 };
 button.onpointerleave=()=>resetArchivePressure(button);
 button.onpointerdown=e=>{if(e.pointerType==='mouse'&&!reduced.matches)button.classList.add('is-pressed');};
 button.onpointerup=()=>button.classList.remove('is-pressed');
 button.onpointercancel=()=>resetArchivePressure(button);
 button.onblur=()=>resetArchivePressure(button);
 });
}
function updateCaption(){const list=visibleNotes(),n=list[active];$('#open-note').disabled=!n;if(!n){$('#note-title').textContent='';$('#note-type').textContent='';$('#note-year').textContent='';$('#note-description').hidden=true;return;}$('#note-description').textContent=n.description||'';$('#note-description').hidden=!n.description;$('#note-title').textContent=n.title;$('#note-type').textContent=n.type;$('#note-year').textContent=n.year+(locked(n)?' · Private':'');$('#open-note').textContent=locked(n)?'Unlock note ↗':'Open note ↗';$$('[data-choice]').forEach((b,i)=>b.setAttribute('aria-current',i===active));$$('[data-orbit]').forEach((b,i)=>{b.classList.toggle('active',i===active);b.setAttribute('aria-pressed',i===active);});}
function selectNote(i){if(!visibleNotes().length)return;$$('[data-orbit]').forEach(resetArchivePressure);active=clamp(i,0,visibleNotes().length-1);targetAngle=active;updateCaption();if(arrangement==='canvas'){const stage=$('#archive-stage');canvas.x=stage.clientWidth/2-((active%3)*205+45)-75;canvas.y=stage.clientHeight/2-(Math.floor(active/3)*180+40)-50;positionOrbit();}else animateOrbit();}
function positionOrbit(){
 if(page!=='archive')return;const stage=$('#archive-stage'),w=stage.clientWidth,h=stage.clientHeight;if(!w||!h)return;
 $$('[data-orbit]').forEach((b,i)=>{
 const diff=i-angle,r=Math.max(370,h*.92),theta=diff*.58,x=w*.53-r+r*Math.cos(theta),y=h*.5+r*Math.sin(theta);
 b.style.transform=`translate(${x-b.offsetWidth/2}px,${y-b.offsetHeight/2}px) rotate(${diff*6}deg)`;
 b.style.opacity=Math.max(.35,1-Math.abs(diff)*.16);b.style.visibility=Math.abs(diff)>2.8?'hidden':'visible';b.style.zIndex=String(20-Math.round(Math.abs(diff)*3));
 });
 window.edgeGlassRenderNow?.();
}
function animateOrbit(){cancelAnimationFrame(orbitFrame);if(reduced.matches){angle=targetAngle;positionOrbit();return;}function tick(){if(page!=='archive')return;angle+=(targetAngle-angle)*.11;positionOrbit();if(Math.abs(targetAngle-angle)>.001)orbitFrame=requestAnimationFrame(tick);else{angle=targetAngle;positionOrbit();}}orbitFrame=requestAnimationFrame(tick);}
$('#open-note').onclick=openNote;
function openNote(){const n=visibleNotes()[active];if(!n)return;if(locked(n))return requestUnlock(openNote);returnFocus=document.activeElement;$('#note-reading-content').innerHTML=['quipu','lexicon'].includes(n.id)?researchArchiveMarkup(n.id):n.id==='melodeck'?melodeckMarkup():['company','gpixel','steampunk','ultravision','gofie','ariel'].includes(n.id)?importedArchiveMarkup(n.id):`<div class="note-layout"><div><img src="assets/study-${n.asset}.svg" alt="Illustrative ${n.type.toLowerCase()}"><img src="assets/study-${n.asset%4+1}.svg" alt="Additional illustrative study"></div><div class="note-copy"><p class="small">${n.type} · ${n.year}</p><h2>${n.title}</h2><p>A place for an observation, an experiment, or something still in progress. A short description and the images stay together, without another page to navigate.</p><p class="draft-note">Illustrative archive content. The actual note, dates and images will be replaced with your material.</p></div></div>`;$('#note-reading').hidden=false;$('#note-reading').scrollTop=0;$('#archive').querySelector('.archive-space').inert=true;$('.site-header').inert=true;$('.archive-top').inert=true;$('.page-tools').inert=false;document.body.style.overflow='hidden';buildReadingIndex();configureProjectTools();updateTools();$('#close-note').focus({preventScroll:true});}
function closeNote(){if($('#note-reading').hidden)return;$('#note-reading').hidden=true;$('.archive-space').inert=false;$('.site-header').inert=false;$('.archive-top').inert=false;$('.page-tools').inert=false;document.body.style.overflow='';configureProjectTools();updateTools();returnFocus?.focus({preventScroll:true});window.edgeGlassRefresh?.();}
$('#close-note').onclick=closeNote;window.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#note-reading').hidden){if(!$('#tool-menu').hidden){closeTools();$('#tool-toggle').focus();}else closeNote();return;}if(!$('#note-reading').hidden&&e.key==='Tab'){const items=[...$('#note-reading').querySelectorAll('button,a[href],input,[tabindex="0"]'),...$('.page-tools').querySelectorAll('button,a[href]')].filter(e=>e.getClientRects().length&&!e.closest('[hidden]'));const first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
$('#archive-stage').onkeydown=e=>{if(['ArrowLeft','ArrowUp','ArrowRight','ArrowDown'].includes(e.key)){e.preventDefault();selectNote(active+(['ArrowLeft','ArrowUp'].includes(e.key)?-1:1));}};
let wheelSum=0,wheelTime=0;$('#archive-stage').addEventListener('wheel',e=>{if(arrangement!=='arc')return;e.preventDefault();const now=performance.now();if(now-wheelTime>180)wheelSum=0;wheelTime=now;wheelSum+=e.deltaY||e.deltaX;if(Math.abs(wheelSum)>65){selectNote(active+Math.sign(wheelSum));wheelSum=0;}},{passive:false});
$('#archive-stage').onpointerdown=e=>{drag={x:e.clientX,y:e.clientY,index:active,cx:canvas.x,cy:canvas.y};moved=false;};window.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>7)moved=true;if(!moved)return;if(arrangement==='canvas'){canvas.x=clamp(drag.cx+dx,-650,200);canvas.y=clamp(drag.cy+dy,-550,200);positionOrbit();}else{targetAngle=clamp(drag.index-dy/170,0,visibleNotes().length-1);angle=targetAngle;active=Math.round(angle);cancelAnimationFrame(orbitFrame);updateCaption();positionOrbit();}});window.addEventListener('pointerup',()=>{if(drag&&arrangement==='arc'){targetAngle=active;animateOrbit();}drag=null;setTimeout(()=>moved=false,0);});window.addEventListener('pointercancel',()=>{drag=null;});
function resize(){measureFilm();positionOrbit();}window.addEventListener('resize',resize);reduced.addEventListener('change',resize);desktop.addEventListener('change',resize);document.fonts.ready.then(resize);
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.15});$$('.reveal').forEach(el=>{el.classList.add('pending');observer.observe(el);});
function unfoldWork(button){
 category=button.dataset.category;
 if(sequenceEnabled()&&filmPlan){const top=scrollY+$('#filmstrip').getBoundingClientRect().top;scrollTo({top:top+(category==='research'?filmPlan.researchStart:0),behavior:'smooth'});}
 else{const panel=category==='design'?$('#work-exhibition'):$('#research-exhibition');panel.scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'center'});}
}
function readingScroller(){return $('#note-reading').hidden?null:$('#note-reading');}
function buildReadingIndex(){
 const root=$('#note-reading-content');
 const first=root.firstElementChild;if(!first)return;
 first.id='reading-overview';first.dataset.projectIndex='Overview';
 const headings=[...root.querySelectorAll('h2,h3')].filter(h=>!h.closest('.note-copy'));
 let targets=headings.map(h=>{const section=h.closest('section');return {element:section&&root.contains(section)?section:h,label:h.textContent.replace(/\s+/g,' ').trim()};});
 if(!targets.length)targets=[...root.querySelectorAll('.archive-image-group, .melodeck-images>img')].map((element,i)=>({element,label:`Image ${String(i+1).padStart(2,'0')}`}));
 const seen=new Set([first]);targets.forEach(({element,label},i)=>{if(seen.has(element)||!label)return;seen.add(element);element.id=`reading-section-${i}`;element.dataset.projectIndex=label;});
}
let projectIndexSections=[],projectIndexFrame=0;
const defaultToolNavigation='<nav aria-label="Quick navigation"><a href="#home">Work</a><a href="#archive">Archive</a><a href="#about">About</a></nav>';
function configureProjectTools(){
 if(projectIndexFrame)cancelAnimationFrame(projectIndexFrame);projectIndexFrame=0;
 const reading=readingScroller();const content=reading?$('#note-reading-content'):page==='project'?$('#project-content'):null;
 projectIndexSections=content?[...content.querySelectorAll('[data-project-index]')]:[];
 const indexed=projectIndexSections.length>0;
 $('.page-tools').classList.toggle('is-project-index',indexed);
 $('.page-tools').setAttribute('aria-label',indexed?'Project chapter navigation':'Page navigation');
 $('#tool-toggle').textContent=indexed?'Index':'Menu';
 $('#tool-toggle').setAttribute('aria-label',indexed?'Open project index':'Page navigation');
 const menu=$('#tool-menu');menu.replaceChildren();
 if(indexed){
  const nav=document.createElement('nav');nav.setAttribute('aria-label','Project index');
  const title=document.createElement('span');title.className='project-index-title';title.textContent=(reading?visibleNotes()[active]?.title:content?.querySelector('h1,h2')?.textContent)||'PROJECT';title.textContent+=' / INDEX';nav.append(title);
  projectIndexSections.forEach((section,index)=>{const button=document.createElement('button');button.dataset.section=section.id;const number=document.createElement('span');number.textContent=String(index).padStart(2,'0');button.append(number,document.createTextNode(section.dataset.projectIndex));nav.append(button);});menu.append(nav);updateProjectIndex();
 }else menu.innerHTML=defaultToolNavigation;
}
function updateProjectIndex(){
 projectIndexFrame=0;if(!projectIndexSections.length)return;
 let current=projectIndexSections[0];const line=Math.min(180,innerHeight*.25);
 for(const section of projectIndexSections){if(section.getBoundingClientRect().top<=line)current=section;else break;}
 const reading=readingScroller();const top=reading?reading.scrollTop:scrollY,height=reading?reading.clientHeight:innerHeight,total=reading?reading.scrollHeight:document.documentElement.scrollHeight;if(height+top>=total-3)current=projectIndexSections.at(-1);
 document.querySelectorAll('#tool-menu [data-section]').forEach(button=>{if(button.dataset.section===current.id)button.setAttribute('aria-current','location');else button.removeAttribute('aria-current');});
 $('#tool-toggle').title=current.dataset.projectIndex;
}
function closeTools(){$('#tool-menu').hidden=true;$('#tool-toggle').setAttribute('aria-expanded','false');}
function openTools(){$('#tool-menu').hidden=false;$('#tool-toggle').setAttribute('aria-expanded','true');}
function updateTools(){const visible=!!readingScroller()||scrollY>140||page==='project';$('.page-tools').hidden=!visible;if(!visible)closeTools();if(projectIndexSections.length&&!projectIndexFrame)projectIndexFrame=requestAnimationFrame(updateProjectIndex);}
$('.tool-disclosure').addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')openTools();});
$('.tool-disclosure').addEventListener('pointerleave',()=>{if(!$('.tool-disclosure').contains(document.activeElement))closeTools();});
$('.tool-disclosure').addEventListener('focusout',e=>{if(!$('.tool-disclosure').contains(e.relatedTarget))closeTools();});
$('#tool-toggle').onclick=()=>{$('#tool-menu').hidden?openTools():closeTools();};
$('#tool-top').onclick=()=>{closeTools();const target=readingScroller()||window;target.scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'});};
$('#tool-menu').onclick=e=>{const chapter=e.target.closest('[data-section]');if(chapter){const section=document.getElementById(chapter.dataset.section);closeTools();section?.scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});return;}const link=e.target.closest('a');if(link){closeTools();if(link.hash===location.hash)scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'});}};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#tool-menu').hidden){closeTools();$('#tool-toggle').focus();}});
document.addEventListener('click',e=>{if(!e.target.closest('.tool-disclosure'))closeTools();});
window.addEventListener('scroll',updateTools,{passive:true});$('#note-reading').addEventListener('scroll',updateTools,{passive:true});window.addEventListener('hashchange',()=>requestAnimationFrame(updateTools));
function enterAbout(){
 const curtain=$('.about-curtain');curtain.getAnimations().forEach(a=>a.cancel());
 if(reduced.matches)return;
 curtain.animate([{transform:'scaleX(1)'},{transform:'scaleX(0)'}],{duration:620,easing:'cubic-bezier(.76,0,.24,1)'});
 $$('.bio-intro,.bio-history,.bio-interests').forEach((el,i)=>{el.getAnimations().forEach(a=>a.cancel());el.animate([{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'translateY(0)'}],{duration:620,delay:180+i*100,fill:'backwards',easing:'cubic-bezier(.22,1,.36,1)'});});
}
history.scrollRestoration='manual';
scrollTo({top:0,behavior:'instant'});
queueMicrotask(()=>{renderWork();route();updateTools();});
let initialScrollUntouched=true;
['wheel','touchstart','pointerdown','keydown'].forEach(type=>window.addEventListener(type,()=>{initialScrollUntouched=false;},{once:true,passive:true}));
window.addEventListener('load',()=>{if(initialScrollUntouched){homeScroll=0;scrollTo({top:0,behavior:'instant'});requestAnimationFrame(()=>{if(initialScrollUntouched){scrollTo({top:0,behavior:'instant'});updateTools();}});}},{once:true});

function melodeckMarkup(){
 const img=(number,alt)=>`<img src="assets/melodeck/${String(number).padStart(2,'0')}.png" alt="${alt}" loading="${number===1?'eager':'lazy'}" decoding="async">`;
 return `<article class="note-layout imported-project"><div class="melodeck-images">
 ${img(1,'Melodeck project cover')}${img(2,'Melodeck skateboard design')}
 <section class="project-story"><h3>Soundscape</h3><p>Inspired by fixed reed instruments, we use the soundproof wheel and electric skateboard to make the skateboard an musical instrument, so as to show the bond with the city surface.</p></section>
 ${img(3,'Melodeck soundscape study')}
 <section class="project-story"><p>The music is produced using aerodynamic principles related to the tunnels under the skateboard.</p><p>The timbre is changed according to the surface, the same as the original skateboard features.</p><p>It's the wind who finally cause vibrations to the reeds, so skateboarders need to utilse the wind while playing the skateboard.</p><p>Just like playing a harmonica, skateboarders can use their feet to control the holes, so as to make different sounds.</p></section>
 ${[4,5,6,7].map((n,i)=>img(n,`Melodeck project rendering ${i+1}`)).join('')}
 <p class="render-credit">Rendered by Jiancheng Qiu</p>
 ${img(8,'Melodeck project detail')}${img(9,'Melodeck project study')}
 </div><div class="note-copy"><p class="small">Product Design · 2024</p><h2>Melodeck</h2><h3 class="melodeck-subtitle">Activate city surfaces with sound</h3><p>The surfaces and materials of the city are looked at in a systematic way by skateboarders.</p><p>The skateboard, like a musical instrument, can be tuned to resonate most directly with the surface substrate it is stepping on.</p><dl class="melodeck-meta"><div><dt>Period</dt><dd>March – June 2024</dd></div><div><dt>Collaborators</dt><dd>Yuqing Wu, Jiancheng Qiu</dd></div></dl><p class="melodeck-tags">Multisensory Design · Soundscape</p><a class="inline-link" href="https://www.wenjiashi.space/melodeck" target="_blank" rel="noopener noreferrer">Original project ↗</a></div></article>`;
}

const importedArchiveData={
  "company": {
    "title": "Company",
    "type": "Poster Design",
    "year": "2022",
    "date": "December 2022",
    "cover": "01.png",
    "intro": [
      "Using the method of visual information design, this poster describes the  changes of the musical Company in the past 50 years"
    ],
    "tags": "Visual Communication · Musical",
    "blocks": [
      {
        "kind": "images",
        "files": [
          "01.png"
        ]
      },
      {
        "kind": "quote",
        "text": "I wanted it to be meaningful. I wanted to modernize it. Because I  think that theater has to speak to the now.",
        "credit": "Marianne Elliott / Director"
      },
      {
        "kind": "heading",
        "text": "What is -Company?"
      },
      {
        "kind": "text",
        "text": "Three-time Tony Award-winning director Marianne Elliott helms this  revelatory new production of Stephen  Sondheim and George Furth’s groundbreaking  musical comedy, at once boldly sophisticated,  deeply insightful, and downright hilarious."
      },
      {
        "kind": "text",
        "text": "The genders of the leading roles have all changed in the  2022 version"
      },
      {
        "kind": "heading",
        "text": "What is -The Difference?"
      },
      {
        "kind": "text",
        "text": "The play was written in 1970. People were much more concerned with  people who weren’t married. Now a 35-year-old  unmarried man wouldn’t be a source of drama or  worry for anybody these days.  The theme and idea of being a woman and not  necessarily wanting to get married and feeling  ambivalent about relationships--that’s all very familiar  contemporary reality.  How it would actually influence the work not just for  this production, but sort of retroactively for the piece  as a whole."
      },
      {
        "kind": "heading",
        "text": "What the -Work?"
      },
      {
        "kind": "heading",
        "text": "Collage         ......         Pop-up"
      },
      {
        "kind": "text",
        "text": "The page as a whole is a comparison of the old and new versions of the COMPANY from left to right, the content is a comparison of the musical content, and  the form of the representative style of the two periods  is also compared. On the left is the collage style  representing the retro American style. The raw edge  effect has the feeling of being old. Paper notes and tapes  are typical things.  On the right is the modern style typesetting, with pop up Windows and bubbles emerging to break through the  limitations of paper background, in sharp contrast to the  right, which also shows the characteristics of this age"
      }
    ]
  },
  "gpixel": {
    "title": "G-PIXEL",
    "type": "Brand Design",
    "year": "2022",
    "date": "December 2022",
    "cover": "16.png",
    "intro": [
      "Today's planting is no longer a simple decoration of the past, it represents a sense of the aesthetics of life.",
      "G-PIXEL offer a green plant trade for young people and promote a green and natural lifestyle"
    ],
    "tags": "Visual Communication · Brand",
    "blocks": [
      {
        "kind": "images",
        "files": [
          "16.png"
        ]
      },
      {
        "kind": "heading",
        "text": "A green pixel in your life."
      },
      {
        "kind": "images",
        "files": [
          "01.png",
          "02.png"
        ]
      },
      {
        "kind": "heading",
        "text": "What is G-PIXEL?"
      },
      {
        "kind": "text",
        "text": "G-PIXEL stands for plants, the green pixels of life. Even though it is only a small green dot, it  still shows infinite vitality and vitality."
      },
      {
        "kind": "text",
        "text": "G-PIXEL offers a range of green plants popular  with young people. With the characteristics of easy  maintenance, freshness and vitality, we provide plant  maintenance guidance, plant sales, gardening tools  and other services. The main characteristic plants are  chlorella, mint, cactus and so on. It is mainly sold by  online shops"
      },
      {
        "kind": "images",
        "files": [
          "03.png"
        ]
      },
      {
        "kind": "heading",
        "text": "Icon / Variant"
      },
      {
        "kind": "text",
        "text": "Chlorella and Pixel font."
      },
      {
        "kind": "text",
        "text": "Chlorella morphology changes in different seasons, which is the characteristic of plants."
      },
      {
        "kind": "text",
        "text": "The logo of G-p also changes in different seasons"
      },
      {
        "kind": "images",
        "files": [
          "04.png"
        ]
      },
      {
        "kind": "images",
        "files": [
          "05.png",
          "06.png",
          "07.png",
          "08.png"
        ]
      },
      {
        "kind": "images",
        "files": [
          "09.png"
        ]
      },
      {
        "kind": "heading",
        "text": "Label / Web"
      },
      {
        "kind": "text",
        "text": "G-PIXEL's main marketing mode is online sales.  WEB side provides plant selection, community  communication, plant science and other content."
      },
      {
        "kind": "text",
        "text": "Stickers on the package."
      },
      {
        "kind": "images",
        "files": [
          "10.png",
          "11.png"
        ]
      },
      {
        "kind": "images",
        "files": [
          "12.png"
        ]
      },
      {
        "kind": "images",
        "files": [
          "13.png",
          "14.png",
          "15.png"
        ]
      }
    ]
  }
};

function importedArchiveMarkup(id){
 if(id==='gofie')return gofieArchiveMarkup();
 const data=importedArchiveData[id];
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const blocks=data.blocks.map((block,index)=>{
 if(block.kind==='images')return `<div class="archive-image-group count-${block.files.length}">${block.files.map((file,i)=>`<img src="assets/${id}/${file}" alt="${escape(data.title)} — project image ${file.slice(0,2)}" loading="${index===0&&i===0?'eager':'lazy'}" decoding="async">`).join('')}</div>`;
 if(block.kind==='heading')return `<h3 class="import-section-title">${escape(block.text)}</h3>`;
 if(block.kind==='quote')return `<blockquote class="import-quote"><p>${escape(block.text)}</p><cite>${escape(block.credit)}</cite></blockquote>`;
 return `<p class="import-paragraph">${escape(block.text)}</p>`;
 }).join('');
 return `<article class="note-layout imported-project"><div class="import-story">${blocks}</div><div class="note-copy"><p class="small">${escape(data.type)} · ${data.year}</p><h2>${escape(data.title)}</h2>${data.intro.map(p=>`<p>${escape(p)}</p>`).join('')}<dl class="melodeck-meta"><div><dt>Period</dt><dd>${data.date}</dd></div></dl><p class="melodeck-tags">${escape(data.tags)}</p><a class="inline-link" href="https://www.wenjiashi.space/${id}/" target="_blank" rel="noopener noreferrer">Original project ↗</a></div></article>`;
}



Object.assign(importedArchiveData,{"steampunk": {"title": "Steampunk", "type": "Poster Design", "year": "2022", "date": "April 2022", "cover": "01.png", "intro": ["A Fusion of Steam Aesthetics and Victorian Elegance.", "Reflecting on the instability of our era and the relentless evolution of technology.", "Idealism, a culture of optimism, confronting adversity while transcending it."], "tags": "#VisualCommunication / #Steampunk", "blocks": [{"kind": "paragraph", "text": "Die Eule der Minerva beginnt erst mit der einbrechenden D\u00e4mmerung ihren Flug."}, {"kind": "paragraph", "text": "Minerva\u2018s owl takes off at dusk."}, {"kind": "images", "files": ["01.png"]}]}, "ultravision": {"title": "Ultra Vision", "type": "Car Interior & Interaction Design", "year": "2022", "date": "May - June 2022", "cover": "08.png", "intro": ["Based on automotive interior designRealize driving information translation", "Cooperate with Yuqing Wu, Jiancheng Qiu"], "tags": "#SystemDesign / #CarInterior#InteractionDesign", "blocks": [{"kind": "heading", "text": "Background"}, {"kind": "paragraph", "text": "Background"}, {"kind": "paragraph", "text": "Dashboard development history"}, {"kind": "paragraph", "text": "Driver Information Module (DIM) is mainly used to display vehicle information display, including speedometer, fuel, electricity and other vehicle information. With the development of automotive technology, automotive instruments are constantly evolving and upgrading.With the development of technology, the instrument will be more and more inclined to digital display, and the traditional instrument panel is gradually replaced by full liquid crystal."}, {"kind": "paragraph", "text": "Mechanical"}, {"kind": "paragraph", "text": "Electronic"}, {"kind": "paragraph", "text": "Liquid Crystal"}, {"kind": "paragraph", "text": "Intelligence"}, {"kind": "paragraph", "text": "DIM Future Trend"}, {"kind": "paragraph", "text": "Lightweight"}, {"kind": "paragraph", "text": "Smarter, lighter, more holistic."}, {"kind": "paragraph", "text": "In the future, the instrument will become an important part of the car intelligence, it can not only provide rich information for the driver, but also through intelligent technology to achieve more convenient operation, bring more intelligent driving experience."}, {"kind": "paragraph", "text": "Integration"}, {"kind": "images", "files": ["02.png"]}, {"kind": "images", "files": ["03.png"]}, {"kind": "images", "files": ["04.png"]}, {"kind": "images", "files": ["05.png"]}, {"kind": "heading", "text": "Define"}, {"kind": "paragraph", "text": "Given the high demand for transparency of assisted driving functions and driving safety information triggered by advances in autonomous driving technology."}, {"kind": "paragraph", "text": "Based on automotive interior designRealize driving information translation"}, {"kind": "paragraph", "text": "Given the high demand for transparency of assisted driving functions and driving safety information triggered by advances in autonomous driving technology."}, {"kind": "paragraph", "text": "No-drive task"}, {"kind": "paragraph", "text": "High-frequency scene"}, {"kind": "paragraph", "text": "Vehicle dashboard information has different display priorities in different scenarios, which depends on the driver's \"top-down\" demand for controlling vehicle information and the \"bottom-up\" safe vehicle information for protecting driving safety.With the development of vehicle driving technology, intelligent driving systems can help drivers complete different levels of information processing, which will change drivers' needs for driving and information presentation."}, {"kind": "paragraph", "text": "The AI-driven robot is fully supervised, driving the task less than 1% of the time"}, {"kind": "paragraph", "text": "Intelligent driving"}, {"kind": "paragraph", "text": "Life"}, {"kind": "paragraph", "text": "Secondary driving task"}, {"kind": "paragraph", "text": "Intelligent driving"}, {"kind": "paragraph", "text": "Only 8.62% of the time was spent monitoring the driving task"}, {"kind": "paragraph", "text": "Main driving task"}, {"kind": "paragraph", "text": "99.85% of the driver's gaze time is spent on monitoring the driving task"}, {"kind": "images", "files": ["07.png"]}, {"kind": "images", "files": ["08.png"]}, {"kind": "images", "files": ["09.png"]}, {"kind": "heading", "text": "Light as information"}, {"kind": "paragraph", "text": "HMW"}, {"kind": "paragraph", "text": "For"}, {"kind": "paragraph", "text": "Through the interior line lighting to replace the traditional information display."}, {"kind": "paragraph", "text": "Information stratification allows the driver to feel the driving state of the vehicle more intuitively and simplifies the driver's attention allocation."}, {"kind": "paragraph", "text": "Mapping"}, {"kind": "paragraph", "text": "Using interior lighting as a medium, the driving state of the car is translated to the driver in the form of abstract lines. \u2028 The speed, color and shape of the lines match the driving information of the vehicle."}, {"kind": "paragraph", "text": "interior light effect at 20Kmh"}, {"kind": "paragraph", "text": "interior light effect at 120Kmh"}, {"kind": "paragraph", "text": "Input"}, {"kind": "paragraph", "text": "Output"}, {"kind": "paragraph", "text": "Output"}, {"kind": "paragraph", "text": "Speed"}, {"kind": "paragraph", "text": "Slow"}, {"kind": "paragraph", "text": "Fast"}, {"kind": "paragraph", "text": "Speed"}, {"kind": "paragraph", "text": "Big"}, {"kind": "paragraph", "text": "Small"}, {"kind": "paragraph", "text": "Safety"}, {"kind": "paragraph", "text": "Car Passing"}, {"kind": "paragraph", "text": "Safe"}, {"kind": "paragraph", "text": "Noisy"}, {"kind": "paragraph", "text": "Quiet"}, {"kind": "paragraph", "text": "Environment"}, {"kind": "paragraph", "text": "Drive slow"}, {"kind": "paragraph", "text": "Drive slow"}, {"kind": "paragraph", "text": "Cool tone + disturbance"}, {"kind": "paragraph", "text": "Warm tone + slight disturbance"}, {"kind": "paragraph", "text": "In the consideration of driving safety, the timely monitoring and processing of information outside the car is an important information that needs to be understood in the process of automatic driving."}, {"kind": "paragraph", "text": "Neutral Mode"}, {"kind": "paragraph", "text": "Park Mode"}, {"kind": "paragraph", "text": "Reverse Mode"}, {"kind": "paragraph", "text": "HMI"}, {"kind": "images", "files": ["10.png"]}, {"kind": "images", "files": ["11.png"]}, {"kind": "images", "files": ["12.png"]}, {"kind": "images", "files": ["13.png"]}, {"kind": "images", "files": ["14.png"]}, {"kind": "images", "files": ["15.png"]}, {"kind": "images", "files": ["16.png"]}, {"kind": "images", "files": ["17.png"]}, {"kind": "images", "files": ["18.png"]}, {"kind": "heading", "text": "HMI"}, {"kind": "paragraph", "text": "Delineate interactive interface functions by viewing and blocking areas."}, {"kind": "paragraph", "text": "Blind area in one eye"}, {"kind": "paragraph", "text": "Binocular blindness"}, {"kind": "paragraph", "text": "Operating"}, {"kind": "paragraph", "text": "Binocular vision"}, {"kind": "paragraph", "text": "Prototype"}, {"kind": "paragraph", "text": "Through 3D printing and hot-bending acrylic plate, and external multiple displays, Logitech steering wheel, etc., the shape and information of the model are obtained and transmitted."}, {"kind": "images", "files": ["19.png"]}, {"kind": "images", "files": ["20.png"]}, {"kind": "images", "files": ["21.png"]}, {"kind": "heading", "text": "Prototype"}, {"kind": "paragraph", "text": "Digital Effect and Communication Engineering: Wenjia Shi"}, {"kind": "paragraph", "text": "Prototyping and Integration: Jiancheng QiuGuest Appearance: Shenhuan Lu"}, {"kind": "images", "files": ["22.png"]}, {"kind": "images", "files": ["23.png"]}, {"kind": "images", "files": ["24.png"]}, {"kind": "images", "files": ["25.png"]}, {"kind": "images", "files": ["26.png"]}]}, "gofie": {"title": "Gofie", "type": "UI/UX Design", "year": "2023", "date": "March - June 2023", "cover": "11.png", "intro": ["Catering to the increasingly younger golf enthusiast demographic,from beginners to seasoned players,offering a non-traditional golf experience."], "tags": "#UserInterfaceDesign / #UI/UX / #YoungerTrend / #IntellectualSense / #DressingGuide / #Niche social", "blocks": [{"kind": "heading", "text": "Context"}, {"kind": "paragraph", "text": "Strong stereotypes about..."}, {"kind": "paragraph", "text": "Golf"}, {"kind": "paragraph", "text": "facilityrevenueMembership systemEquipmentaimUpper limit highCeremonial ball"}, {"kind": "paragraph", "text": "..."}, {"kind": "paragraph", "text": "When the sport began to put more emphasis on speed, power and distance to the ball, the advantages of youth would naturally emerge."}, {"kind": "paragraph", "text": "#YoungerTrend"}, {"kind": "paragraph", "text": "Arena                ......                Amateur"}, {"kind": "paragraph", "text": "There are already three post-1995 players in the world's top 10."}, {"kind": "paragraph", "text": "In 2022, 25-year-old Scotty Schaeffler won his first PGA Tour victory"}, {"kind": "paragraph", "text": "#IntellectualSense"}, {"kind": "paragraph", "text": "#DressingGuide"}, {"kind": "paragraph", "text": "#Niche social"}, {"kind": "paragraph", "text": "\u201c"}, {"kind": "paragraph", "text": "If my friends play golfand they\u2019re having fun on the course,I\u2019ll join them."}, {"kind": "paragraph", "text": "Pluralism              ......              Social atmosphere"}, {"kind": "images", "files": ["01.png"]}, {"kind": "images", "files": ["02.png"]}, {"kind": "images", "files": ["04.png"]}, {"kind": "heading", "text": "Brief"}, {"kind": "paragraph", "text": "Catering to the increasingly younger golf enthusiast demographic,from beginners to seasoned players,offering a non-traditional golf experience."}, {"kind": "paragraph", "text": "Beginners - Try Out"}, {"kind": "paragraph", "text": "Community Posts Diverse Gameplay Friends"}, {"kind": "paragraph", "text": "Seasoned Players - Level Up"}, {"kind": "paragraph", "text": "Venue Rental  Complete Tournaments  Data Analysis"}, {"kind": "paragraph", "text": "Core Sections:  Venue, Swing, Community, Personal"}, {"kind": "images", "files": ["03.png"]}, {"kind": "heading", "text": "Wireframes & visual direction"}, {"kind": "paragraph", "text": "Wireframe"}, {"kind": "paragraph", "text": "Hi-fi Mockup"}, {"kind": "paragraph", "text": "Color Schemes"}, {"kind": "paragraph", "text": "A classic color scheme based on the course atmosphere."}, {"kind": "paragraph", "text": "Texture of objectsLightweight designHarmony and unity"}, {"kind": "paragraph", "text": "Positive energy bright colors and high texture colorsEmbrace a sense of comfort and balance"}, {"kind": "images", "files": ["05.png"]}, {"kind": "images", "files": ["06.jpg"]}, {"kind": "images", "files": ["07.png"]}, {"kind": "images", "files": ["08.jpg"]}, {"kind": "images", "files": ["09.jpg"]}, {"kind": "images", "files": ["10.jpg"]}, {"kind": "heading", "text": "The experience"}, {"kind": "paragraph", "text": "In a game."}, {"kind": "paragraph", "text": "Community"}, {"kind": "paragraph", "text": "Main page"}, {"kind": "paragraph", "text": "In a game."}, {"kind": "paragraph", "text": "Conclusion"}, {"kind": "images", "files": ["11.png"]}, {"kind": "images", "files": ["12.png"]}, {"kind": "images", "files": ["13.png"]}, {"kind": "images", "files": ["14.png"]}, {"kind": "images", "files": ["15.png"]}]}, "ariel": {"title": "Ariel", "type": "Service Design", "year": "2022", "date": "December 2022", "cover": "09.png", "intro": ["Focus on the problem of waste plastic in Marine litter, by connecting with local residents, tourists, fishermen, offering Marine waste exchange services for recycled plastic products.Aim at raising awareness of Marine waste, while supporting local industry and tourism construction to establish a global recycling system.", "Cooperate with Yuqing Wu, Xiangrui Zhou"], "tags": "#ServiceDesign / #MarineWaste", "blocks": [{"kind": "heading", "text": "A connected recycling service"}, {"kind": "paragraph", "text": "By connecting with fishermen, tourists, local governments and fashion brands, weoffer to exchange Marine waste for recycled plastic products to raise awarenessof Marine waste, support local industry and tourism, and share information withcommunities around the world."}, {"kind": "paragraph", "text": "Raise Awareness"}, {"kind": "paragraph", "text": "EnhanceCooperation"}, {"kind": "paragraph", "text": "Sandals made from Marine Waste"}, {"kind": "paragraph", "text": "Gain Local ndustry Support"}, {"kind": "paragraph", "text": "Recycle Progress View"}, {"kind": "paragraph", "text": "Beach Recycle Terminal"}, {"kind": "images", "files": ["02.png"]}, {"kind": "images", "files": ["03.png"]}, {"kind": "images", "files": ["04.png"]}, {"kind": "heading", "text": "Service journey & stakeholders"}, {"kind": "images", "files": ["05.png"]}, {"kind": "images", "files": ["06.png"]}, {"kind": "heading", "text": "Products & touchpoints"}, {"kind": "paragraph", "text": "Accessories"}, {"kind": "paragraph", "text": "Recycle"}, {"kind": "paragraph", "text": "Terminal"}, {"kind": "paragraph", "text": "Station"}, {"kind": "paragraph", "text": "Wisepath remote device"}, {"kind": "paragraph", "text": "Sandals"}, {"kind": "paragraph", "text": "Fit the beach sceneand are suitablefor production fromlocally recycledmaterials."}, {"kind": "paragraph", "text": "Lego bricks andsandal accesoriesmade fromrecycled plastic."}, {"kind": "paragraph", "text": "Set on the beach. Provide services and promote"}, {"kind": "paragraph", "text": "As a mobile terminal for a range of tracking and services"}, {"kind": "images", "files": ["07.png"]}, {"kind": "images", "files": ["08.png"]}, {"kind": "images", "files": ["09.png"]}, {"kind": "images", "files": ["10.png"]}, {"kind": "images", "files": ["11.png"]}, {"kind": "heading", "text": "Service blueprint & storyboard"}, {"kind": "paragraph", "text": "Service Blueprint"}, {"kind": "paragraph", "text": "Storyboard"}, {"kind": "paragraph", "text": "Under the guidance of LEGO , use LEGO bricks to build a contact scene to simulate the real service situation, so as to see the feasiblity of the project."}, {"kind": "images", "files": ["12.png"]}, {"kind": "images", "files": ["13.png"]}, {"kind": "heading", "text": "Outputs"}, {"kind": "paragraph", "text": "Packaging made from sustainable materials is consistent with Ariel's idea. Series packaging shoe box, shoe flowers and other materials. The content of the posters is adjusted according to the location and purpose."}, {"kind": "paragraph", "text": "The information of the mobile terminal and the recycle bin is updated synchronously. The recycling station is transformed from waste containers and plays a propaganda role in itself."}, {"kind": "images", "files": ["14.png"]}, {"kind": "images", "files": ["15.png"]}, {"kind": "images", "files": ["16.png"]}, {"kind": "images", "files": ["17.png"]}, {"kind": "images", "files": ["18.png"]}, {"kind": "heading", "text": "UI design"}, {"kind": "paragraph", "text": "Ariel mobile app can provide all kinds of information about the recyclingprocess, and is mainly used to provide waste recycling logisticsinformation and product purchase."}, {"kind": "paragraph", "text": "Shop"}, {"kind": "paragraph", "text": "Recycle"}, {"kind": "paragraph", "text": "Ariel mobile app can provide all kinds of information about the recyclingprocess, and is mainly used to provide waste recycling logisticsinformation and product purchase."}, {"kind": "paragraph", "text": "Scan the Terminal machine on the beach and starta recycle journey"}, {"kind": "paragraph", "text": "Community"}, {"kind": "paragraph", "text": "Track"}, {"kind": "paragraph", "text": "Via community, users can understand the Ariel system and sign up for workshop. New posts about Ariel will also be displayed in the community."}, {"kind": "paragraph", "text": "After recycling, you can view the recycling path and remaining days, and have a deeper empathy for nature conservation."}, {"kind": "images", "files": ["19.png"]}, {"kind": "images", "files": ["20.png"]}, {"kind": "images", "files": ["21.png"]}, {"kind": "images", "files": ["22.png"]}, {"kind": "images", "files": ["23.png"]}, {"kind": "images", "files": ["24.png"]}]}});

function gofieArchiveMarkup(){
 const figure=(file,alt,caption='')=>`<figure><img src="assets/gofie/${file}" alt="${alt}" loading="lazy" decoding="async">${caption?`<figcaption>${caption}</figcaption>`:''}</figure>`;
 return `<article class="gofie-case">
 <header class="gofie-header"><div><p class="small">UI/UX Design &middot; March &ndash; June 2023</p><h1>Gofie</h1></div><div><h2>A more approachable way to play golf.</h2><p>A mobile and watch concept for younger golf enthusiasts, bringing course discovery, social play and in-game information into one experience.</p></div></header>
 <div class="gofie-phones gofie-overview">${figure('11.png','Gofie main page','Discover a place to play')}${figure('12.png','Gofie community feed','Find your community')}${figure('13.png','Gofie in-game course map','Follow the game')}</div>
 <section class="gofie-section"><h2>The opportunity</h2><div><p>Golf can feel defined by membership, equipment and formal traditions. This project explores a more social, accessible entry point for younger players, while retaining the practical tools experienced players need.</p><div class="gofie-needs"><div><h3>Try it out</h3><p>For beginners: discover different ways to play, explore community posts and join friends.</p></div><div><h3>Build your game</h3><p>For experienced players: find venues, take part in tournaments and review performance data.</p></div></div></div></section>
 <section class="gofie-section"><h2>From discovery<br>to a round.</h2><div><p>The experience is organised around four areas: Venue, Swing, Community and Personal. The flow connects finding a course, joining friends and syncing a device with playing a round and reviewing it afterwards.</p><a class="gofie-wireframe" href="assets/gofie/05.png" target="_blank" rel="noopener noreferrer" aria-label="Open full-size Gofie wireframe">${figure('05.png','Gofie wireframe mapping onboarding, course selection, device sync, gameplay and community','View full-size flow')}</a></div></section>
 <section class="gofie-section"><h2>A visual language<br>from the course.</h2><div><p>Greens, soft neutrals and tactile surfaces connect the interface to the golf course. Bright accents identify actions, while rounded controls and familiar materials give the concept a relaxed character.</p><div class="gofie-mood">${figure('07.png','Golf accessories and green material reference')}${figure('08.jpg','Golf ball surface texture')}${figure('10.jpg','Tactile interface reference')}</div><p class="gofie-caption">Visual references for colour, texture and interface treatment.</p></div></section>
 <section class="gofie-section"><h2>The mobile<br>experience.</h2><div><p>The main page introduces places and ways to play. The community feed makes other players visible, and the course view brings the current hole, route and round information together.</p><div class="gofie-phones">${figure('11.png','Main page interface','Main page')}${figure('12.png','Community interface','Community')}${figure('13.png','In-game interface','In a game')}</div></div></section>
 <section class="gofie-section"><h2>On the wrist.</h2><div><p>The watch concept keeps round information close at hand, with an in-game view and a compact summary at the end.</p><div class="gofie-watches">${figure('14.png','Watch showing current hole and navigation','In a game')}${figure('15.png','Watch showing the round summary','Round summary')}</div></div></section>
 <footer class="gofie-source"><a class="inline-link" href="https://www.wenjiashi.space/gofie/" target="_blank" rel="noopener noreferrer">Original project</a></footer>
 </article>`;
}
