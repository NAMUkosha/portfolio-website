(() => {
  'use strict';
  if (location.hash && location.hash !== '#home') return;
  const html = document.documentElement;
  html.classList.add('opening-pending');
  const bootTimeout = setTimeout(() => html.classList.remove('opening-pending'), 6500);
  function start() {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const events = new AbortController();
    const { signal } = events;
    const root = document.createElement('section');
    root.id = 'opening'; root.tabIndex = -1;
    root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-label', 'A short introduction by Wenjia');
    root.setAttribute('aria-describedby', 'opening-story');
    root.innerHTML = `
      <div class="opening-veil"></div><div class="opening-ambience" aria-hidden="true"></div><canvas class="opening-particles" aria-hidden="true"></canvas>
      <p id="opening-story" class="opening-sr">A spark is only the beginning. The rest is curiosity, a little stubbornness, and a lot of love.</p>
      <div class="opening-stage" aria-hidden="true">
        <p class="opening-line" data-line="0">A <span class="opening-phrase opening-spark">spark</span> is only the beginning.</p>
        <p class="opening-line" data-line="1">The rest is <span class="opening-phrase opening-curiosity">curiosity</span>,</p>
        <p class="opening-line" data-line="2">a little <span class="opening-phrase opening-stubborn">stubbornness<canvas class="opening-fuzzy" aria-hidden="true"></canvas></span>,</p>
        <p class="opening-line" data-line="3">and a lot of <span class="opening-phrase opening-love">love</span>.</p>
      </div>
      <div class="opening-focus-frame" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
      <div class="opening-bloom" aria-hidden="true"></div>
      <button class="opening-skip" type="button" tabindex="-1" aria-hidden="true" aria-label="Hold E or press and hold to skip introduction">
        <span class="opening-skip-circle" aria-hidden="true"><svg viewBox="0 0 48 48"><circle class="opening-skip-track" cx="24" cy="24" r="21"/><circle class="opening-skip-progress" cx="24" cy="24" r="21" pathLength="100"/></svg><span>E</span></span>
        <span class="opening-skip-label" aria-hidden="true">skip</span>
      </button>`;
    document.body.append(root); html.classList.remove('opening-pending'); clearTimeout(bootTimeout);
    const previousFocus = document.activeElement;
    const blocked = [...document.body.children].filter(el => el !== root && !['SCRIPT', 'STYLE', 'LINK'].includes(el.tagName)).map(el => [el, el.inert]);
    blocked.forEach(([el]) => { el.inert = true; }); root.focus({ preventScroll: true });
    const lines = [...root.querySelectorAll('.opening-line')];
    // Keep full line widths reserved while each letter appears, so centering is stable.
    const characters = lines.map(line => {
      const walker = document.createTreeWalker(line, NodeFilter.SHOW_TEXT), nodes = [], chars = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(node => {
        const fragment = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).filter(Boolean).forEach(word => {
          if (/^\s+$/.test(word)) { fragment.append(document.createTextNode(word)); return; }
          const wrapper = document.createElement('span'); wrapper.className = 'opening-word';
          Array.from(word).forEach(letter => {
            const glyph = document.createElement('span'); glyph.className = 'opening-char';
            glyph.textContent = letter; wrapper.append(glyph); chars.push(glyph);
          });
          fragment.append(wrapper);
        });
        node.replaceWith(fragment);
      });
      return chars;
    });
    const skip = root.querySelector('.opening-skip');
    const canvas = root.querySelector('.opening-particles'), ctx = canvas.getContext('2d');
    const fuzzyCanvas = root.querySelector('.opening-fuzzy'), fuzzy = fuzzyCanvas.getContext('2d');
    const source = document.createElement('canvas'), sourceCtx = source.getContext('2d');
    const stubborn = root.querySelector('.opening-stubborn');
    const focusFrame = root.querySelector('.opening-focus-frame');
    if (fuzzy && sourceCtx) stubborn.classList.add('has-fuzzy');
    let scene = -1, frame = 0, holding = null, holdSource = null, leaving = false, removed = false;
    let fallback = 0, removalTimer = 0, bloomTimer = 0, hintTimer = 0;
    let lastSize = '', focusTarget = null, fuzzyDirty = true, fuzzyStep = -1;
    let fuzzyDpr = 1, fuzzyBox = null;
    const particles = [], starts = [0, 2000, 4200, 6500];
    const duration = reduced.matches ? 3200 : 11800, fade = reduced.matches ? 200 : 1800;
    const characterInterval = 42;
    const clamp = n => Math.max(0, Math.min(1, n));
    const random = (a, b) => a + Math.random() * (b - a);
    function resize(force = false) {
      const size = `${innerWidth}:${innerHeight}`;
      if (size === lastSize && force !== true) return;
      lastSize = size; focusTarget = null; particles.length = 0; fuzzyDirty = true; fuzzyStep = -1;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(innerWidth * dpr); canvas.height = Math.round(innerHeight * dpr);
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (fuzzy && sourceCtx) {
        fuzzyBox = stubborn.getBoundingClientRect(); fuzzyDpr = dpr;
        const width = Math.ceil((fuzzyBox.width + 24) * dpr), height = Math.ceil((fuzzyBox.height + 16) * dpr);
        fuzzyCanvas.width = source.width = width; fuzzyCanvas.height = source.height = height;
      }
    }
    function emit(glyph, now) {
      if (!ctx || reduced.matches || !glyph.closest('.opening-spark,.opening-love')) return;
      const box = glyph.getBoundingClientRect(), love = !!glyph.closest('.opening-love');
      for (let i = 0; i < (love ? 3 : 9); i++) particles.push({x:box.x+box.width/2,y:box.y+box.height/2,vx:random(-48,48),vy:random(-65,25),born:now,life:random(400,900),size:random(.7,1.7),color:love?'#dca894':'#e1ad47'});
      glyph.closest('.opening-phrase').classList.add('is-lit');
    }
    function paintParticles(now) {
      if (!ctx) return;
      ctx.clearRect(0,0,innerWidth,innerHeight);
      for(let i=particles.length-1;i>=0;i--){
        const p=particles[i],t=(now-p.born)/p.life;
        if(t>=1){particles.splice(i,1);continue;}
        ctx.fillStyle=p.color; ctx.beginPath();
        ctx.arc(p.x+p.vx*t,p.y+p.vy*t+12*t*t,p.size*(1-t),0,Math.PI*2);ctx.fill();
      }
    }
    function updateFocus(elapsed) {
      if(scene<1 || reduced.matches) return;
      const age=elapsed-starts[1], words=lines[1].querySelectorAll('.opening-word');
      const target=age<560?words[1]:root.querySelector('.opening-curiosity .opening-word');
      if(age<200 || !target || target===focusTarget) return;
      focusTarget=target;
      const box=target.getBoundingClientRect(), origin=root.getBoundingClientRect();
      focusFrame.style.left=`${box.x-origin.x-7}px`;focusFrame.style.top=`${box.y-origin.y+4}px`;
      focusFrame.style.width=`${box.width+14}px`;focusFrame.style.height=`${box.height-8}px`;
      focusFrame.classList.add('is-found');
    }
    function paintFuzzy(now, elapsed) {
      if(!fuzzy || !sourceCtx || !fuzzyBox || scene<2 || reduced.matches) return;
      const step=Math.floor((elapsed-starts[2])/115);
      if(step===fuzzyStep && !fuzzyDirty) return;
      fuzzyStep=step;
      if(fuzzyDirty){
        sourceCtx.clearRect(0,0,source.width,source.height);
        const origin=stubborn.getBoundingClientRect();
        [...stubborn.querySelectorAll('.opening-char.is-revealed')].forEach(glyph=>{
          const style=getComputedStyle(glyph),box=glyph.getBoundingClientRect(),fontSize=parseFloat(style.fontSize);
          sourceCtx.font=`${style.fontStyle} ${style.fontWeight} ${fontSize*fuzzyDpr}px ${style.fontFamily}`;
          sourceCtx.fillStyle='#393b3d';sourceCtx.textBaseline='alphabetic';
          const metrics=sourceCtx.measureText('Mg'),ascent=metrics.fontBoundingBoxAscent||fontSize*fuzzyDpr*.95,descent=metrics.fontBoundingBoxDescent||fontSize*fuzzyDpr*.23;
          const baseline=(box.height*fuzzyDpr-ascent-descent)/2+ascent;
          sourceCtx.fillText(glyph.textContent,(box.x-origin.x+12)*fuzzyDpr,(box.y-origin.y+8)*fuzzyDpr+baseline);
        });
        fuzzyDirty=false;
      }
      fuzzy.clearRect(0,0,fuzzyCanvas.width,fuzzyCanvas.height);
      const active=scene===2,amplitude=(active?2:innerWidth<700?.2:.4)*fuzzyDpr;
      const slice=Math.max(1,Math.round(1.4*fuzzyDpr));
      for(let y=0;y<source.height;y+=slice){
        const noise=Math.sin(y*1.93+step*4.77),shift=active?Math.round(noise*amplitude):noise*amplitude;
        fuzzy.drawImage(source,0,y,source.width,Math.min(slice,source.height-y),shift,y,source.width,Math.min(slice,source.height-y));
      }
    }
    function setScene(next){
      if(scene===next)return;scene=next;root.dataset.scene=String(next);
      lines.forEach((el,i)=>{el.classList.toggle('is-current',i===next);el.classList.toggle('is-visible',i<=next);});
    }
    function remove(){
      if(removed)return;removed=true;cancelAnimationFrame(frame);
      [fallback,removalTimer,bloomTimer,hintTimer].forEach(clearTimeout);
      events.abort();root.remove();particles.length=0;
      blocked.forEach(([el,wasInert])=>{if(el.isConnected)el.inert=wasInert;});
      if(previousFocus&&previousFocus!==document.body&&previousFocus.isConnected)previousFocus.focus({preventScroll:true});
    }
    function finish(skipped=false){
      if(leaving)return;leaving=true;cancelAnimationFrame(frame);clearTimeout(hintTimer);
      if(ctx)ctx.clearRect(0,0,innerWidth,innerHeight);
      if(fuzzy)fuzzy.clearRect(0,0,fuzzyCanvas.width,fuzzyCanvas.height);
      const bloomDuration=reduced.matches?0:skipped?220:950,revealDuration=reduced.matches?200:skipped?450:850;
      root.style.setProperty('--bloom-duration',`${bloomDuration}ms`);root.style.setProperty('--reveal-duration',`${revealDuration}ms`);
      root.classList.add('is-blooming');
      bloomTimer=setTimeout(()=>{root.classList.add('is-leaving');removalTimer=setTimeout(remove,revealDuration);},bloomDuration);
    }
    const began=performance.now();
    function render(now){
      if(leaving)return;const elapsed=now-began;
      if(elapsed>=duration-fade){finish();return;}
      const next=reduced.matches?3:elapsed<starts[1]?0:elapsed<starts[2]?1:elapsed<starts[3]?2:3;
      setScene(next);
      characters.forEach((glyphs,row)=>{
        const age=Math.max(0,elapsed-starts[row]);
        const count=row===2?Math.floor(age/330)*4+Math.min(4,Math.floor((age%330)/50)):1+Math.floor(age/characterInterval);
        const visible=reduced.matches||row<next?glyphs.length:row===next?Math.min(glyphs.length,count):0;
        glyphs.forEach((glyph,index)=>{
          if(index>=visible||glyph.classList.contains('is-revealed'))return;
          glyph.classList.add('is-revealed');emit(glyph,now);
          if(row===2)fuzzyDirty=true;
        });
      });
      paintParticles(now);updateFocus(elapsed);paintFuzzy(now,elapsed);
      if(holding!==null){const progress=clamp((now-holding)/650);skip.style.setProperty('--hold',String(progress));if(progress>=1){finish(true);return;}}
      frame=requestAnimationFrame(render);
    }
    function hideHint() {
      if (holding !== null || document.activeElement === skip) return;
      skip.classList.remove('is-visible');
      skip.tabIndex = -1;
      skip.setAttribute('aria-hidden', 'true');
    }
    function showHint() {
      if (leaving) return;
      skip.classList.add('is-visible');
      skip.tabIndex = 0;
      skip.setAttribute('aria-hidden', 'false');
      clearTimeout(hintTimer);
      hintTimer = setTimeout(hideHint, 2000);
    }
    function beginHold(source) {
      showHint();
      if (holding !== null) return;
      holding = performance.now();
      holdSource = source;
    }
    function release(source) {
      if (source && source !== holdSource) return;
      holding = null; holdSource = null;
      skip.style.setProperty('--hold', '0');
      if (!leaving && skip.classList.contains('is-visible')) {
        clearTimeout(hintTimer);
        hintTimer = setTimeout(hideHint, 2000);
      }
    }
    addEventListener('keydown', e => {
      if (leaving) return;
      showHint();
      const key = e.key.toLowerCase();
      const modified = e.metaKey || e.ctrlKey || e.altKey;
      const activatesSkip = !modified && (key === 'e' || (e.target === skip && ['Enter', ' '].includes(e.key)));
      if (activatesSkip) {
        e.preventDefault();
        if (!e.repeat) beginHold(`key:${key}`);
      }
      if (e.key === 'Tab') { e.preventDefault(); skip.focus({ preventScroll: true }); }
      if (!modified && ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(e.key)) e.preventDefault();
      // Any input reveals the hint; the underlying page stays idle.
      e.stopImmediatePropagation();
    }, { capture: true, signal });
    addEventListener('keyup', e => release(`key:${e.key.toLowerCase()}`), { signal });
    addEventListener('pointerdown', showHint, { capture: true, signal });
    addEventListener('pointermove', e => { if (e.movementX || e.movementY) showHint(); }, { passive: true, signal });
    addEventListener('wheel', e => { showHint(); e.preventDefault(); e.stopImmediatePropagation(); }, { capture: true, passive: false, signal });
    root.addEventListener('touchmove', e => { showHint(); e.preventDefault(); }, { passive: false, signal });
    skip.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      e.preventDefault();
      beginHold(`pointer:${e.pointerId}`);
      skip.setPointerCapture(e.pointerId);
    }, { signal });
    skip.addEventListener('pointerup', e => release(`pointer:${e.pointerId}`), { signal });
    skip.addEventListener('pointercancel', e => release(`pointer:${e.pointerId}`), { signal });
    skip.addEventListener('lostpointercapture', e => release(`pointer:${e.pointerId}`), { signal });
    // Screen reader activation remains available without requiring a physical key hold.
    skip.addEventListener('click', e => { if (e.detail === 0) finish(true); }, { signal });
    skip.addEventListener('contextmenu', e => e.preventDefault(), { signal });
    skip.addEventListener('blur', () => release(), { signal });
    addEventListener('blur', () => release(), { signal });
    addEventListener('hashchange', remove, { signal });
    addEventListener('pagehide', remove, { signal });
    document.addEventListener('visibilitychange', () => { if (document.hidden) remove(); }, { signal });
    reduced.addEventListener('change', () => finish(true), { signal });
    addEventListener('resize', resize, { signal });
    document.fonts.ready.then(() => { if (!removed && !leaving) resize(true); });
    fallback=setTimeout(remove,duration+400);
    try{resize();setScene(reduced.matches?3:0);frame=requestAnimationFrame(render);}
    catch(error){remove();console.error('Opening animation:',error);}
  }
  function ready(){
    Promise.race([document.fonts.load('400 32px "Google Sans"'),new Promise(resolve=>setTimeout(resolve,1000))]).then(start);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();
