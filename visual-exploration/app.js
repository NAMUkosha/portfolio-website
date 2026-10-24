const $=s=>document.querySelector(s);
let unlocked=sessionStorage.getItem('wenjia-visual-unlocked')==='yes',filter='design',pending=null,pinned=false,activeNote=null;
const design=[{title:'An object for listening',kind:'Object & interaction study',asset:1,private:true},{title:'A softer kind of structure',kind:'Material & form study',asset:2},{title:'Between folds',kind:'Visual & spatial study',asset:3},{title:'A different perspective',kind:'Spatial experiment',asset:4}];
const research=[{title:'How an object invites a gesture',kind:'Interaction research',asset:1,private:true},{title:'A vocabulary of soft forms',kind:'Material exploration',asset:2}];
function renderProjects(){ $('#projects').innerHTML=(filter==='design'?design:research).map((p,i)=>`<article class="project"><button class="art" data-project="${i}" aria-label="${p.private&&!unlocked?'Unlock':'Open'} ${p.title}"><img class="${p.private&&!unlocked?'private-image':''}" src="assets/study-${p.asset}.svg" alt="Illustrative ${p.kind.toLowerCase()}">${p.private&&!unlocked?'<span class="lock-label"><span>⌑ &nbsp; Private project</span></span>':''}<span class="art-arrow">↗</span></button><div class="caption"><div><h2>${p.title}</h2><p>${p.kind} ${p.private?' · Private selection':''}</p></div></div></article>`).join('');$('#access').textContent=unlocked?'Preview unlocked · Reset ↺':'Unlock preview ↗';requestAnimationFrame(()=>window.measureRail?.());}
function requestAccess(action){pending=action;$('#error').textContent='';$('#password').value='';$('#unlock').showModal();}
function openProject(p){if(p.private&&!unlocked)return requestAccess(()=>openProject(p));$('#detail-content').innerHTML=`<span class="eyebrow">SELECTED ${filter.toUpperCase()} / VISUAL STUDY</span><h2>${p.title}</h2><p>${p.kind}</p><img src="assets/study-${p.asset}.svg" alt="Illustrative project artwork"><p class="detail-note">This is a composition study, not an actual portfolio project. The final case study will have its own page, with the project story, process and outcomes.</p>`;$('#detail').showModal();}
document.addEventListener('click',e=>{const page=e.target.closest('[data-page]');if(page){document.querySelectorAll('.page').forEach(p=>p.hidden=p.id!==page.dataset.page);document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('active',b.dataset.page===page.dataset.page));document.querySelectorAll('nav button').forEach(b=>{if(b.dataset.page===page.dataset.page)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});window.scrollTo(0,0);requestAnimationFrame(()=>window.measureRail?.());}const layout=e.target.closest('[data-layout]');if(layout){document.body.dataset.layout=layout.dataset.layout;document.querySelectorAll('[data-layout]').forEach(b=>b.setAttribute('aria-pressed',b===layout));const u=new URL(location);u.searchParams.set('direction',layout.dataset.layout);history.replaceState(null,'',u);}const f=e.target.closest('[data-filter]');if(f){const railTop=scrollY+$('#selected').getBoundingClientRect().top;if(railMotion.matches&&scrollY>=railTop)window.scrollTo({top:railTop,behavior:'instant'});filter=f.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',b===f));renderProjects();}const p=e.target.closest('[data-project]');if(p)openProject((filter==='design'?design:research)[Number(p.dataset.project)]);const c=e.target.closest('[data-close]');if(c)document.getElementById(c.dataset.close).close();});
document.querySelectorAll('.wordmark').forEach(a=>a.addEventListener('click',()=>document.querySelector('[data-page="home"]').click()));
$('#access').onclick=()=>{if(unlocked){unlocked=false;sessionStorage.removeItem('wenjia-visual-unlocked');renderProjects();renderNotes();if(activeNote!==null)inspect(activeNote);return;}requestAccess(null);};
$('#unlock-form').onsubmit=e=>{e.preventDefault();if($('#password').value!=='preview'){$('#error').textContent='For this visual demo, enter “preview”.';return;}unlocked=true;sessionStorage.setItem('wenjia-visual-unlocked','yes');$('#unlock').close();renderProjects();renderNotes();if(activeNote!==null)inspect(activeNote);const next=pending;pending=null;if(next)next();};
$('#top').onclick=()=>window.scrollTo({top:0,behavior:'smooth'});
const names=['A listening object','Fold, unfold','Colour in between','Soft structures','A small observation','Material conversations','An unfinished thought','Ways of seeing'];
const notes=names.map((name,i)=>({name,asset:i%3+1,year:i<3?'2026':i<6?'2025':'2024',private:i===0||i===5,x:110+(i%3)*290+(i%2)*25,y:95+Math.floor(i/3)*250+(i%3)*36}));
let year='all';
function renderNotes(){$('#canvas').innerHTML=notes.map((n,i)=>`<button class="note ${n.private&&!unlocked?'private':''}" data-note="${i}" style="left:${n.x}px;top:${n.y}px;${year!=='all'&&n.year!==year?'display:none':''}" aria-label="${n.name}${n.private&&!unlocked?', locked':''}"><img src="assets/study-${n.asset}.svg" alt="Illustrative archive study"><span>${n.year} &nbsp; / &nbsp; ${n.name} ${n.private&&!unlocked?'⌑':''}</span></button>`).join('');document.querySelectorAll('[data-note]').forEach(b=>{b.onpointerenter=()=>{if(!pinned)inspect(Number(b.dataset.note));};b.onfocus=()=>{if(!pinned)inspect(Number(b.dataset.note));};b.onclick=()=>{if(dragged)return;const i=Number(b.dataset.note);if(notes[i].private&&!unlocked)return requestAccess(()=>{pinned=true;inspect(i);});pinned=true;inspect(i);};});}
function inspect(i){activeNote=i;const n=notes[i],locked=n.private&&!unlocked;$('#inspector').innerHTML=`<span class="eyebrow">${n.year} / ${locked?'PRIVATE NOTE':pinned?'SELECTED NOTE':'A GLIMPSE'}</span><h2>${n.name}</h2><p>${locked?'A private fragment of the archive. Enter the password to take a closer look.':'An illustrative entry for exploring how images, observations and small experiments could live together.'}</p>${locked?'<button class="textlink" id="note-unlock">Unlock this space ↗</button>':`<img src="assets/study-${n.asset}.svg" alt="Expanded illustrative study">${pinned?'<p style="margin-top:18px">A short description lives here, followed by the images. Everything stays in this view.</p><button class="textlink" id="unpin">Release selection ↗</button>':''}`}`;if($('#note-unlock'))$('#note-unlock').onclick=()=>requestAccess(()=>{pinned=true;inspect(i);});if($('#unpin'))$('#unpin').onclick=()=>{pinned=false;inspect(i);};}
document.querySelectorAll('[data-year]').forEach(b=>b.onclick=()=>{year=b.dataset.year;document.querySelectorAll('[data-year]').forEach(x=>x.classList.toggle('active',x===b));pos={x:-60,y:-30};applyPos();renderNotes();});
$('#collapse').onclick=()=>{const c=$('.timeline').classList.toggle('collapsed');$('#collapse').textContent=c?'→':'←';$('#collapse').setAttribute('aria-label',c?'Expand timeline':'Collapse timeline');};
let pos={x:-60,y:-30},start=null,dragged=false;
function applyPos(){const v=$('#viewport');pos.x=Math.max(Math.min(0,v.clientWidth-1150),Math.min(0,pos.x));pos.y=Math.max(Math.min(0,v.clientHeight-900),Math.min(0,pos.y));$('#canvas').style.transform=`translate(${pos.x}px,${pos.y}px)`;}
$('#viewport').onpointerdown=e=>{start={x:e.clientX,y:e.clientY,px:pos.x,py:pos.y};dragged=false;};
window.addEventListener('pointermove',e=>{if(!start)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;if(Math.abs(dx)+Math.abs(dy)>5)dragged=true;if(dragged){pos={x:start.px+dx,y:start.py+dy};applyPos();}});
window.addEventListener('pointerup',()=>{start=null;setTimeout(()=>dragged=false,0);});window.addEventListener('pointercancel',()=>{start=null;});
$('#viewport').onkeydown=e=>{const moves={ArrowLeft:[70,0],ArrowRight:[-70,0],ArrowUp:[0,70],ArrowDown:[0,-70]};if(moves[e.key]){e.preventDefault();pos.x+=moves[e.key][0];pos.y+=moves[e.key][1];applyPos();}};
renderProjects();renderNotes();

// Native vertical scrolling drives a sticky horizontal exhibition.
const railMotion=matchMedia('(min-width: 761px) and (prefers-reduced-motion: no-preference)');
let railDistance=0,railFrame=0;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function updateRail(){
 railFrame=0;if($('#home').hidden)return;
 const section=$('#selected'),view=$('.rail-window');
 const progress=railMotion.matches&&railDistance?clamp(-section.getBoundingClientRect().top/railDistance,0,1):0;
 if(railMotion.matches)$('#projects').style.transform=`translate3d(${-progress*railDistance}px,0,0)`;
 else $('#projects').style.transform='';
 const nativeMax=view.scrollWidth-view.clientWidth;
 const amount=railMotion.matches?progress:nativeMax?view.scrollLeft/nativeMax:0;
 $('.rail-progress i').style.transform=`scaleX(${amount})`;
 $('#rail-prev').disabled=amount<=0.001;$('#rail-next').disabled=railMotion.matches?railDistance===0||amount>=.999:nativeMax===0||amount>=.999;
}
window.measureRail=()=>{
 if($('#home').hidden)return;
 railDistance=Math.max(0,$('#projects').scrollWidth-$('.rail-window').clientWidth);
 $('#selected').style.height=railMotion.matches?`${$('.work-pin').offsetHeight+railDistance}px`:'auto';
 updateRail();
};
function scheduleRail(){if(!railFrame)railFrame=requestAnimationFrame(updateRail);}
window.addEventListener('scroll',scheduleRail,{passive:true});
window.addEventListener('resize',window.measureRail);
railMotion.addEventListener('change',window.measureRail);
$('.rail-window').addEventListener('scroll',scheduleRail,{passive:true});
function stepRail(dir){
 const step=$('.project').getBoundingClientRect().width+22;
 if(railMotion.matches){const section=$('#selected'),top=scrollY+section.getBoundingClientRect().top;window.scrollTo({top:top+clamp(scrollY-top+dir*step,0,railDistance),behavior:'smooth'});}
 else $('.rail-window').scrollBy({left:dir*step,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
}
$('#rail-prev').onclick=()=>stepRail(-1);$('#rail-next').onclick=()=>stepRail(1);
$('.rail-window').addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();stepRail(e.key==='ArrowRight'?1:-1);}});
$('#projects').addEventListener('focusin',e=>{
 const card=e.target.closest('.project');if(!card||!railMotion.matches)return;
 const view=$('.rail-window'),r=card.getBoundingClientRect(),v=view.getBoundingClientRect();
 if(r.right>v.right+1||r.left<v.left-1){const top=scrollY+$('#selected').getBoundingClientRect().top;scrollTo({top:top+clamp(card.offsetLeft,0,railDistance),behavior:'instant'});}
});
const revealObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target);}});},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>{el.classList.add('reveal-ready');revealObserver.observe(el);});
window.measureRail();document.fonts.ready.then(window.measureRail);

function updateIntroMotion(){
 const intro=document.querySelector('.personal-intro');
 if(!intro||document.querySelector('#home').hidden)return;
 const allowed=matchMedia('(min-width: 761px) and (prefers-reduced-motion: no-preference)').matches;
 const amount=allowed?Math.min(1,Math.max(0,-intro.getBoundingClientRect().top/600)):0;
 intro.style.setProperty('--intro-drift',`${amount*28}px`);
}
let introFrame=0;window.addEventListener('scroll',()=>{if(!introFrame)introFrame=requestAnimationFrame(()=>{introFrame=0;updateIntroMotion();});},{passive:true});
updateIntroMotion();
