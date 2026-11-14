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
 await send('Page.navigate',{url:'http://127.0.0.1:4176/?revision=50&width='+width+'#home'});await pause(3500);
 await shot('greeting-'+width);
 for(const origin of ['home','archive']){
 await ev(`location.hash='#${origin}'`);await pause(2800);
 const ids=await ev(`notes.filter(n=>!n.private).map(n=>n.id)`);
 for(const id of ids){await ev(`openProject('${id}')`);await pause(160);
 reports.push(await ev(`(()=>{const c=document.querySelector('#close-note'),b=c.getBoundingClientRect();return {width:innerWidth,origin:'${origin}',id:'${id}',open:!document.querySelector('#note-reading').hidden,closeHit:c.contains(document.elementFromPoint(b.x+b.width/2,b.y+b.height/2)),overflow:document.documentElement.scrollWidth>innerWidth}})()`));
 await ev('closeNote()');}
 }
 await ev("location.hash='#home'");await pause(2800);await ev("document.querySelector('.pixel-scroll').click()");await pause(1400);await shot('selected-'+width);
 await ev("location.hash='#archive'");await pause(120);await ev("location.hash='#home'");await pause(3000);
 reports.push(await ev(`({width:innerWidth,mode:document.querySelector('#portfolio-motion').dataset.view,page:document.body.dataset.page,archiveHidden:getComputedStyle(document.querySelector('#portfolio-motion .archive-copy')).visibility,ghosts:document.querySelectorAll('.motion-copy-ghost').length})`));
 await ev("document.querySelector('#access').click()");await pause(200);reports.push({width,password:await ev("document.querySelector('#password-dialog').open")});await ev("document.querySelector('#password-dialog').close()");
 }
 fs.writeFileSync('content-import/stability50-check.json',JSON.stringify({reports,errors},null,2));console.log(JSON.stringify({reports,errors}));await send('Browser.close');ws.close();})().catch(e=>{console.error(e);process.exit(1)});

