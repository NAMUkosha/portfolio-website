(() => {
  const root = document.querySelector('#portfolio-motion');
  if (!root) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  // Content and assets are independent of the interaction/animation implementation.
  const objects = [
    {id:'hair-tie', name:'Hair tie', title:'Hair up. Game on.'},
    {id:'coffee-tea', name:'Coffee and tea', title:'Coffee or tea? Yes.'},
    {id:'puzzle', name:'Puzzle', title:'Occupational hazard: asking why.'},
    {id:'knitting', name:'Knitting', title:'One stitch at a time.'},
    {id:'controller', name:'Indie games', title:'Ask me about indie games.'}
  ].map(item => ({...item, image:`assets/personal-objects/${item.id}.png`}));
  // Tight visible bounds; retain original PNGs and crop their transparent margins in CSS.
  const bounds = {'hair-tie':[1536,1024,380,184,744,622],'coffee-tea':[1774,887,377,233,918,449],puzzle:[1536,1024,388,193,744,603],knitting:[1774,887,400,174,1056,547],controller:[1536,1024,238,156,1055,742]};
  const inline = id => {
    const item = objects.find(o => o.id === id);
    const [w,h,x,y,cw,ch]=bounds[id];
    const crop=`--object-ratio:${cw/ch};--asset-width:${w/cw*100}%;--asset-height:${h/ch*100}%;--asset-left:${-x/cw*100}%;--asset-top:${-y/ch*100}%`;
    return `<button style="${crop}" type="button" class="hero-object" data-object="${id}" aria-label="${item.name}: ${item.title}" aria-controls="hero-story" aria-pressed="false"><img src="${item.image}" alt="" width="60" height="54" decoding="async"></button>`;
  };
  const hero = document.createElement('section');
  hero.className = 'personal-hero'; hero.setAttribute('aria-labelledby','personal-title');
  hero.innerHTML = `<div class="hero-introduction"><h1 id="personal-title">Hi, I'm Wenjia Shi</h1><p class="hero-sentence"><span>a designer, ${inline('hair-tie')} curious ${inline('controller')} tinkerer,</span> <span>and occasional ${inline('coffee-tea')} overthinker who turns</span> <span>${inline('puzzle')} <span class="hero-keep">what-ifs</span> into experiences ${inline('knitting')} worth caring about.</span></p><div class="hero-credentials"><span>Information Science @ Cornell</span><span>UI/UX Designer &amp; Researcher @ UXSPOT</span></div></div><div class="hero-exhibition" id="hero-story" role="region" aria-label="Personal object story" aria-live="polite" aria-atomic="true"><div class="hero-display"></div><div class="hero-story-copy"><h2></h2></div></div>`;
  root.append(hero);
  const display = hero.querySelector('.hero-display'), copy = hero.querySelector('.hero-story-copy');
  const buttons = [...hero.querySelectorAll('.hero-object')];
  // Pre-create all five small assets. Only the selected image participates in accessibility.
  objects.forEach(item => {
    const img = new Image(300,270); img.src=item.image; img.alt=item.name;
    img.dataset.object=item.id; img.hidden=true; display.append(img);
  });
  let selected = null, transitions = [], entered = false, wasVisible = false, exitAnimation;
  function select(id, animate=true) {
    if (selected === id) return;
    selected=id; hero.dataset.selected=id||'idle';
    transitions.forEach(a=>a.cancel()); transitions=[];
    const item=objects.find(o=>o.id===id);
    hero.querySelector(".hero-exhibition").classList.toggle("is-active",!!item);
    hero.querySelector(".hero-exhibition").setAttribute("aria-hidden",String(!item));
    buttons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.object===id)));
    display.querySelectorAll('img').forEach(img=>{
      const showing=img.dataset.object===id, outgoing=!img.hidden;
      if(showing){img.hidden=false;img.removeAttribute('aria-hidden');}
      else img.setAttribute('aria-hidden','true');
      if(!animate||reduced.matches){img.hidden=!showing;return;}
      if(showing) transitions.push(img.animate([{opacity:0,transform:'translateY(9px) scale(.96)'},{opacity:1,transform:'none'}],{duration:WenjiaMotion.duration('control'),easing:WenjiaMotion.easing()}));
      else if(outgoing){const a=img.animate([{opacity:1,transform:'none'},{opacity:0,transform:'translateY(-6px) scale(.98)'}],{duration:WenjiaMotion.duration('micro'),fill:'forwards'});transitions.push(a);a.finished.then(()=>{if(selected!==img.dataset.object)img.hidden=true;}).catch(()=>{if(selected!==img.dataset.object)img.hidden=true;});}
      else img.hidden=true;
    });
    copy.querySelector('h2').textContent=item?.title||'';

  }
  let hovered=null, focused=null, touchSelected=null;
  const refresh=()=>select(hovered||focused||touchSelected);
  buttons.forEach(button=>{
    button.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hovered=button.dataset.object;refresh();}});
    button.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'){hovered=null;if(!button.matches(':focus-visible'))focused=null;touchSelected=null;refresh();}});
    button.addEventListener('focus',()=>{if(button.matches(':focus-visible')){focused=button.dataset.object;refresh();}});
    button.addEventListener('blur',()=>{focused=null;refresh();});
    button.addEventListener('click',event=>{if(event.detail===0){focused=button.dataset.object;}else if(!matchMedia('(hover: hover)').matches){touchSelected=touchSelected===button.dataset.object?null:button.dataset.object;}refresh();});
  });
  document.addEventListener('pointerdown',event=>{if(!event.target.closest('.hero-object')){touchSelected=null;focused=null;hovered=null;refresh();}});
  hero.querySelector('.hero-exhibition').setAttribute('aria-hidden','true');
  let touchStart=null;
  hero.addEventListener('touchstart',event=>{const t=event.touches[0];touchStart={x:t.clientX,y:t.clientY,atBottom:hero.scrollTop+hero.clientHeight>=hero.scrollHeight-2};},{passive:true});
  hero.addEventListener('touchend',event=>{const t=event.changedTouches[0];if(touchStart?.atBottom&&touchStart.y-t.clientY>55&&Math.abs(t.clientX-touchStart.x)<60)root.querySelector('.scroll-cue').click();touchStart=null;},{passive:true});
  hero.addEventListener('touchcancel',()=>touchStart=null,{passive:true});
  let assetsReady=false, revealing=false;
  const readyAssets=Promise.all([document.fonts.ready,...[...hero.querySelectorAll('img'),...display.querySelectorAll('img')].map(img=>img.decode().catch(()=>{}))]);
  Promise.race([readyAssets,new Promise(resolve=>setTimeout(resolve,1800))]).then(()=>{
    assetsReady=true;document.documentElement.classList.remove('home-booting');sync();
  });
  document.addEventListener('opening:reveal',()=>{revealing=true;sync();});
  function sync() {
    const visible=root.classList.contains('is-greeting')&&!root.hidden;
    hero.inert=!visible;
    if(!visible){hovered=null;focused=null;touchSelected=null;select(null,false);}
    if(visible){exitAnimation?.cancel();hero.hidden=false;}
    else if(wasVisible&&!reduced.matches&&!root.hidden){
      exitAnimation=hero.animate([{opacity:1,translate:'0 0'},{opacity:0,translate:'0 -12px'}],{duration:WenjiaMotion.duration('ui'),easing:'ease-out'});
      exitAnimation.finished.then(()=>{if(!root.classList.contains('is-greeting'))hero.hidden=true;}).catch(()=>{});
    }else if(!wasVisible&&!exitAnimation)hero.hidden=true;
    else if(reduced.matches||root.hidden)hero.hidden=true;
    wasVisible=visible;
    const opening=document.querySelector('#opening')||document.documentElement.classList.contains('opening-pending');
    if(!visible||!assetsReady||(opening&&!revealing)||entered)return;
    entered=true;hero.classList.add('has-entered');
    if(reduced.matches)return;
    const sequence=[hero.querySelector('h1'),hero.querySelector('.hero-sentence'),hero.querySelector('.hero-credentials'),root.querySelector('.scroll-cue')];
    sequence.forEach((el,i)=>el?.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:WenjiaMotion.duration('surface'),delay:i*100,fill:'backwards',easing:WenjiaMotion.easing()}));
    buttons.forEach((el,i)=>el.animate([{opacity:0,translate:'0 4px'},{opacity:1,translate:'0 0'}],{duration:WenjiaMotion.duration('control'),delay:270+i*65,fill:'backwards'}));
  }
  new MutationObserver(sync).observe(root,{attributes:true,attributeFilter:['class','hidden']});
  const openingObserver=new MutationObserver(()=>{sync();if(entered)openingObserver.disconnect();});
  openingObserver.observe(document.body,{childList:true});
  openingObserver.observe(document.documentElement,{attributes:true,attributeFilter:['class']});
  sync();
})();
