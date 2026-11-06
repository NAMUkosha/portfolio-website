const fs=require('node:fs');
(async()=>{
 const tabs=await(await fetch('http://127.0.0.1:9238/json')).json();
 const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));
 let seq=0;const pending=new Map(),errors=[];
 ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);if(m.error)p.reject(m.error);else p.resolve(m.result);}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails);if(m.method==='Network.responseReceived'&&m.params.response.status>=400&&!m.params.response.url.endsWith('/favicon.ico'))errors.push(m.params.response.url);});
 const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
 const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw r.exceptionDetails;return r.result.value;};
 await send('Page.enable');await send('Runtime.enable');await send('Network.enable');
 const reports=[];
 for(const width of [1440,390]){
  await send('Emulation.setDeviceMetricsOverride',{width,height:1100,deviceScaleFactor:1,mobile:width===390});
  await send('Page.navigate',{url:'http://127.0.0.1:4175/?revision=39#project/abi'});
  for(let i=0;i<100;i++){if(await evaluate('!!document.querySelector(".abi-form-study")'))break;await new Promise(r=>setTimeout(r,100));}
  await evaluate('document.fonts.ready');
  await evaluate(`Promise.all([...document.querySelectorAll('.abi-product img')].map(i=>{i.loading='eager';return i.decode().catch(()=>{});}));`);
  const report=await evaluate(`(()=>{const measure=s=>[...document.querySelectorAll(s)].map(e=>{const b=e.getBoundingClientRect();return {width:b.width,height:b.height,top:b.top};});return {width:innerWidth,pageOverflow:document.documentElement.scrollWidth>innerWidth,readerOverflow:document.querySelector('#note-reading').scrollWidth>document.querySelector('#note-reading').clientWidth,forms:measure('.abi-form-study .abi-media-frame'),scenes:measure('.abi-scenes .abi-media-frame'),construction:measure('.abi-construction .abi-media-frame'),map:measure('.abi-map-canvas'),missingImages:[...document.querySelectorAll('.abi-product img')].filter(i=>!i.naturalWidth).map(i=>i.src)};})()`);
  const capture=async(selector,name)=>{
   await evaluate(`document.querySelector('${selector}').scrollIntoView({block:'center',behavior:'instant'})`);await new Promise(r=>setTimeout(r,80));
   const box=await evaluate(`(()=>{const r=document.querySelector('${selector}').getBoundingClientRect();return {x:Math.max(0,r.x),y:Math.max(0,r.y),width:r.width,height:Math.min(r.height,1050),scale:1};})()`);
   const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:box});fs.writeFileSync('content-import/compact-products/abi-39-'+name+'-'+width+'.png',Buffer.from(shot.data,'base64'));
  };
  await capture('.abi-form-study','forms');await capture('.abi-scenes','scenes');await capture('.abi-construction','construction');await capture('.abi-architecture','system');
  await evaluate('document.querySelector("[data-abi-map-toggle]").click()');
  report.expanded=await evaluate(`({state:document.querySelector('[data-abi-map-toggle]').getAttribute('aria-expanded'),width:document.querySelector('.abi-map-canvas').clientWidth,readerOverflow:document.querySelector('#note-reading').scrollWidth>document.querySelector('#note-reading').clientWidth})`);
  await evaluate('document.querySelector(".abi-map-viewport").scrollLeft=1000;document.querySelector("[data-abi-map-toggle]").click()');
  report.collapsed=await evaluate(`({state:document.querySelector('[data-abi-map-toggle]').getAttribute('aria-expanded'),width:document.querySelector('.abi-map-canvas').clientWidth,scrollLeft:document.querySelector('.abi-map-viewport').scrollLeft})`);
  reports.push(report);
 }
 console.log(JSON.stringify({reports,errors},null,2));
 fs.writeFileSync('content-import/compact-products/abi-layout-39-check.json',JSON.stringify({reports,errors},null,2));
 await send('Browser.close');ws.close();
})().catch(e=>{console.error(e);process.exit(1)});
