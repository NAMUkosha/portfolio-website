const fs=require('node:fs');
(async()=>{
 const tabs=await(await fetch('http://127.0.0.1:9238/json')).json();
 const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));
 let seq=0;const pending=new Map(),errors=[];
 ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);if(m.error)p.reject(m.error);else p.resolve(m.result);}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text);if(m.method==='Network.responseReceived'&&m.params.response.status>=400)errors.push(m.params.response.url);});
 const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
 const evaluate=async expression=>(await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true})).result.value;
 await send('Page.enable');await send('Runtime.enable');await send('Network.enable');
 const reports=[];
 for(const width of [1440,390]){
  await send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width===390});
  await send('Page.navigate',{url:'http://127.0.0.1:4175/?revision=38#project/abi'});
  for(let i=0;i<100;i++){if(await evaluate('!!document.querySelector(".abi-map-canvas")'))break;await new Promise(r=>setTimeout(r,100));}
  await evaluate('document.fonts.ready');
  await evaluate('document.querySelector(".abi-architecture").scrollIntoView({block:"start"})');
  await new Promise(r=>setTimeout(r,250));
  const report=await evaluate(`(()=>{const map=document.querySelector('.abi-map-canvas'),vp=document.querySelector('.abi-map-viewport'),reader=document.querySelector('#note-reading');return {width:innerWidth,pageOverflow:document.documentElement.scrollWidth>innerWidth,readerOverflow:reader.scrollWidth>reader.clientWidth,mapWidth:map.clientWidth,viewportWidth:vp.clientWidth,modules:document.querySelectorAll('.abi-map-module').length,overflow:[...map.querySelectorAll('.abi-map-card,.abi-map-frame,.abi-map-process,.abi-map-cycle-node')].filter(e=>e.scrollHeight>e.clientHeight+2||e.scrollWidth>e.clientWidth+2).map(e=>e.textContent),caption:document.querySelector('.abi-architecture').textContent.includes('Patient')};})()`);
  reports.push(report);
  const box=await evaluate(`(()=>{const r=document.querySelector('.abi-architecture').getBoundingClientRect();return {x:Math.max(0,r.x),y:Math.max(0,r.y),width:r.width,height:r.height,scale:1};})()`);
  const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:box});fs.writeFileSync(`content-import/compact-products/abi-system-${width}.png`,Buffer.from(shot.data,'base64'));
  if(width===390){await evaluate('document.querySelector(".abi-map-viewport").scrollLeft=1000');const right=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:box});fs.writeFileSync('content-import/compact-products/abi-system-390-right.png',Buffer.from(right.data,'base64'));}
 }
 console.log(JSON.stringify({reports,errors},null,2));
 fs.writeFileSync('content-import/compact-products/abi-system-check.json',JSON.stringify({reports,errors},null,2));
 await send('Browser.close');ws.close();
})().catch(e=>{console.error(e);process.exit(1)});
