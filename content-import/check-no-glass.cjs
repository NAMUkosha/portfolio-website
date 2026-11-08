const fs=require('node:fs');
(async()=>{
 const tabs=await(await fetch('http://127.0.0.1:9238/json')).json();const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));let seq=0;const pending=new Map(),errors=[];
 ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result);}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails);if(m.method==='Network.responseReceived'&&m.params.response.status>=400&&!m.params.response.url.endsWith('/favicon.ico'))errors.push(m.params.response.url);});
 const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
 const ev=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw r.exceptionDetails;return r.result.value;};
 const pause=ms=>new Promise(r=>setTimeout(r,ms));const reports=[];
 const shot=async name=>{const r=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync('content-import/no-glass-'+name+'.png',Buffer.from(r.data,'base64'));};
 const state=()=>ev(`({width:innerWidth,view:document.body.dataset.view,active:+document.body.dataset.active,moreVisible:!document.querySelector('#more').hidden,title:document.querySelector('#home-title').textContent,overflow:document.documentElement.scrollWidth>innerWidth,glass:document.documentElement.classList.contains('edge-glass-active'),refracted:document.querySelectorAll('.edge-glass-source').length,visible:[...document.querySelectorAll('.card')].filter(c=>{const b=c.getBoundingClientRect();return b.right>0&&b.left<innerWidth&&b.bottom>0&&b.top<innerHeight&&+c.style.opacity>0;}).map(c=>c.getAttribute('aria-label'))})`);
 const wheel=delta=>send('Input.dispatchMouseEvent',{type:'mouseWheel',x:600,y:450,deltaX:0,deltaY:delta});



 await send('Page.enable');await send('Runtime.enable');await send('Network.enable');
 for(const width of [1440,390]){
  await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<700});
  await send('Page.navigate',{url:'http://127.0.0.1:4175/?revision=45#home'});await pause(1200);
  const ids=await ev(`notes.filter(n=>!n.private).map(n=>n.id)`);
  for(const id of ids){
   await ev(`openProject(${JSON.stringify(id)})`);await pause(150);
   const result=await ev(`({id:${JSON.stringify(id)},width,open:!document.querySelector('#note-reading').hidden,oldLinks:document.querySelectorAll('a[href*="wenjiashi.space"]').length,glass:document.querySelectorAll('.edge-glass-canvas,.edge-glass-source').length,overflow:document.documentElement.scrollWidth>innerWidth})`.replace('width,',`width:${width},`));
   reports.push(result);
   if(id==='gofie'){
    await ev(`Promise.all([...document.querySelectorAll('#note-reading img')].map(i=>{i.loading='eager';return i.decode().catch(()=>null)}))`);
    for(const fraction of [0,.5,1]){await ev(`document.querySelector('#note-reading').scrollTop=document.querySelector('#note-reading').scrollHeight*${fraction}`);await pause(200);if(fraction===.5)await shot('gofie-'+width);}
    reports.push({width,gofieImages:await ev(`[...document.querySelectorAll('#note-reading img')].every(i=>i.naturalWidth>0)`)});
   }
   await ev('closeNote()');
  }
  await ev(`showPage('archive')`);await pause(3000);
  await ev(`document.querySelectorAll('#portfolio-motion #index button')[7].click()`);await pause(1800);
  reports.push({width,archive:await ev(`({active:document.querySelector('#portfolio-motion').dataset.active,cards:document.querySelectorAll('#portfolio-motion .card').length,glass:document.querySelectorAll('canvas').length,overflow:document.documentElement.scrollWidth>innerWidth})`)});
 }
 for(const entry of ['space.html','motion-study.html']){await send('Page.navigate',{url:'http://127.0.0.1:4175/'+entry});await pause(1000);reports.push({entry,glass:await ev(`document.querySelectorAll('.edge-glass-canvas,.edge-glass-source').length`)});}
 fs.writeFileSync('content-import/no-glass-check.json',JSON.stringify({reports,errors},null,2));console.log(JSON.stringify({reports,errors}));await send('Browser.close');ws.close();})().catch(e=>{console.error(e);process.exit(1)});

