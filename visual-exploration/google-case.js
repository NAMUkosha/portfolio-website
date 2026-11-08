// Case interactions use native DOM controls and the reader’s abort signal.
function startGoogleCase(root,signal,activate){
 const reduce=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(hover: hover) and (pointer: fine)');
 root.addEventListener('click',e=>{const a=e.target.closest('a[href^="#google-"]');if(!a)return;const target=root.querySelector(a.getAttribute('href'));if(target){e.preventDefault();e.stopPropagation();target.scrollIntoView({behavior:reduce.matches?'instant':'smooth',block:'start'});}},{signal});
 const map=root.querySelector('.gc-map'),plot=map?.querySelector('.gc-plot');
 if(plot){
  const bubbles=[...plot.querySelectorAll('[data-glass-bubble]')],focus=map.querySelector('.gc-focus-toggle');
  for(const button of bubbles){button.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'&&fine.matches)activate(button);},{signal});button.addEventListener('focus',()=>activate(button),{signal});}
  focus.addEventListener('click',()=>{const on=focus.getAttribute('aria-pressed')!=='true';focus.setAttribute('aria-pressed',on);map.classList.toggle('focused',on);if(on){const current=bubbles.find(b=>b.getAttribute('aria-selected')==='true');if(current?.dataset.focus!=='true')activate(bubbles[0]);}},{signal});
  // Older encrypted case content includes an unused rendering surface.
  plot.querySelector('canvas')?.remove();
 }
 const recovery=root.querySelector('[data-recovery]');
 if(recovery){
  const tabs=[...recovery.querySelectorAll('[role=tab]')],panels=[...recovery.querySelectorAll('[role=tabpanel]')],checks=[...recovery.querySelectorAll('[data-recovery-check]')];
  function stage(n,focus=false){recovery.dataset.stage=n;tabs.forEach((t,i)=>{t.setAttribute('aria-selected',i===n);t.tabIndex=i===n?0:-1;panels[i].hidden=i!==n;});if(focus)tabs[n].focus({preventScroll:true});}
  function progress(){checks.forEach((c,i)=>{c.disabled=i>0&&!checks[i-1].checked;if(c.disabled)c.checked=false;});const n=checks.filter(c=>c.checked).length;recovery.querySelector('output').textContent=`${n} / 3 steps reviewed`;recovery.querySelector('[data-recovery-summary]').textContent=`${n} of 3 steps reviewed.`;}
  recovery.addEventListener('click',e=>{const b=e.target.closest('[data-recovery-stage]');if(b){stage(+b.dataset.recoveryStage,b.getAttribute('role')!=='tab');return;}if(e.target.closest('[data-recovery-reset]')){checks.forEach(c=>c.checked=false);progress();stage(0,true);}},{signal});
  recovery.addEventListener('change',progress,{signal});
  recovery.addEventListener('keydown',e=>{const i=tabs.indexOf(e.target);if(i<0||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();stage(e.key==='Home'?0:e.key==='End'?2:(i+(e.key==='ArrowRight'?1:2))%3,true);},{signal});
 }
}
