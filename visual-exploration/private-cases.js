// Passwords are never stored. A non-exportable key can resume this tab after reload.
const privateVault=(()=>{
 let key=null,content=null,observer=null,events=null,epoch=0;
 const blobs=new Map(),jobs=new Map(),base='assets/private/';
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const bytes=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
 async function fetchBytes(file){const response=await fetch(base+file,{cache:'no-store'});if(!response.ok)throw Error('LOAD_FAILED');return new Uint8Array(await response.arrayBuffer());}
 async function decrypt(data,useKey){return crypto.subtle.decrypt({name:'AES-GCM',iv:data.slice(0,12)},useKey,data.slice(12));}
 // IndexedDB supports structured cloning of non-exportable CryptoKeys.
 async function sessionKey(mode,value){
  let token=sessionStorage.getItem('wenjia-vault-session');
  if(!token&&mode!=='put')return null;
  if(!token){token=crypto.randomUUID();sessionStorage.setItem('wenjia-vault-session',token);}
  const db=await new Promise((resolve,reject)=>{const req=indexedDB.open('wenjia-private-session',1);req.onupgradeneeded=()=>req.result.createObjectStore('keys');req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});
  try{return await new Promise((resolve,reject)=>{const tx=db.transaction('keys',mode==='get'?'readonly':'readwrite'),store=tx.objectStore('keys'),req=mode==='put'?store.put(value,token):mode==='delete'?store.delete(token):store.get(token);let result;req.onsuccess=()=>{result=req.result;};tx.oncomplete=()=>resolve(result);tx.onerror=()=>reject(tx.error);});}finally{db.close();}
 }
 async function restore(){
  try{const candidate=await sessionKey('get');if(!candidate)return false;
   const response=await fetch(base+'config.json',{cache:'no-store'});if(!response.ok)return false;
   const config=await response.json(),decoded=await decrypt(await fetchBytes(config.manifest),candidate);
   content=JSON.parse(new TextDecoder().decode(decoded));key=candidate;return true;
  }catch{return false;}
 }
 async function unlock(password){
  const response=await fetch(base+'config.json',{cache:'no-store'});if(!response.ok)throw Error('LOAD_FAILED');const config=await response.json();
  const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveKey']);
  const candidate=await crypto.subtle.deriveKey({name:'PBKDF2',salt:bytes(config.salt),iterations:config.iterations,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['decrypt']);
  const encrypted=await fetchBytes(config.manifest);let decoded;
  try{decoded=await decrypt(encrypted,candidate);}catch{throw Error('INVALID_PASSWORD');}
  const parsed=JSON.parse(new TextDecoder().decode(decoded));key=candidate;content=parsed;try{await sessionKey('put',key);}catch{ /* Memory-only access remains available when storage is unavailable. */ }
 }
 async function imageURL(file){
  if(!key)throw Error('LOCKED');if(blobs.has(file))return blobs.get(file);if(jobs.has(file))return jobs.get(file);
  const generation=epoch,useKey=key;
  const promise=(async()=>{const encrypted=await fetchBytes(file),plain=await decrypt(encrypted,useKey);if(generation!==epoch)throw Error('LOCKED');const url=URL.createObjectURL(new Blob([plain],{type:'image/png'}));blobs.set(file,url);return url;})();
  jobs.set(file,promise);try{return await promise;}finally{jobs.delete(file);}
 }
 function stopImages(){observer?.disconnect();observer=null;events?.abort();events=null;}
 function lock(){sessionKey('delete').catch(()=>{});stopImages();epoch++;key=null;content=null;for(const url of blobs.values())URL.revokeObjectURL(url);blobs.clear();jobs.clear();}
 const figure=p=>`<figure class="private-figure"><button class="private-image-open" data-private-open aria-label="Enlarge ${esc(p.caption)}"><img data-private-asset="${esc(p.file)}" alt="${esc(p.caption)}" width="1920" height="1080" decoding="async"></button><figcaption>${esc(p.caption)}<span class="private-image-status" role="status"></span></figcaption></figure>`;
 function markup(id){
  const project=content?.[id];if(!project)throw Error('LOCKED');
  return `<article class="private-case" data-private-case="${id}" data-edge-glass="off">${project.header || `<header id="${id}-overview" data-project-index="Overview"><p class="small">${esc(project.eyebrow)}</p><h1>${esc(project.title)}</h1><p>${esc(project.intro)}</p><p class="private-credits">${esc(project.credits)}</p></header>`}${project.body || project.sections.map((s,i)=>`<section id="${id}-section-${i}" data-project-index="${esc(s.title)}"><div class="private-copy"><p class="small">${String(i+1).padStart(2,'0')}</p><h2>${esc(s.title)}</h2><p>${esc(s.text)}</p></div>${s.images.map(figure).join('')}</section>`).join('')}<section id="${id}-original" data-project-index="Complete presentation"><div class="private-copy"><h2>The complete presentation</h2><p>Swipe across the image or use the side arrows to browse all ${project.deck.length} pages. Select the image to enlarge.</p></div><div class="private-deck" data-deck-index="0"><div class="private-deck-stage" tabindex="0" aria-label="Presentation viewer. Use left and right arrow keys."><div class="private-deck-page">${figure(project.deck[0])}</div><button class="deck-arrow deck-prev" data-deck-step="-1" aria-label="Previous page" disabled><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 6-6 6 6 6"/></svg></button><button class="deck-arrow deck-next" data-deck-step="1" aria-label="Next page"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg></button></div><div class="private-deck-controls"><label>Page <select aria-label="Presentation page">${project.deck.map((p,i)=>`<option value="${i}">${i+1} / ${project.deck.length}</option>`).join('')}</select></label><span class="deck-announcement" aria-live="polite">1 / ${project.deck.length}</span></div></div></section><dialog class="private-image-dialog" aria-label="Full-size project page"><button class="private-image-close" aria-label="Close enlarged page">Close ×</button><div><img alt=""></div></dialog></article>`;
 }
 function startImages(reader){
  stopImages();events=new AbortController();const signal=events.signal,root=reader.querySelector('[data-private-case]');if(!root)return;
  const project=content[root.dataset.privateCase],dialog=root.querySelector('dialog');
  async function load(img){if(img.dataset.loaded||img.dataset.loading)return;img.dataset.loading='true';const file=img.dataset.privateAsset,status=img.closest('figure').querySelector('.private-image-status');try{const url=await imageURL(file);if(signal.aborted||!img.isConnected)return;img.src=url;img.dataset.loaded='true';if(status)status.textContent='';}catch{if(!signal.aborted&&status)status.textContent=' Image could not load. Click to retry.';}finally{delete img.dataset.loading;}}
  observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){observer.unobserve(e.target);load(e.target);}}),{root:reader,rootMargin:'400px 0px'});
  root.querySelectorAll('[data-private-asset]').forEach(img=>observer.observe(img));
  const deck=root.querySelector('.private-deck');
  let deckRequest=0,shownIndex=0;
  async function select(index){
   index=Math.max(0,Math.min(project.deck.length-1,index));const request=++deckRequest;deck.dataset.deckIndex=index;deck.querySelector('select').value=index;deck.querySelector('[data-deck-step="-1"]').disabled=index===0;deck.querySelector('[data-deck-step="1"]').disabled=index===project.deck.length-1;deck.setAttribute('aria-busy','true');
   try{const url=await imageURL(project.deck[index].file),ready=new Image();ready.src=url;await ready.decode();if(signal.aborted||request!==deckRequest)return;const box=document.createElement('div');box.innerHTML=figure(project.deck[index]);const img=box.querySelector('img');img.src=url;img.dataset.loaded='true';deck.querySelector('.private-deck-page').replaceChildren(...box.childNodes);shownIndex=index;deck.querySelector('.deck-announcement').textContent=`${index+1} / ${project.deck.length}`;for(const next of [index-1,index+1])if(project.deck[next])imageURL(project.deck[next].file).catch(()=>{});
   }catch{if(request===deckRequest&&!signal.aborted){deck.dataset.deckIndex=shownIndex;deck.querySelector('select').value=shownIndex;deck.querySelector('[data-deck-step="-1"]').disabled=shownIndex===0;deck.querySelector('[data-deck-step="1"]').disabled=shownIndex===project.deck.length-1;deck.querySelector('.deck-announcement').textContent='Page could not load. Please try again.';}}
   finally{if(request===deckRequest)deck.removeAttribute('aria-busy');}
  }
  if(project.deck[1])imageURL(project.deck[1].file).catch(()=>{});
  deck.querySelector('select').addEventListener('change',e=>select(+e.target.value),{signal});
  function activate(tab,focus=false){const group=tab.closest('[data-case-switch]');group.querySelectorAll('[data-case-tab]').forEach(b=>{const on=b===tab;b.setAttribute('aria-selected',on);b.tabIndex=on?0:-1;root.querySelector('#'+b.getAttribute('aria-controls')).hidden=!on;});if(focus)tab.focus();root.dispatchEvent(new CustomEvent('case:change',{detail:{tab}}));}
  if(root.dataset.privateCase==='google')startGoogleCase(root,reader,signal,activate);
  root.addEventListener('keydown',e=>{const tab=e.target.closest('[data-case-tab]');if(!tab||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const all=[...tab.closest('[data-case-switch]').querySelectorAll('[data-case-tab]')],i=all.indexOf(tab);activate(all[e.key==='Home'?0:e.key==='End'?all.length-1:(i+(e.key==='ArrowRight'?1:-1)+all.length)%all.length],true);},{signal});
  root.addEventListener('change',e=>{const checklist=e.target.closest('.case-checklist');if(checklist)checklist.querySelector('output').textContent=`${checklist.querySelectorAll('input:checked').length} / 3 reviewed`;},{signal});
  const stage=deck.querySelector('.private-deck-stage');let gesture=null,suppressClickUntil=0;
  stage.addEventListener('pointerdown',e=>{if(e.target.closest('.deck-arrow')||e.button!==0)return;gesture={x:e.clientX,y:e.clientY,id:e.pointerId};},{signal});
  stage.addEventListener('pointerup',e=>{if(!gesture||e.pointerId!==gesture.id)return;const dx=e.clientX-gesture.x,dy=e.clientY-gesture.y;gesture=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3){suppressClickUntil=performance.now()+500;select(+deck.dataset.deckIndex+(dx<0?1:-1));}},{signal});
  stage.addEventListener('pointercancel',()=>gesture=null,{signal});
  stage.addEventListener('dragstart',e=>e.preventDefault(),{signal});
  stage.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();select(+deck.dataset.deckIndex+(e.key==='ArrowRight'?1:-1));},{signal});
  root.addEventListener('click',async e=>{if(stage.contains(e.target)&&performance.now()<suppressClickUntil){e.preventDefault();return;}const tab=e.target.closest('[data-case-tab]');if(tab){activate(tab);return;}const step=e.target.closest('[data-deck-step]');if(step){select(+deck.dataset.deckIndex + +step.dataset.deckStep);return;}
   if(e.target.closest('.private-image-close')||e.target===dialog){dialog.close();return;}
   const trigger=e.target.closest('[data-private-open]');if(!trigger)return;const source=trigger.querySelector('img');await load(source);if(signal.aborted||!source.dataset.loaded)return;const large=dialog.querySelector('img');large.src=source.src;large.alt=source.alt;dialog.showModal();
  },{signal});
 }
 async function hydrateCovers(root=document){if(!key||!content)return;const generation=epoch;await Promise.all([...root.querySelectorAll('[data-private-cover]')].map(async img=>{try{const name=img.dataset.privateCover;const file=({google:'new-google-cover.enc',unity:'new-unity-cover.enc','unity-model':'new-unity-model.enc','unity-monitor':'new-unity-monitor.enc'})[name]||content[name]?.cover;if(!file)return;const url=await imageURL(file);if(generation===epoch&&img.isConnected){img.src=url;img.dataset.unlocked='true';}}catch{ /* The safe preview stays visible if loading fails. */ }}));}
 return {unlock,restore,lock,markup,startImages,stopImages,hydrateCovers};
})();
