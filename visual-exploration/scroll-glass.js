// Pointer interaction for the closed 3D glass volume.
(() => {
  const scene = document.querySelector('#portfolio-motion');
  const button = scene?.querySelector('.scroll-cue');
  const stage = button?.querySelector('.scroll-glass');
  const object = stage?.querySelector('.glass-object');
  if (!object) return;
  let volume = null;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let x = 0, y = 0, vx = 0, vy = 0, tx = 0, ty = 0, frame = 0, last = 0;
  let engagement = 0, targetEngagement = 0;
  const visible = () => !document.hidden && !scene.hidden && !scene.inert && scene.classList.contains('is-greeting');
  function render() {
    if (volume && object.classList.contains('has-volume')) {
      object.style.transform = `translate3d(${x * 1.5}px,${y - engagement * 2}px,${engagement * 5}px) scale(${1 + engagement * .018})`;
      volume(x, y, engagement);
    } else {
      object.style.transform = `rotateX(${-y * 5}deg) rotateY(${x * 8}deg)`;
      object.style.setProperty('--shine-x', `${35 + x * 16}%`);
      object.style.setProperty('--shine-opacity', String((Math.abs(x) + Math.abs(y)) * .08));
    }
  }
  function tick(now) {
    frame = 0;
    if (!visible()) return;
    const dt = Math.min((now - last) / 1000, .032); last = now;
    vx += ((tx - x) * 65 - vx * 12) * dt; vy += ((ty - y) * 65 - vy * 12) * dt;
    x += vx * dt; y += vy * dt;
    engagement += (targetEngagement - engagement) * (1 - Math.exp(-dt * 8));
    const settled = Math.abs(tx - x) + Math.abs(ty - y) + Math.abs(vx) + Math.abs(vy) + Math.abs(targetEngagement - engagement) < .001;
    if (settled) { x = tx; y = ty; vx = vy = 0; engagement = targetEngagement; }
    render(); if (!settled) frame = requestAnimationFrame(tick);
  }
  function start() {
    if (!frame && visible() && !reduced.matches) { last = performance.now(); frame = requestAnimationFrame(tick); }
  }
  function reset() { tx = ty = targetEngagement = 0; start(); }
  button.addEventListener('pointerenter', e => { if (!reduced.matches && e.pointerType !== 'touch') { targetEngagement = 1; start(); } });
  button.addEventListener('pointermove', e => {
    if (reduced.matches || e.pointerType === 'touch') return;
    const b = stage.getBoundingClientRect();
    targetEngagement = 1;
    tx = Math.max(-1, Math.min(1, (e.clientX - b.left) / b.width * 2 - 1));
    ty = Math.max(-1, Math.min(1, (e.clientY - b.top) / b.height * 2 - 1)) * .7; start();
  });
  button.addEventListener('pointerleave', reset); button.addEventListener('pointercancel', reset);
  button.addEventListener('focus', () => { if (!reduced.matches) { tx = .3; ty = -.15; targetEngagement = 1; start(); } });
  button.addEventListener('blur', reset);
  function sync() {
    cancelAnimationFrame(frame); frame = 0; x = y = tx = ty = vx = vy = engagement = targetEngagement = 0;
    if (visible()) render();
  }
  new MutationObserver(sync).observe(scene, { attributes: true, attributeFilter: ['class', 'hidden', 'inert'] });
  document.addEventListener('visibilitychange', sync); reduced.addEventListener('change', sync);
  volume = window.createGlassVolume?.(object);
  render();
})();
