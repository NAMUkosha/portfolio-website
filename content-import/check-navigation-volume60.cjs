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

const results=[];
for(const width of [1440,390]){
await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<700});
await send('Page.navigate',{url:'http://127.0.0.1:4176/?revision=60&qa='+width+'#home'});await pause(1800);await shot('volume60-final-'+width);
await ev(`document.querySelector('.scroll-cue').click()`);await pause(1400);await ev(`document.querySelector('.identity').click()`);await pause(1600);
results.push(await ev(`({width:innerWidth,identityFromProject:document.querySelector('#portfolio-motion').dataset.active==='-1',selected:document.querySelector('.site-header a[aria-current]').hash})`));
const marker=()=>ev(`(()=>{const n=document.querySelector('.nav-selection'),a=document.querySelector('.site-header a[aria-current]');return {x:n.getBoundingClientRect().x,target:a.getBoundingClientRect().x,width:n.getBoundingClientRect().width,targetWidth:a.getBoundingClientRect().width}})()`);
await ev(`document.querySelector('.site-header a[href="#archive"]').click()`);await pause(100);results.push({width,sliding:await marker()});await pause(500);results.push({width,settled:await marker()});
await ev(`document.querySelector('.identity').click()`);await pause(2800);results.push(await ev(`({width:innerWidth,identityFromArchive:document.body.dataset.page==='home'&&document.querySelector('#portfolio-motion').dataset.active==='-1'})`));
await ev(`document.querySelector('.site-header a[href="#about"]').click()`);await pause(250);await ev(`document.querySelector('.identity').click()`);await pause(300);results.push(await ev(`({width:innerWidth,identityFromAbout:document.body.dataset.page==='home'})`));
const b=await ev(`(()=>{const r=document.querySelector('.scroll-glass').getBoundingClientRect();return {x:r.x+r.width*.1,y:r.y+r.height*.3}})()`);await send('Input.dispatchMouseEvent',{type:'mouseMoved',...b});await pause(700);await shot('volume60-side-'+width);
results.push(await ev(`({width:innerWidth,volume:document.querySelector('.glass-object').classList.contains('has-volume'),imageCount:document.querySelectorAll('.glass-object img').length,overflow:document.documentElement.scrollWidth>innerWidth})`));
await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await pause(150);results.push(await ev(`({width:innerWidth,reduced:getComputedStyle(document.querySelector('.glass-object')).animationName,navTransition:getComputedStyle(document.querySelector('.nav-selection')).transitionDuration})`));await send('Emulation.setEmulatedMedia',{features:[]});
}
console.log(JSON.stringify({results,errors}));fs.writeFileSync('content-import/navigation-volume60-check.json',JSON.stringify({results,errors},null,2));await send('Browser.close');ws.close();})().catch(e=>{console.error(e);process.exit(1)});
