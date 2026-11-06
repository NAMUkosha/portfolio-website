const fs=require('node:fs');
(async()=>{
 const tabs=await(await fetch('http://127.0.0.1:9238/json')).json();const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));let seq=0;const pending=new Map(),errors=[];
 ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result);}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails);if(m.method==='Network.responseReceived'&&m.params.response.status>=400&&!m.params.response.url.endsWith('/favicon.ico'))errors.push(m.params.response.url);});
 const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
 const ev=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw r.exceptionDetails;return r.result.value;};
 const pause=ms=>new Promise(r=>setTimeout(r,ms));const reports=[];
 const shot=async name=>{const r=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync('content-import/portfolio-motion-'+name+'.png',Buffer.from(r.data,'base64'));};
 const state=()=>ev(`({width:innerWidth,view:document.body.dataset.view,active:+document.body.dataset.active,moreVisible:!document.querySelector('#more').hidden,title:document.querySelector('#home-title').textContent,overflow:document.documentElement.scrollWidth>innerWidth,glass:document.documentElement.classList.contains('edge-glass-active'),refracted:document.querySelectorAll('.edge-glass-source').length,visible:[...document.querySelectorAll('.card')].filter(c=>{const b=c.getBoundingClientRect();return b.right>0&&b.left<innerWidth&&b.bottom>0&&b.top<innerHeight&&+c.style.opacity>0;}).map(c=>c.getAttribute('aria-label'))})`);
 const wheel=delta=>send('Input.dispatchMouseEvent',{type:'mouseWheel',x:600,y:450,deltaX:0,deltaY:delta});

 await send('Page.enable');await send('Runtime.enable');await send('Network.enable');
 await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});await send('Page.navigate',{url:'http://127.0.0.1:4175/?revision=41&check='+Date.now()+'#home'});await pause(1400);
 const check=()=>ev(`({active:document.querySelector('#portfolio-motion').dataset.active,view:document.querySelector('#portfolio-motion').dataset.view,width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,cards:document.querySelectorAll('#portfolio-motion .card').length,title:document.querySelector('#home-title').textContent})`);
 reports.push({name:'greeting',...await check()});await shot('greeting');
 await wheel(40);await pause(1800);reports.push({name:'light-wheel',...await check()});await shot('home');
 await ev(`document.querySelector('#home-title').click()`);await pause(600);reports.push({name:'reader',open:await ev(`!document.querySelector('#note-reading').hidden&&document.querySelector('#portfolio-motion').inert`)});await ev(`document.querySelector('#close-note').click()`);await pause(150);
 await ev(`document.querySelector('.site-header a[href="#archive"]').click()`);await pause(2800);reports.push({name:'archive',...await check()});await shot('archive');
 await ev(`var el=document.querySelector('#motion-year');el.value='2023';el.dispatchEvent(new Event('change'))`);await pause(1800);reports.push({name:'year',titles:await ev(`[...document.querySelectorAll('#portfolio-motion #index button')].filter(b=>!b.hidden).map(b=>b.textContent)`)});
 await ev(`var el=document.querySelector('#motion-year');el.value='all';el.dispatchEvent(new Event('change'))`);await pause(1800);
 await ev(`document.querySelectorAll('#portfolio-motion #index button')[1].click()`);await pause(1800);await ev(`document.querySelector('#portfolio-motion #title').click()`);await pause(250);reports.push({name:'locked',dialog:await ev(`document.querySelector('#password-dialog').open`)});await ev(`document.querySelector('#password-close').click()`);
 await ev(`document.querySelector('.site-header a[href="#home"]').click()`);await pause(2800);
 await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await pause(600);reports.push({name:'mobile',...await check()});await shot('mobile-home');
 await ev(`document.querySelector('.site-header a[href="#archive"]').click()`);await pause(2800);await shot('mobile-archive');reports.push({name:'mobile-archive',...await check()});
 await ev(`document.querySelector('.site-header a[href="#about"]').click()`);await pause(400);reports.push({name:'about',visible:await ev(`!document.querySelector('#about').hidden&&document.querySelector('#portfolio-motion').hidden`)});
 fs.writeFileSync('content-import/portfolio-motion-check.json',JSON.stringify({reports,errors},null,2));console.log(JSON.stringify({reports,errors},null,2));await send('Browser.close');ws.close();
})().catch(e=>{console.error(e);process.exit(1)});
