const fs=require('node:fs');
(async()=>{
 const tabs=await(await fetch('http://127.0.0.1:9238/json')).json();const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));let seq=0;const pending=new Map(),errors=[];
 ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result);}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails);if(m.method==='Network.responseReceived'&&m.params.response.status>=400&&!m.params.response.url.endsWith('/favicon.ico'))errors.push(m.params.response.url);});
 const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
 const ev=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw r.exceptionDetails;return r.result.value;};
 const pause=ms=>new Promise(r=>setTimeout(r,ms));const reports=[];
 const shot=async name=>{const r=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync('content-import/controls47-'+name+'.png',Buffer.from(r.data,'base64'));};
 const state=()=>ev(`({width:innerWidth,view:document.body.dataset.view,active:+document.body.dataset.active,moreVisible:!document.querySelector('#more').hidden,title:document.querySelector('#home-title').textContent,overflow:document.documentElement.scrollWidth>innerWidth,glass:document.documentElement.classList.contains('edge-glass-active'),refracted:document.querySelectorAll('.edge-glass-source').length,visible:[...document.querySelectorAll('.card')].filter(c=>{const b=c.getBoundingClientRect();return b.right>0&&b.left<innerWidth&&b.bottom>0&&b.top<innerHeight&&+c.style.opacity>0;}).map(c=>c.getAttribute('aria-label'))})`);
 const wheel=delta=>send('Input.dispatchMouseEvent',{type:'mouseWheel',x:600,y:450,deltaX:0,deltaY:delta});



 await send('Page.enable');await send('Runtime.enable');await send('Network.enable');
 await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
 for(const width of [1440,390]){
  await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<700});
  await send('Page.navigate',{url:'http://127.0.0.1:4175/?revision=47&check='+Date.now()+'#archive'});await pause(3000);
  await ev(`document.querySelector('#motion-year').click()`);await shot('years-'+width);
  await ev(`document.querySelector('#motion-year-options [data-year="2023"]').click()`);await pause(150);
  const filtered=await ev(`({label:document.querySelector('#motion-year span').textContent,count:[...document.querySelectorAll('#portfolio-motion #index button')].filter(b=>!b.hidden).length,closed:document.querySelector('#motion-year-options').hidden})`);
  if(filtered.label!=='2023'||!filtered.closed||!filtered.count)throw Error('Year filter failed: '+JSON.stringify({filtered,errors}));reports.push({width,filtered});
  await ev(`document.querySelector('#motion-year').click()`);await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape'});if(!await ev(`document.querySelector('#motion-year-options').hidden`))throw Error('Escape failed');
  const ids=await ev(`notes.filter(n=>!n.private).map(n=>n.id)`);
  for(const id of ids){
   await ev(`openProject(${JSON.stringify(id)})`);await pause(70);
   const hit=await ev(`(()=>{const b=document.querySelector('#tool-toggle'),r=b.getBoundingClientRect();return b.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))})()`);
   if(!hit)throw Error('Index covered: '+id+' '+width);
   await ev(`document.querySelector('#tool-toggle').click()`);
   const count=await ev(`document.querySelectorAll('#tool-menu [data-section]').length`);if(!count)throw Error('Index empty: '+id);
   await ev(`document.querySelectorAll('#tool-menu [data-section]')[1]?.click()`);await pause(60);
   const moved=await ev(`document.querySelector('#note-reading').scrollTop>0`);if(!moved)throw Error('Chapter jump failed: '+id);
   await ev(`document.querySelector('#tool-top').click()`);await pause(40);
   if(await ev(`document.querySelector('#note-reading').scrollTop`)>1)throw Error('Top failed');
   reports.push({width,id,hit,count,moved});
   if(id==='gofie'){await ev(`document.querySelector('#tool-toggle').click()`);await shot('index-'+width);}
   await ev('closeNote()');
  }
 }
 fs.writeFileSync('content-import/controls47-check.json',JSON.stringify({reports,errors},null,2));console.log(JSON.stringify({reports,errors}));await send('Browser.close');ws.close();})().catch(e=>{console.error(e);process.exit(1)});


