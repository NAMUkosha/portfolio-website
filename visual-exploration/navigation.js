(() => {
  const nav = document.querySelector('.site-header nav');
  if (!nav) return;
  const marker = document.createElement('span');
  marker.className = 'nav-selection'; marker.setAttribute('aria-hidden', 'true'); nav.prepend(marker);
  let frame = 0;
  function position() {
    frame = 0;
    const active = nav.querySelector('a[aria-current="page"]');
    marker.hidden = !active;
    if (!active) return;
    const bounds = active.getBoundingClientRect(), parent = nav.getBoundingClientRect();
    marker.style.width = `${bounds.width}px`;
    marker.style.transform = `translateX(${bounds.left - parent.left - nav.clientLeft}px)`;
  }
  const schedule = () => { if (!frame) frame = requestAnimationFrame(position); };
  new MutationObserver(schedule).observe(nav, { subtree: true, attributes: true, attributeFilter: ['aria-current'] });
  new ResizeObserver(schedule).observe(nav);
  document.fonts.ready.then(schedule); position();
})();
