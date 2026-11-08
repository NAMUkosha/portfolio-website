const fs=require('node:fs');
(async()=>{
 const tabs=await(await fetch('http://127.0.0.1:9238/json')).json();const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));let seq=0;const pending=new Map(),errors=[];
 ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result);}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails);if(m.method==='Network.responseReceived'&&m.params.response.status>=400&&!m.params.response.url.endsWith('/favicon.ico'))errors.push(m.params.response.url);});
 const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
 const ev=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw r.exceptionDetails;return r.result.value;};
 const pause=ms=>new Promise(r=>setTimeout(r,ms));const reports=[];
 const shot=async name=>{const r=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync('content-import/motion44-'+name+'.png',Buffer.from(r.data,'base64'));};
 const state=()=>ev(`({width:innerWidth,view:document.body.dataset.view,active:+document.body.dataset.active,moreVisible:!document.querySelector('#more').hidden,title:document.querySelector('#home-title').textContent,overflow:document.documentElement.scrollWidth>innerWidth,glass:document.documentElement.classList.contains('edge-glass-active'),refracted:document.querySelectorAll('.edge-glass-source').length,visible:[...document.querySelectorAll('.card')].filter(c=>{const b=c.getBoundingClientRect();return b.right>0&&b.left<innerWidth&&b.bottom>0&&b.top<innerHeight&&+c.style.opacity>0;}).map(c=>c.getAttribute('aria-label'))})`);
 const wheel=delta=>send('Input.dispatchMouseEvent',{type:'mouseWheel',x:600,y:450,deltaX:0,deltaY:delta});



 await send('Page.enable');await send('Runtime.enable');await send('Network.enable');
 for(const width of [1440,390]){
  await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<700});
  for(const mode of ['home','archive']){
   await send('Page.navigate',{url:'http://127.0.0.1:4175/?revision=46#'+mode});await pause(3000);
   const wheel=async(delta)=>ev(`document.querySelector('#portfolio-motion').dispatchEvent(new WheelEvent('wheel',{deltaY:${delta},bubbles:true,cancelable:true}))`);
   const active=()=>ev(`+document.querySelector('#portfolio-motion').dataset.active`);
   await wheel(40);await pause(320);const first=await active();await wheel(40);await pause(320);const second=await active();await wheel(-40);await pause(1200);const reverse=await active();
   if(second!==first+1||reverse!==first)throw Error('Continuous/reverse input failed: '+[mode,width,first,second,reverse]);
   const before=await ev(`document.querySelectorAll('#portfolio-motion .card')[${reverse}].style.transform`);await pause(300);const after=await ev(`document.querySelectorAll('#portfolio-motion .card')[${reverse}].style.transform`);
   reports.push({width,mode,first,second,reverse,settled:before===after,overflow:await ev('document.documentElement.scrollWidth>innerWidth')});
   if(mode==='archive'){await ev(`document.querySelectorAll('#portfolio-motion #index button')[14].click()`);await pause(150);await wheel(-40);await pause(1400);if(await active()!==13)throw Error('Retarget during long jump failed');}
  }
 }
 await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await pause(100);await ev(`document.querySelectorAll('#portfolio-motion #index button')[2].click()`);await pause(100);reports.push({reducedMotionActive:await ev(`+document.querySelector('#portfolio-motion').dataset.active`)});
 fs.writeFileSync('content-import/motion46-check.json',JSON.stringify({reports,errors},null,2));console.log(JSON.stringify({reports,errors}));await send('Browser.close');ws.close();})().catch(e=>{console.error(e);process.exit(1)});
