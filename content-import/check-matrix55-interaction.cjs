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


await send('Page.enable');await send('Runtime.enable');

await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
await send('Page.navigate',{url:'http://127.0.0.1:4176/?revision=55&test=interaction#home'});await pause(1800);
const snapshot=()=>ev(`document.querySelector('.scroll-matrix').toDataURL()`);
const first=await snapshot();await pause(400);const animated=first!==await snapshot();
await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:1140,y:400});await pause(400);await shot('matrix55-hover');
await ev(`location.hash='#archive'`);await pause(2700);const off=await snapshot();await pause(300);const paused=off===await snapshot();
await ev(`location.hash='#home'`);await pause(2700);
await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await pause(100);const still=await snapshot();await pause(300);const reduced=still===await snapshot();
await ev(`document.querySelector('.pixel-scroll').click()`);await pause(200);const activated=await ev(`document.querySelector('#portfolio-motion').dataset.active==='0'`);
const result={animated,paused,reduced,activated,errors};console.log(result);fs.writeFileSync('content-import/matrix55-check.json',JSON.stringify(result,null,2));await send('Browser.close');ws.close();})().catch(e=>{console.error(e);process.exit(1)});
