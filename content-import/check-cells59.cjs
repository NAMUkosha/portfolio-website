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
await send('Page.navigate',{url:'http://127.0.0.1:4176/?revision=59&w='+width+'#home'});await pause(2000);
await shot('cells59-'+width);
results.push(await ev(`(()=>{const selectors=['.page-tools #tool-menu nav','.site-header nav','.intro-links a'];return {width:innerWidth,surfaces:selectors.map(s=>{const c=getComputedStyle(document.querySelector(s));return {background:c.backgroundImage,border:c.border,shadow:c.boxShadow,blur:c.backdropFilter}}),links:[...document.querySelectorAll('.intro-links a')].map(a=>({text:a.textContent,href:a.getAttribute('href')})),overflow:document.documentElement.scrollWidth>innerWidth,animation:getComputedStyle(document.querySelector('.glass-object')).animationPlayState}})()`));
const box=await ev(`(()=>{const r=document.querySelector('.scroll-glass').getBoundingClientRect();return {x:r.x+r.width*.75,y:r.y+r.height*.35}})()`);
await send('Input.dispatchMouseEvent',{type:'mouseMoved',...box});await pause(700);
results.push(await ev(`({width:innerWidth,hoverPaused:getComputedStyle(document.querySelector('.glass-object')).animationPlayState,transform:document.querySelector('.glass-object').style.transform})`));await shot('cells59-hover-'+width);
await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:10,y:10});await pause(2200);
results.push(await ev(`({width:innerWidth,returned:document.querySelector('.glass-object').style.transform,animation:getComputedStyle(document.querySelector('.glass-object')).animationPlayState})`));
await ev(`document.querySelector('.intro-links a').click()`);await pause(300);results.push({width,about:await ev(`document.body.dataset.page==='about'`)});
await ev(`document.querySelector('.site-header a[href="#home"]').click()`);await pause(300);
await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await pause(100);
results.push(await ev(`({width:innerWidth,reduced:getComputedStyle(document.querySelector('.glass-object')).animationName})`));
await send('Emulation.setEmulatedMedia',{features:[]});
}
console.log(JSON.stringify({results,errors}));fs.writeFileSync('content-import/cells59-check.json',JSON.stringify({results,errors},null,2));await send('Browser.close');ws.close();})().catch(e=>{console.error(e);process.exit(1)});
