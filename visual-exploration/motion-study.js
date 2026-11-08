const data=[
 {title:'Common ground',description:'A shared service that makes everyday participation feel effortless.'},
 {title:'Soft systems',description:'Thoughtful digital tools that make room for the way people work.'},
 {title:'Field notes',description:'Looking closer at the rituals, objects and stories around us.'},
 {title:'In between',description:'Small gestures that open up new ways for people to connect.'},
 {title:'After hours',description:'Experiments at the edges of the physical and digital.'}
];
const featuredCount=5;
let homeActive=-1;
const stories=[
 'Bringing scattered moments of participation into one shared experience. Exploring how clearer touchpoints can help people find their place, contribute and stay connected.',
 'A closer look at the everyday decisions behind complex work. Connecting research, shared information and flexible tools so people can move forward with greater clarity.',
 'An ongoing collection of observations from everyday life. Following small rituals and familiar objects to uncover the stories and relationships that give them meaning.',
 'Exploring the space between an individual action and a shared experience. Using tangible interactions to make small moments of connection easier to begin.',
 'A space for trying ideas before they become finished projects. Experiments with movement, material and interaction across physical and digital experiences.'
];
data.push(
 {title:'Open forms',description:'Studies in material, movement and the possibilities of an unfinished object.'},
 {title:'Small signals',description:'Making subtle changes in our surroundings easier to notice.'},
 {title:'Shared futures',description:'Imagining new rituals for living and working together.'},
 {title:'Everyday traces',description:'A collection of fragments, observations and visual experiments.'}
);
const selectedCopy=[
 {title:'Stutter-Affirming Progress',description:'A Zoom + Web system for stutter-affirming progress.',story:'Supporting the moments before, during and after a conversation. A connected experience across Zoom, personal reflection and collaboration with speech-language professionals.',detail:'The case connects research and design decisions with three complementary experiences: a Zoom companion, a personal dashboard and a clinician workspace.'},
 {title:'Future of Work',description:'Exploring future sales and marketing collaboration with Google.',story:'A team exploration of how sales and marketing might work together in the future. Moving from emerging signals and interviews toward three connected design directions.',detail:'The story follows shared account context, an AI fallback process and handoffs that carry context between people. Full case available with private access.'},
 {title:'Precision Management',description:'A shipbuilding management system with Unity.',story:'Making complex shipbuilding information easier to navigate. A system that brings a digital workspace and ship model into a connected management experience.',detail:'The case presents the system through its original design materials and interface decisions. Full case available with private access.'},
 {title:'The Lexicon of Wish',description:'An exploration of wishes, language and the natural world.',story:'A research-led exploration of how wishes can be expressed through a visual language. Following the process from observations and references to an evolving collection of forms.',detail:'Research, visual experiments and the original film come together to tell the project’s story.'},
 {title:'Quipu',description:'Exploring stories through material and interaction.',story:'An exploration of how physical forms can carry stories. Bringing research, material experiments and interaction into a shared narrative.',detail:'The case unfolds through the making process, the resulting forms and the ideas behind them.'}
];
selectedCopy.forEach((d,i)=>{Object.assign(data[i],d);stories[i]=d.story;});
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let mode='home',active=-1,frame=0,flight=false,positions=[],wheelTotal=0,lastWheel=0,drag=null,copyAnimation=[];
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const cards=data.map((d,i)=>{
 const card=document.createElement('button');card.className='card orbit-note';card.setAttribute('aria-label',d.title);
 card.innerHTML=`<img src="assets/motion-study/${i%5+1}.svg" alt="" draggable="false"><div class="card-label">${d.title}</div>`;
 card.onclick=()=>{if(!drag?.moved)choose(i);};document.querySelector('#cards').append(card);
 const item=document.createElement('button');item.textContent=d.title;item.onclick=()=>choose(i);document.querySelector('#index').append(item);return card;
});
function targets(){
 const w=document.documentElement.clientWidth,h=innerHeight,m=w<700;
 return cards.map((_,i)=>{
  if(mode==='home'){
   if(active<0)return{x:w*(m?.5:.67)+(i-1)*(m?w*.3:w*.14),y:h*(m?.8:.77),s:(m?w*.23:w*.13)/300,r:(i-1)*4,o:i<3?.18:0};
   const diff=i-active,focus=diff===0,visible=i<featuredCount&&Math.abs(diff)<=1;
   const cw=focus?(m?Math.min(w*.62,h*.31):Math.min(w*.29,h*.51)):(m?w*.27:w*.14);
   return{x:focus?w*(m?.53:.68):w*(diff<0?.015:.985)+Math.sign(diff)*Math.max(0,Math.abs(diff)-1)*w*.3,y:h*(m?.66:.53),s:cw/300,r:focus?0:Math.sign(diff)*5,o:visible?(focus?1:.22):0};
  }
  // A bounded arc: projects keep their order and never wrap around the wheel.
  const diff=i-active,radius=m?h*.58:h*.85,theta=clamp(diff,-2,2)*.62,cw=m?w*.53:Math.min(w*.3,440);
  return{x:w*(m?.57:.56)-radius+radius*Math.cos(theta),y:h*(m?.43:.53)+radius*Math.sin(theta)+Math.sign(diff)*Math.max(0,Math.abs(diff)-2)*radius*.65,s:cw/300*(1-Math.min(2,Math.abs(diff))*.065),r:clamp(diff,-2,2)*-7,o:Math.abs(diff)>2?0:Math.abs(diff)>1?.65:1};
 });
}
function draw(){
 cards.forEach((c,i)=>{const p=positions[i];c.style.transform=`translate(${(p.x-150).toFixed(3)}px,${(p.y-180).toFixed(3)}px) rotate(${p.r.toFixed(3)}deg) scale(${p.s.toFixed(5)})`;c.style.opacity=p.o;c.style.zIndex=20-Math.abs(i-active);});
}
function updateMore(){document.querySelector('#more').hidden=mode!=='home'||active!==featuredCount-1||flight;}
function animate(transition=false){
 cancelAnimationFrame(frame);document.querySelector('#more').hidden=true;
 const start=performance.now(),from=positions.map(p=>({...p})),to=targets(),duration=reduced.matches?0:transition?2100:1350;flight=true;
 function tick(now){let done=true;positions=to.map((b,i)=>{const delay=transition?Math.min(3,Math.abs(i-active))*110:Math.min(2,Math.abs(i-active))*65,t=duration?clamp((now-start-delay)/duration,0,1):1;if(t<1)done=false;const e=(1-(1+8*t)*Math.exp(-8*t))/(1-9*Math.exp(-8)),a=from[i]||b,arc=transition?Math.sin(Math.PI*e):0;return{x:a.x+(b.x-a.x)*e+arc*(innerWidth<700?25:80),y:a.y+(b.y-a.y)*e-arc*(75+Math.abs(i-active)*18),s:a.s+(b.s-a.s)*e,r:a.r+(b.r-a.r)*e+arc*(mode==='archive'?-12:10),o:a.o+(b.o-a.o)*e};});draw();if(!done||(!reduced.matches&&now-start<duration+(transition?330:130)+70))frame=requestAnimationFrame(tick);else{frame=0;flight=false;updateMore();}}
 frame=requestAnimationFrame(tick);
}
function update(animateText=false){
 const d=data[Math.max(0,active)],greeting=mode==='home'&&active<0;
 document.body.classList.toggle('is-greeting',greeting);
 document.querySelector('#home-title').textContent=greeting?"Hi, I’m Wenjia Shi.":d.title;document.querySelector('#home-description').textContent=greeting?'I explore how thoughtful design can connect people, technology and everyday life.':stories[Math.max(0,Math.min(active,featuredCount-1))];document.querySelector('#home-detail').textContent=greeting?'Scroll to explore selected work ↓':selectedCopy[Math.max(0,Math.min(active,featuredCount-1))].detail;document.querySelector('#title').textContent=d.title;document.querySelector('#description').textContent=d.description;
 if(animateText&&!reduced.matches){copyAnimation.forEach(a=>a.cancel());copyAnimation=[...document.querySelectorAll(mode==='home'?'.intro h1,.intro p':'.archive-copy h2,.archive-copy p')].map((el,i)=>el.animate([{opacity:0,transform:'translateY(22px)'},{opacity:1,transform:'translateY(0)'}],{duration:950,delay:150+i*140,fill:'backwards',easing:'cubic-bezier(.16,.65,.2,1)'}));}
 document.querySelectorAll('#index button').forEach((b,i)=>b.setAttribute('aria-current',String(i===active)));
 cards.forEach((b,i)=>{b.setAttribute('aria-current',String(i===active));b.tabIndex=(mode==='home'?i<featuredCount&&Math.abs(i-active)<=1:Math.abs(i-active)<=1)?0:-1;});
 document.querySelector('#previous').disabled=active===0;document.querySelector('#next').disabled=active===data.length-1;
 document.body.dataset.active=active;document.body.dataset.view=mode;
 if(mode==='archive'){const item=document.querySelectorAll('#index button')[active];item.parentElement.scrollTo({left:Math.max(0,item.offsetLeft-item.parentElement.clientWidth/2+item.offsetWidth/2),top:Math.max(0,item.offsetTop-item.parentElement.clientHeight/2+item.offsetHeight/2),behavior:reduced.matches?'instant':'smooth'});}
}
function choose(index){if(flight)return;const next=clamp(index,mode==='home'?-1:0,(mode==='home'?featuredCount:data.length)-1);if(next===active)return;active=next;if(mode==='home')homeActive=active;update(true);animate();}
function setMode(next){if(flight)return;if(next===mode)return;if(next==='home')active=homeActive;else active=Math.max(0,active);mode=next;document.body.classList.toggle('is-archive',mode==='archive');document.querySelector('aside').inert=mode!=='archive';document.querySelector('.controls').inert=mode!=='archive';document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===mode)));wheelTotal=0;update(true);animate(true);}
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>setMode(b.dataset.view));document.querySelector('.identity').onclick=e=>{e.preventDefault();setMode('home');};document.querySelector('#more').onclick=()=>setMode('archive');document.querySelector('#next').onclick=()=>choose(active+1);document.querySelector('#previous').onclick=()=>choose(active-1);
addEventListener('wheel',e=>{if(e.ctrlKey||e.target.closest('nav,#index'))return;e.preventDefault();if(flight)return;const now=performance.now();if(now-lastWheel<250)return;const delta=(Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY)*(e.deltaMode===1?16:e.deltaMode===2?innerHeight:1);if(Math.sign(delta)!==Math.sign(wheelTotal))wheelTotal=0;wheelTotal+=delta;if(Math.abs(wheelTotal)<24)return;choose(active+Math.sign(wheelTotal));wheelTotal=0;lastWheel=now;},{passive:false});
addEventListener('keydown',e=>{if(['ArrowDown','ArrowUp','ArrowLeft','ArrowRight'].includes(e.key)&&!e.target.closest('nav')){e.preventDefault();choose(active+(['ArrowDown','ArrowRight'].includes(e.key)?1:-1));}});
const deck=document.querySelector('#cards');deck.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse')return;drag={x:e.clientX,y:e.clientY,moved:false};});deck.addEventListener('pointermove',e=>{if(!drag)return;if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>12)drag.moved=true;});deck.addEventListener('pointerup',e=>{if(!drag)return;const distance=mode==='home'?drag.x-e.clientX:drag.y-e.clientY;if(Math.abs(distance)>35)choose(active+Math.sign(distance));setTimeout(()=>drag=null,0);});deck.addEventListener('pointercancel',()=>drag=null);
addEventListener('resize',()=>{cancelAnimationFrame(frame);frame=0;flight=false;positions=targets();draw();updateMore();});reduced.addEventListener('change',()=>{cancelAnimationFrame(frame);frame=0;flight=false;positions=targets();draw();updateMore();});positions=targets();draw();update();updateMore();
