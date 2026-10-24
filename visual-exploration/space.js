const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),desktop=matchMedia('(min-width:701px)');
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const projects=[
 {id:'listening',title:'An object for listening',type:'Object & interaction',asset:1,private:true,summary:'Exploring the relationship between an object and a gesture.'},
 {id:'structure',title:'A softer structure',type:'Material & form',asset:2,summary:'An exploration of material, proportion and touch.'},
 {id:'folds',title:'Between folds',type:'Visual & spatial',asset:3,summary:'Thinking through paper, light and space.'},
 {id:'perspective',title:'A different perspective',type:'Spatial experiment',asset:4,private:true,summary:'A study of how a simple form changes with a new viewpoint.'}
];
const notes=['A listening object','Paper conversations','Colour, collected','A different perspective','An unfinished thought','Material fragments','Ways of seeing','Small observations'].map((title,i)=>({id:i,title,asset:[1,3,2,4,3,2,4,1][i],year:i<4?'2026':'2025',type:['Object study','Paper experiment','Colour study','Spatial study'][i%4],private:i===0||i===5}));
notes[0]={id:'melodeck',title:'Melodeck',year:'2024',type:'Product Design',cover:'assets/melodeck/01.png',private:false};
notes.splice(1,2,
 {id:'company',title:'Company',year:'2022',type:'Poster Design',cover:'assets/company/01.png',private:false},
 {id:'gpixel',title:'G-PIXEL',year:'2022',type:'Brand Design',cover:'assets/gpixel/16.png',private:false});
let category='design',page='home',unlocked=false,pending=null,year='all',active=0,arrangement='arc',angle=0,targetAngle=0,orbitFrame=0,filmDistance=0,filmFrame=0,drag=null,moved=false,canvas={x:0,y:0},returnFocus=null,homeScroll=0;
try{unlocked=sessionStorage.getItem('wenjia-visual-unlocked')==='yes';}catch{}
const selected=()=>category==='design'?projects:[projects[0],projects[2]];
const visibleNotes=()=>notes.filter(n=>year==='all'||n.year===year);
const locked=p=>p.private&&!unlocked;
const picture=(p,cls)=>`<div class="${cls} ${locked(p)?'locked':''}"><img src="assets/study-${p.asset}.svg" alt="Illustrative ${p.type.toLowerCase()}" draggable="false">${locked(p)?'<span class="locked-mark"><span>Private ↗</span></span>':''}</div>`;
function renderWork(){
 $('#selected-list').innerHTML=projects.slice(0,2).map((p,i)=>`<button class="work-row" data-project="${p.id}" style="--i:${i}" aria-label="${locked(p)?'Unlock':'Open'} ${p.title}"><div><h2>${p.title}<span class="row-arrow" aria-hidden="true">↗</span></h2><p>${p.type}${locked(p)?'<br>Private project':''}</p></div>${picture(p,'row-image')}</button>`).join('');
 $('#film-track').innerHTML=selected().map(p=>`<article class="film-card"><button data-project="${p.id}" aria-label="${locked(p)?'Unlock':'Open'} ${p.title}">${picture(p,'film-image')}<div class="film-caption"><span>${p.title}</span><span aria-hidden="true">↗</span></div></button></article>`).join('');
 $('#access').textContent=unlocked?'Access granted · Reset':'Private access';requestAnimationFrame(measureFilm);
}
function requestUnlock(action){pending=action;$('#password').value='';$('#password-error').textContent='';$('#password-dialog').showModal();}
$('#password-close').onclick=()=>$('#password-dialog').close();
$('#password-dialog').addEventListener('close',()=>{pending=null;});
$('#password-form').onsubmit=e=>{e.preventDefault();if($('#password').value!=='preview'){$('#password-error').textContent='Use “preview” for this visual study.';return;}unlocked=true;try{sessionStorage.setItem('wenjia-visual-unlocked','yes');}catch{}const next=pending;pending=null;$('#password-dialog').close();renderWork();renderArchive();if(next)next();};
$('#access').onclick=()=>{if(!unlocked){requestUnlock(null);return;}unlocked=false;try{sessionStorage.removeItem('wenjia-visual-unlocked');}catch{}closeNote();if(page==='project')location.hash='home';renderWork();renderArchive();};
function openProject(id){const p=projects.find(p=>p.id===id);if(!p)return;if(locked(p))return requestUnlock(()=>openProject(id));location.hash=`project/${id}`;}
function projectMarkup(p){$('#project-content').innerHTML=`<div class="project-layout"><div><h1>${p.title}</h1><p class="project-summary">${p.type}</p><img src="assets/study-${p.asset}.svg" alt="Illustrative project cover"></div><aside class="project-description"><h2>${p.summary}</h2><p>This space will hold the project context, your role and the decisions behind the work. Images and process can continue down the left column.</p><dl><div><dt>Discipline</dt><dd>${p.type}</dd></div><div><dt>Access</dt><dd>${p.private?'Shared privately':'Public'}</dd></div></dl><p class="draft-note">Illustrative content for this visual exploration. This is not a real project or a verified claim about Wenjia’s work.</p><a class="inline-link" href="#home">Selected work ↗</a></aside></div>`;}
function route(){
 const hash=location.hash.slice(1)||'home',id=hash.startsWith('project/')?hash.slice(8):null;
 const dest=id?'project':['home','archive','about'].includes(hash)?hash:'home';
 if(id){const p=projects.find(p=>p.id===id);if(!p){location.hash='home';return;}if(locked(p)){history.replaceState(null,'','#home');showPage('home');requestUnlock(()=>openProject(id));return;}projectMarkup(p);}
 showPage(dest);
}
function showPage(dest){if(page==='home'&&dest!=='home')homeScroll=scrollY;closeNote();page=dest;document.body.dataset.page=page;$$('.page').forEach(p=>p.hidden=p.id!==page);$$('.site-header nav a, #tool-menu nav a').forEach(a=>{const current=a.hash==='#'+(page==='project'?'home':page);if(current)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});closeTools();scrollTo({top:0,behavior:'instant'});requestAnimationFrame(()=>{if(page==='home'){measureFilm();scrollTo({top:homeScroll,behavior:'instant'});}if(page==='archive'){renderArchive();}if(page==='about'){enterAbout();}updateTools();});}
window.addEventListener('hashchange',route);$('#project-back').onclick=()=>{location.hash='home';};
document.addEventListener('click',e=>{const p=e.target.closest('[data-project]');if(p)openProject(p.dataset.project);const cat=e.target.closest('[data-category]');if(cat){unfoldWork(cat);}const arr=e.target.closest('[data-arrangement]');if(arr){arrangement=arr.dataset.arrangement;$$('[data-arrangement]').forEach(b=>b.setAttribute('aria-pressed',b===arr));canvas={x:0,y:0};renderArchive();}const yr=e.target.closest('[data-year]');if(yr){year=yr.dataset.year;active=0;angle=targetAngle=0;$$('[data-year]').forEach(b=>b.setAttribute('aria-pressed',b===yr));renderArchive();}});
function measureFilm(){if(page!=='home'||foldBusy)return;filmDistance=$('#work-exhibition').hidden?0:Math.max(0,$('#film-track').scrollWidth-$('.film-window').clientWidth);$('#filmstrip').style.height=desktop.matches&&!reduced.matches?`${$('.film-pin').offsetHeight+filmDistance}px`:'auto';cancelAnimationFrame(filmFrame);filmFrame=0;scheduleFilm();}
let filmPosition=0,filmTime=0;
function updateFilm(time=performance.now()){
 filmFrame=0;
 if(page!=='home'){filmTime=0;return;}
 const smooth=desktop.matches&&!reduced.matches;
 const rect=$('#filmstrip').getBoundingClientRect();
 const target=clamp(-rect.top,0,filmDistance);
 if(!smooth){filmPosition=0;filmTime=0;$('#film-track').style.transform='';return;}
 const dt=filmTime?Math.min(64,time-filmTime):16.7;filmTime=time;
 filmPosition+=(target-filmPosition)*(1-Math.exp(-dt/100));
 // Settle exactly at the boundaries before the sticky section releases.
 if(target===0||target===filmDistance||Math.abs(target-filmPosition)<.15)filmPosition=target;
 $('#film-track').style.transform=`translate3d(${-filmPosition}px,0,0)`;
 if(Math.abs(target-filmPosition)>.15)filmFrame=requestAnimationFrame(updateFilm);else filmTime=0;
}
function scheduleFilm(){if(!filmFrame)filmFrame=requestAnimationFrame(updateFilm);}
window.addEventListener('scroll',scheduleFilm,{passive:true});
function stepFilm(dir){const step=$('.film-card').offsetWidth+30;if(desktop.matches&&!reduced.matches){const top=scrollY+$('#filmstrip').getBoundingClientRect().top;scrollTo({top:top+clamp(scrollY-top+dir*step,0,filmDistance),behavior:'smooth'});}else $('.film-window').scrollBy({left:dir*step,behavior:reduced.matches?'instant':'smooth'});}
$('.film-window').onkeydown=e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();stepFilm(e.key==='ArrowLeft'?-1:1);}};
$('#film-track').addEventListener('focusin',e=>{if(!desktop.matches||reduced.matches)return;const card=e.target.closest('.film-card');if(!card)return;const r=card.getBoundingClientRect(),v=$('.film-window').getBoundingClientRect();if(r.left<v.left||r.right>v.right){const top=scrollY+$('#filmstrip').getBoundingClientRect().top;scrollTo({top:top+clamp(card.offsetLeft,0,filmDistance),behavior:'instant'});}});
function renderArchive(){const list=visibleNotes();active=clamp(active,0,list.length-1);$('.archive-space').dataset.arrangement=arrangement;$('#orbit').innerHTML=list.map((n,i)=>`<button class="orbit-note ${locked(n)?'locked':''}" data-orbit="${i}" aria-label="${n.title}${locked(n)?', private':''}" aria-pressed="${i===active}"><img src="${n.cover||`assets/study-${n.asset}.svg`}" alt="${n.cover?n.title:'Illustrative archive image'}" draggable="false">${locked(n)?'<span class="locked-mark"><span>Private ↗</span></span>':''}</button>`).join('');$('#archive-list').innerHTML=list.map((n,i)=>`<button class="archive-choice" data-choice="${i}" aria-current="${active===i}">${n.title}${locked(n)?'<span class="private-symbol">⌑</span>':''}</button>`).join('');$$('[data-choice]').forEach(b=>b.onclick=()=>selectNote(Number(b.dataset.choice)));$$('[data-orbit]').forEach(b=>b.onclick=()=>{if(moved)return;const i=Number(b.dataset.orbit);if(i===active)openNote();else selectNote(i);});updateCaption();positionOrbit();}
function updateCaption(){const list=visibleNotes(),n=list[active];$('#note-title').textContent=n.title;$('#note-type').textContent=n.type;$('#note-year').textContent=n.year+(locked(n)?' · Private':'');$('#open-note').textContent=locked(n)?'Unlock note ↗':'Open note ↗';$('#note-counter').textContent=`${active+1} / ${list.length}`;$$('[data-choice]').forEach((b,i)=>b.setAttribute('aria-current',i===active));$$('[data-orbit]').forEach((b,i)=>{b.classList.toggle('active',i===active);b.setAttribute('aria-pressed',i===active);});$('#prev-note').disabled=active===0;$('#next-note').disabled=active===list.length-1;}
function selectNote(i){active=clamp(i,0,visibleNotes().length-1);targetAngle=active;updateCaption();if(arrangement==='canvas'){const stage=$('#archive-stage');canvas.x=stage.clientWidth/2-((active%3)*205+45)-75;canvas.y=stage.clientHeight/2-(Math.floor(active/3)*180+40)-50;positionOrbit();}else animateOrbit();}
function positionOrbit(){if(page!=='archive')return;const stage=$('#archive-stage'),w=stage.clientWidth,h=stage.clientHeight;if(!w||!h)return;const items=$$('[data-orbit]');items.forEach((b,i)=>{if(arrangement==='canvas'){b.style.transform=`translate(${45+(i%3)*205+canvas.x}px,${40+Math.floor(i/3)*180+canvas.y}px)`;b.style.opacity=i===active?1:.65;b.style.visibility='visible';return;}const diff=i-angle,r=Math.max(370,h*.92),theta=diff*.58,x=w*.5-r+r*Math.cos(theta),y=h*.5+r*Math.sin(theta);b.style.transform=`translate(${x-b.offsetWidth/2}px,${y-b.offsetHeight/2}px) rotate(${diff*8}deg)`;b.style.opacity=Math.max(.12,1-Math.abs(diff)*.25);b.style.visibility=Math.abs(diff)>2.8?'hidden':'visible';});}
function animateOrbit(){cancelAnimationFrame(orbitFrame);if(reduced.matches){angle=targetAngle;positionOrbit();return;}function tick(){if(page!=='archive')return;angle+=(targetAngle-angle)*.11;positionOrbit();if(Math.abs(targetAngle-angle)>.001)orbitFrame=requestAnimationFrame(tick);else{angle=targetAngle;positionOrbit();}}orbitFrame=requestAnimationFrame(tick);}
$('#prev-note').onclick=()=>selectNote(active-1);$('#next-note').onclick=()=>selectNote(active+1);$('#open-note').onclick=openNote;
function openNote(){const n=visibleNotes()[active];if(locked(n))return requestUnlock(openNote);returnFocus=document.activeElement;$('#note-reading-content').innerHTML=n.id==='melodeck'?melodeckMarkup():['company','gpixel'].includes(n.id)?importedArchiveMarkup(n.id):`<div class="note-layout"><div><img src="assets/study-${n.asset}.svg" alt="Illustrative ${n.type.toLowerCase()}"><img src="assets/study-${n.asset%4+1}.svg" alt="Additional illustrative study"></div><div class="note-copy"><p class="small">${n.type} · ${n.year}</p><h2>${n.title}</h2><p>A place for an observation, an experiment, or something still in progress. A short description and the images stay together, without another page to navigate.</p><p class="draft-note">Illustrative archive content. The actual note, dates and images will be replaced with your material.</p></div></div>`;$('#note-reading').hidden=false;$('#note-reading').scrollTop=0;$('#archive').querySelector('.archive-space').inert=true;$('.site-header').inert=true;$('.archive-top').inert=true;$('.page-tools').inert=true;document.body.style.overflow='hidden';$('#close-note').focus();}
function closeNote(){if($('#note-reading').hidden)return;$('#note-reading').hidden=true;$('.archive-space').inert=false;$('.site-header').inert=false;$('.archive-top').inert=false;$('.page-tools').inert=false;document.body.style.overflow='';returnFocus?.focus({preventScroll:true});}
$('#close-note').onclick=closeNote;window.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#note-reading').hidden){closeNote();return;}if(!$('#note-reading').hidden&&e.key==='Tab'){const items=[...$('#note-reading').querySelectorAll('button,a[href],input,[tabindex="0"]')];const first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
$('#archive-stage').onkeydown=e=>{if(['ArrowLeft','ArrowUp','ArrowRight','ArrowDown'].includes(e.key)){e.preventDefault();selectNote(active+(['ArrowLeft','ArrowUp'].includes(e.key)?-1:1));}};
let wheelSum=0,wheelTime=0;$('#archive-stage').addEventListener('wheel',e=>{if(arrangement!=='arc')return;e.preventDefault();const now=performance.now();if(now-wheelTime>180)wheelSum=0;wheelTime=now;wheelSum+=e.deltaY||e.deltaX;if(Math.abs(wheelSum)>65){selectNote(active+Math.sign(wheelSum));wheelSum=0;}},{passive:false});
$('#archive-stage').onpointerdown=e=>{drag={x:e.clientX,y:e.clientY,index:active,cx:canvas.x,cy:canvas.y};moved=false;};window.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>7)moved=true;if(!moved)return;if(arrangement==='canvas'){canvas.x=clamp(drag.cx+dx,-650,200);canvas.y=clamp(drag.cy+dy,-550,200);positionOrbit();}else{targetAngle=clamp(drag.index-dy/170,0,visibleNotes().length-1);angle=targetAngle;active=Math.round(angle);cancelAnimationFrame(orbitFrame);updateCaption();positionOrbit();}});window.addEventListener('pointerup',()=>{if(drag&&arrangement==='arc'){targetAngle=active;animateOrbit();}drag=null;setTimeout(()=>moved=false,0);});window.addEventListener('pointercancel',()=>{drag=null;});
function resize(){measureFilm();positionOrbit();}window.addEventListener('resize',resize);reduced.addEventListener('change',resize);desktop.addEventListener('change',resize);document.fonts.ready.then(resize);
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.15});$$('.reveal').forEach(el=>{el.classList.add('pending');observer.observe(el);});
let foldBusy=false;
async function unfoldWork(button){
 if(foldBusy)return;
 foldBusy=true;
 const exhibition=$('#work-exhibition');
 const closing=button.getAttribute('aria-expanded')==='true';
 const section=$('#filmstrip');
 const sectionTop=scrollY+section.getBoundingClientRect().top;
 const pinned=desktop.matches&&!reduced.matches&&scrollY>=sectionTop&&scrollY<sectionTop+filmDistance+$('.film-pin').offsetHeight;
 // Remove the consumed horizontal scroll before changing its scroll range.
 // The sticky content stays in the same viewport position.
 if(pinned)scrollTo({top:sectionTop,behavior:'instant'});
 cancelAnimationFrame(filmFrame);filmFrame=0;filmPosition=0;filmTime=0;
 $('#film-track').style.transform='';
 async function fold(from,to){
 if(reduced.matches)return;
 const animation=exhibition.animate([{height:`${from}px`,opacity:from?1:0},{height:`${to}px`,opacity:to?1:0}],{duration:280,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'});
 try{await animation.finished;}finally{animation.cancel();}
 }
 try{
 if(!exhibition.hidden)await fold(exhibition.offsetHeight,0);
 exhibition.hidden=true;
 $$('[data-category]').forEach(b=>{b.setAttribute('aria-expanded','false');b.querySelector('.fold-action').textContent='+';b.setAttribute('aria-label',`Expand ${b.dataset.category} projects`);});
 if(!closing){
 category=button.dataset.category;button.after(exhibition);
 renderWork();exhibition.hidden=false;$('.film-window').scrollLeft=0;
 button.setAttribute('aria-expanded','true');button.querySelector('.fold-action').textContent='−';button.setAttribute('aria-label',`Collapse ${category} projects`);
 await fold(0,exhibition.offsetHeight);
 }
 section.classList.toggle('folded',closing);
 }finally{foldBusy=false;measureFilm();}
}
function closeTools(){$('#tool-menu').hidden=true;$('#tool-toggle').setAttribute('aria-expanded','false');}
function openTools(){$('#tool-menu').hidden=false;$('#tool-toggle').setAttribute('aria-expanded','true');}
function updateTools(){const visible=scrollY>140||page==='project';$('.page-tools').hidden=!visible;if(!visible)closeTools();}
$('.tool-disclosure').addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')openTools();});
$('.tool-disclosure').addEventListener('pointerleave',()=>{if(!$('.tool-disclosure').contains(document.activeElement))closeTools();});
$('.tool-disclosure').addEventListener('focusout',e=>{if(!$('.tool-disclosure').contains(e.relatedTarget))closeTools();});
$('#tool-toggle').onclick=()=>{$('#tool-menu').hidden?openTools():closeTools();};
$('#tool-top').onclick=()=>{closeTools();scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'});};
$('#tool-menu').onclick=e=>{const link=e.target.closest('a');if(link){closeTools();if(link.hash===location.hash)scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'});}};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#tool-menu').hidden){closeTools();$('#tool-toggle').focus();}});
document.addEventListener('click',e=>{if(!e.target.closest('.tool-disclosure'))closeTools();});
window.addEventListener('scroll',updateTools,{passive:true});window.addEventListener('hashchange',()=>requestAnimationFrame(updateTools));
function enterAbout(){
 const curtain=$('.about-curtain');curtain.getAnimations().forEach(a=>a.cancel());
 if(reduced.matches)return;
 curtain.animate([{transform:'scaleX(1)'},{transform:'scaleX(0)'}],{duration:620,easing:'cubic-bezier(.76,0,.24,1)'});
 $$('.bio-intro,.bio-history,.bio-interests').forEach((el,i)=>{el.getAnimations().forEach(a=>a.cancel());el.animate([{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'translateY(0)'}],{duration:620,delay:180+i*100,fill:'backwards',easing:'cubic-bezier(.22,1,.36,1)'});});
}
history.scrollRestoration='manual';
scrollTo({top:0,behavior:'instant'});
renderWork();route();updateTools();
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
