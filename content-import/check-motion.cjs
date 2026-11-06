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
 await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width===390});await send('Page.navigate',{url:'http://127.0.0.1:4175/motion-study.html'});await new Promise(r=>setTimeout(r,400));
 for(const mode of ['home','archive','home']){await evaluate(`document.querySelector('[data-view="${mode}"]').click()`);await new Promise(r=>setTimeout(r,1800));reports.push(await evaluate(`({width:innerWidth,mode:document.body.className,cards:document.querySelectorAll('.card').length})`));const shot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync('content-import/motion-'+width+'-'+mode+'.png',Buffer.from(shot.data,'base64'));}
 }
 console.log(JSON.stringify({reports,errors},null,2));
 fs.writeFileSync('content-import/motion-check.json',JSON.stringify({reports,errors},null,2));
 await send('Browser.close');ws.close();
})().catch(e=>{console.error(e);process.exit(1)});
