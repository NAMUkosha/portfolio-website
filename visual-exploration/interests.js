(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('.interest-flip').forEach(card => {
    let start = null, dragged = false;
    const reset = () => { card.style.removeProperty('--tilt-x'); card.style.removeProperty('--tilt-y'); card.style.removeProperty('--glare'); };
    card.addEventListener('pointerdown', e => { start = {x:e.clientX,y:e.clientY}; dragged = false; });
    card.addEventListener('pointermove', e => {
      if (start && Math.hypot(e.clientX-start.x,e.clientY-start.y)>8) dragged = true;
      if (reduced.matches || (e.pointerType !== 'mouse' && !start)) return;
      const r=card.getBoundingClientRect(), x=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)), y=Math.max(0,Math.min(1,(e.clientY-r.top)/r.height));
      card.style.setProperty('--tilt-x', `${(0.5-y)*12}deg`); card.style.setProperty('--tilt-y', `${(x-0.5)*12}deg`);
      card.style.setProperty('--glare-x', `${x*100}%`); card.style.setProperty('--glare-y', `${y*100}%`); card.style.setProperty('--glare','1');
    });
    card.addEventListener('pointerup', () => { start=null; if (!matchMedia('(hover:hover)').matches) reset(); });
    card.addEventListener('pointercancel', () => { start=null; reset(); });
    card.addEventListener('pointerleave', () => { start=null; reset(); });
    card.addEventListener('click', e => {
      if (dragged && e.detail !== 0) { dragged=false; e.preventDefault(); return; }
      dragged=false;
      const flipped=card.getAttribute('aria-pressed') !== 'true'; card.setAttribute('aria-pressed', String(flipped));
      card.setAttribute('aria-label', `${flipped ? 'Hide' : 'Show'} details for ${card.dataset.title || card.closest('figure')?.querySelector('figcaption h3')?.textContent || 'card'}`);
    });
  });
  const intro=document.querySelector('.biography .bio-intro');
  if(intro){ const update=()=>intro.style.setProperty('--bio-sticky-top', `${Math.min(141, innerHeight-intro.offsetHeight-24)}px`); new ResizeObserver(update).observe(intro); addEventListener('resize',update); update(); }
})();
