// Password-derived keys and decrypted media live only in this tab's memory.
const privateVault=(()=>{
 let key=null,content=null,observer=null,events=null,epoch=0;
 const blobs=new Map(),jobs=new Map(),base='assets/private/';
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const bytes=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
 async function fetchBytes(file){const response=await fetch(base+file,{cache:'no-store'});if(!response.ok)throw Error('LOAD_FAILED');return new Uint8Array(await response.arrayBuffer());}
 async function decrypt(data,useKey){return crypto.subtle.decrypt({name:'AES-GCM',iv:data.slice(0,12)},useKey,data.slice(12));}
 async function unlock(password){
  const response=await fetch(base+'config.json',{cache:'no-store'});if(!response.ok)throw Error('LOAD_FAILED');const config=await response.json();
  const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveKey']);
  const candidate=await crypto.subtle.deriveKey({name:'PBKDF2',salt:bytes(config.salt),iterations:config.iterations,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['decrypt']);
  const encrypted=await fetchBytes(config.manifest);let decoded;
  try{decoded=await decrypt(encrypted,candidate);}catch{throw Error('INVALID_PASSWORD');}
  const parsed=JSON.parse(new TextDecoder().decode(decoded));key=candidate;content=parsed;
 }
 async function imageURL(file){
  if(!key)throw Error('LOCKED');if(blobs.has(file))return blobs.get(file);if(jobs.has(file))return jobs.get(file);
  const generation=epoch,useKey=key;
  const promise=(async()=>{const encrypted=await fetchBytes(file),plain=await decrypt(encrypted,useKey);if(generation!==epoch)throw Error('LOCKED');const url=URL.createObjectURL(new Blob([plain],{type:'image/png'}));blobs.set(file,url);return url;})();
  jobs.set(file,promise);try{return await promise;}finally{jobs.delete(file);}
 }
 function stopImages(){observer?.disconnect();observer=null;events?.abort();events=null;}
 function lock(){stopImages();epoch++;key=null;content=null;for(const url of blobs.values())URL.revokeObjectURL(url);blobs.clear();jobs.clear();}
 const figure=p=>`<figure class="private-figure"><button class="private-image-open" data-private-open aria-label="Enlarge ${esc(p.caption)}"><img data-private-asset="${esc(p.file)}" alt="${esc(p.caption)}" width="1920" height="1080" decoding="async"></button><figcaption>${esc(p.caption)}<span class="private-image-status" role="status"></span></figcaption></figure>`;
 function markup(id){
  const project=content?.[id];if(!project)throw Error('LOCKED');
  return `<article class="private-case" data-private-case="${id}" data-edge-glass="off"><header id="${id}-overview" data-project-index="Overview"><p class="small">${esc(project.eyebrow)}</p><h1>${esc(project.title)}</h1><p>${esc(project.intro)}</p><p class="private-credits">${esc(project.credits)}</p></header>${project.sections.map((s,i)=>`<section id="${id}-section-${i}" data-project-index="${esc(s.title)}"><div class="private-copy"><p class="small">${String(i+1).padStart(2,'0')}</p><h2>${esc(s.title)}</h2><p>${esc(s.text)}</p></div>${s.images.map(figure).join('')}</section>`).join('')}<section id="${id}-original" data-project-index="Complete presentation"><div class="private-copy"><h2>The complete presentation</h2><p>Browse all ${project.deck.length} original pages. Select a page or open it at full size.</p></div><div class="private-deck" data-deck-index="0"><div class="private-deck-controls"><button data-deck-step="-1" aria-label="Previous page" disabled>←</button><label>Page <select aria-label="Presentation page">${project.deck.map((p,i)=>`<option value="${i}">${i+1} / ${project.deck.length}</option>`).join('')}</select></label><button data-deck-step="1" aria-label="Next page">→</button></div><div class="private-deck-page">${figure(project.deck[0])}</div><details class="private-transcript"><summary>Read page text</summary><p>${esc(project.deck[0].text)}</p></details></div></section><dialog class="private-image-dialog" aria-label="Full-size project page"><button class="private-image-close" aria-label="Close enlarged page">Close ×</button><div><img alt=""></div></dialog></article>`;
 }
 function startImages(reader){
  stopImages();events=new AbortController();const signal=events.signal,root=reader.querySelector('[data-private-case]');if(!root)return;
  const project=content[root.dataset.privateCase],dialog=root.querySelector('dialog');
  async function load(img){if(img.dataset.loaded||img.dataset.loading)return;img.dataset.loading='true';const file=img.dataset.privateAsset,status=img.closest('figure').querySelector('.private-image-status');try{const url=await imageURL(file);if(signal.aborted||!img.isConnected)return;img.src=url;img.dataset.loaded='true';if(status)status.textContent='';}catch{if(!signal.aborted&&status)status.textContent=' Image could not load. Click to retry.';}finally{delete img.dataset.loading;}}
  observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){observer.unobserve(e.target);load(e.target);}}),{root:reader,rootMargin:'400px 0px'});
  root.querySelectorAll('[data-private-asset]').forEach(img=>observer.observe(img));
  const deck=root.querySelector('.private-deck');
  function select(index){index=Math.max(0,Math.min(project.deck.length-1,index));deck.dataset.deckIndex=index;deck.querySelector('select').value=index;deck.querySelector('[data-deck-step="-1"]').disabled=index===0;deck.querySelector('[data-deck-step="1"]').disabled=index===project.deck.length-1;deck.querySelector('.private-deck-page').innerHTML=figure(project.deck[index]);deck.querySelector('.private-transcript p').textContent=project.deck[index].text;load(deck.querySelector('img'));}
  deck.querySelector('select').addEventListener('change',e=>select(+e.target.value),{signal});
  root.addEventListener('click',async e=>{const step=e.target.closest('[data-deck-step]');if(step){select(+deck.dataset.deckIndex + +step.dataset.deckStep);return;}
   if(e.target.closest('.private-image-close')||e.target===dialog){dialog.close();return;}
   const trigger=e.target.closest('[data-private-open]');if(!trigger)return;const source=trigger.querySelector('img');await load(source);if(signal.aborted||!source.dataset.loaded)return;const large=dialog.querySelector('img');large.src=source.src;large.alt=source.alt;dialog.showModal();
  },{signal});
 }
 return {unlock,lock,markup,startImages,stopImages};
})();
