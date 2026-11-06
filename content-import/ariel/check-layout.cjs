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
  await send('Page.navigate',{url:'http://127.0.0.1:4175/?revision=40#project/ariel'});
  for(let i=0;i<100;i++){if(await evaluate('!!document.querySelector(".ariel-hero")'))break;await new Promise(r=>setTimeout(r,100));}
  await evaluate('document.fonts.ready');
  await evaluate(`Promise.all([...document.querySelectorAll('.ariel-case img')].map(i=>{i.loading='eager';return i.decode().catch(()=>{});}));`);
  const report=await evaluate(`({width:innerWidth,pageOverflow:document.documentElement.scrollWidth>innerWidth,readerOverflow:document.querySelector('#note-reading').scrollWidth>document.querySelector('#note-reading').clientWidth,sections:document.querySelectorAll('.ariel-case>section').length,missingImages:[...document.querySelectorAll('.ariel-case img')].filter(i=>!i.naturalWidth).map(i=>i.src)})`);
  await evaluate(`document.querySelector('.ariel-case').scrollIntoView({block:'start',behavior:'instant'})`);
  const shot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync('content-import/ariel/preview-'+width+'.png',Buffer.from(shot.data,'base64'));
  reports.push(report);
 }
 console.log(JSON.stringify({reports,errors},null,2));
 fs.writeFileSync('content-import/ariel/layout-check.json',JSON.stringify({reports,errors},null,2));
 await send('Browser.close');ws.close();
})().catch(e=>{console.error(e);process.exit(1)});
