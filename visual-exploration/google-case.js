// Interaction stays local to the encrypted case; closing the reader releases every observer and GPU resource.
function startGoogleCase(root,reader,signal,activate){
 const reduce=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(hover: hover) and (pointer: fine)');
 root.addEventListener('click',e=>{const a=e.target.closest('a[href^="#google-"]');if(!a)return;const target=root.querySelector(a.getAttribute('href'));if(target){e.preventDefault();e.stopPropagation();target.scrollIntoView({behavior:reduce.matches?'instant':'smooth',block:'start'});}},{signal});
 const map=root.querySelector('.gc-map'),plot=map?.querySelector('.gc-plot');
 if(plot){
  const bubbles=[...plot.querySelectorAll('[data-glass-bubble]')],focus=map.querySelector('.gc-focus-toggle');
  for(const button of bubbles){button.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'&&fine.matches)activate(button);},{signal});button.addEventListener('focus',()=>activate(button),{signal});}
  focus.addEventListener('click',()=>{const on=focus.getAttribute('aria-pressed')!=='true';focus.setAttribute('aria-pressed',on);map.classList.toggle('focused',on);if(on){const current=bubbles.find(b=>b.getAttribute('aria-selected')==='true');if(current?.dataset.focus!=='true')activate(bubbles[0]);}map.dispatchEvent(new Event('glass:change'));},{signal});
  mountTrendGlass(plot,bubbles,root,reader,signal,reduce);
 }
 const recovery=root.querySelector('[data-recovery]');
 if(recovery){
  const tabs=[...recovery.querySelectorAll('[role=tab]')],panels=[...recovery.querySelectorAll('[role=tabpanel]')],checks=[...recovery.querySelectorAll('[data-recovery-check]')];
  function stage(n,focus=false){recovery.dataset.stage=n;tabs.forEach((t,i)=>{t.setAttribute('aria-selected',i===n);t.tabIndex=i===n?0:-1;panels[i].hidden=i!==n;});if(focus)tabs[n].focus({preventScroll:true});}
  function progress(){checks.forEach((c,i)=>{c.disabled=i>0&&!checks[i-1].checked;if(c.disabled)c.checked=false;});const n=checks.filter(c=>c.checked).length;recovery.querySelector('output').textContent=`${n} / 3 steps reviewed`;recovery.querySelector('[data-recovery-summary]').textContent=`${n} of 3 steps reviewed.`;}
  recovery.addEventListener('click',e=>{const b=e.target.closest('[data-recovery-stage]');if(b){stage(+b.dataset.recoveryStage,b.getAttribute('role')!=='tab');return;}if(e.target.closest('[data-recovery-reset]')){checks.forEach(c=>c.checked=false);progress();stage(0,true);}},{signal});
  recovery.addEventListener('change',progress,{signal});
  recovery.addEventListener('keydown',e=>{const i=tabs.indexOf(e.target);if(i<0||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();stage(e.key==='Home'?0:e.key==='End'?2:(i+(e.key==='ArrowRight'?1:2))%3,true);},{signal});
 }
}
function mountTrendGlass(plot,buttons,root,reader,signal,reduce){
 const canvas=plot.querySelector('canvas'),gl=canvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power'});if(!gl)return;
 const vertex='attribute vec2 position;void main(){gl_Position=vec4(position,0.,1.);}';
 const fragment=`precision highp float;
 uniform vec2 resolution;uniform vec4 bubbles[8];uniform vec4 colors[8];uniform float emphasis[8];uniform vec2 pointer;
 float coverage(vec2 p,vec4 b){return 1.-smoothstep(b.z-1.4,b.z+1.4,length(p-b.xy));}
 vec3 background(vec2 p){vec3 c=vec3(.973,.978,.982);float ax=min(abs(p.x-456.),abs(p.y-385.));float dash=step(.42,fract((p.x+p.y)/10.));return mix(c,vec3(.79,.83,.86),.45*(1.-smoothstep(.25,1.,ax))*dash);}
 vec3 behind(vec2 p,int layer){vec3 c=background(p);for(int j=0;j<8;j++){if(j<layer){float a=coverage(p,bubbles[j])*colors[j].a;c=mix(c,colors[j].rgb,a);}}return c;}
 void main(){vec2 p=vec2(gl_FragCoord.x/resolution.x*912.,(1.-gl_FragCoord.y/resolution.y)*801.6);vec3 outColor=background(p);
 for(int i=0;i<8;i++){
  vec4 b=bubbles[i];vec2 v=p-b.xy;float len=length(v),radius=b.z;vec2 normal=v/max(len,.01);float dist=len-radius;
  // A shallow contact indentation and refracted sampling make overlapping surfaces read as glass.
  for(int j=0;j<8;j++){if(j!=i){float contact=abs(length(p-bubbles[j].xy)-bubbles[j].z)/bubbles[j].z;float touch=1.-smoothstep(radius+bubbles[j].z,radius+bubbles[j].z+6.,length(b.xy-bubbles[j].xy));dist+=exp(-contact*22.)*radius*.019*touch*colors[j].a;}}
  float alpha=1.-smoothstep(-1.4,1.4,dist);if(alpha>.001){float q=clamp(len/radius,0.,1.);float rim=pow(q,7.);vec2 bend=normal*(2.+13.*rim)*(1.+emphasis[i]*.16);vec3 transmitted=behind(p-bend,i);float dispersion=.7*rim;transmitted.r=behind(p-bend-normal*dispersion,i).r;transmitted.b=behind(p-bend+normal*dispersion,i).b;
   vec3 tint=mix(transmitted,colors[i].rgb,colors[i].a);float light=dot(normal,normalize(vec2(-.7,-.7)));float inner=exp(-pow((q-.85)*12.,2.));float edge=exp(-pow((q-.982)*85.,2.));float shine=max(light,0.)*edge*.44+pow(max(light,0.),3.)*inner*.10;float shade=max(-light,0.)*edge*.12+inner*.035;
   float mouseLight=exp(-length(p-pointer)/190.)*.035;vec3 surface=tint*(1.-shade)+vec3(shine+mouseLight);outColor=mix(outColor,surface,alpha);
  }
 }gl_FragColor=vec4(outColor,1.);}`;
 const shaders=[];let program,buffer;try{const compile=(type,source)=>{const s=gl.createShader(type);shaders.push(s);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;};program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,vertex));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));gl.useProgram(program);buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const a=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);}catch(error){shaders.forEach(s=>gl.deleteShader(s));if(program)gl.deleteProgram(program);console.warn('Trend glass uses its transparent CSS fallback.',error.message);return;}
 const U=Object.fromEntries(['resolution','bubbles[0]','colors[0]','emphasis[0]','pointer'].map(n=>[n,gl.getUniformLocation(program,n)]));
 const geometry=buttons.map(b=>({x:+b.dataset.x,y:+b.dataset.y,r:+b.dataset.radius,c:b.dataset.color.split(',').map(Number),focus:b.dataset.focus==='true'}));
 const levels=buttons.map(()=>0),fade=buttons.map(()=>1),mouse={x:-500,y:-500},target={x:-500,y:-500};let raf=0,active=true,until=0,last=0,lost=false;
 function schedule(){if(signal.aborted||lost||!active)return;until=performance.now()+650;if(!raf)raf=requestAnimationFrame(draw);}
 function size(){const rect=plot.getBoundingClientRect(),dpr=Math.min(devicePixelRatio,1.4);canvas.width=Math.max(1,Math.round(rect.width*dpr));canvas.height=Math.max(1,Math.round(rect.height*dpr));gl.viewport(0,0,canvas.width,canvas.height);schedule();}
 function draw(now){raf=0;if(signal.aborted||lost||!active)return;const dt=Math.min(40,last?now-last:16);last=now;const ease=reduce.matches?1:1-Math.exp(-dt/120),selected=buttons.findIndex(b=>b.getAttribute('aria-selected')==='true'),focused=plot.closest('.gc-map').classList.contains('focused');mouse.x+=(target.x-mouse.x)*ease;mouse.y+=(target.y-mouse.y)*ease;const positions=[],palette=[];
 geometry.forEach((b,i)=>{levels[i]+=((selected===i?1:0)-levels[i])*ease;fade[i]+=((focused&&!b.focus?0.16:1)-fade[i])*ease;const pressure=reduce.matches?0:levels[i]*.012;positions.push(b.x,b.y,b.r*(1+pressure),0);palette.push(b.c[0]/255,b.c[1]/255,b.c[2]/255,.50*fade[i]);});
 gl.useProgram(program);gl.uniform2f(U.resolution,canvas.width,canvas.height);gl.uniform4fv(U['bubbles[0]'],new Float32Array(positions));gl.uniform4fv(U['colors[0]'],new Float32Array(palette));gl.uniform1fv(U['emphasis[0]'],new Float32Array(levels));gl.uniform2f(U.pointer,mouse.x,mouse.y);gl.drawArrays(gl.TRIANGLES,0,6);plot.classList.add('glass-ready');if(now<until&&!reduce.matches)raf=requestAnimationFrame(draw);
 }
 plot.addEventListener('pointermove',e=>{if(reduce.matches||e.pointerType!=='mouse')return;const r=plot.getBoundingClientRect();target.x=(e.clientX-r.left)/r.width*912;target.y=(e.clientY-r.top)/r.height*801.6;schedule();},{signal});
 plot.addEventListener('pointerleave',()=>{target.x=-500;target.y=-500;schedule();},{signal});root.addEventListener('case:change',schedule,{signal});plot.closest('.gc-map').addEventListener('glass:change',schedule,{signal});
 const resize=new ResizeObserver(size);resize.observe(plot);const visible=new IntersectionObserver(entries=>{active=entries[0].isIntersecting;if(active)schedule();else{cancelAnimationFrame(raf);raf=0;last=0;}},{root:reader,rootMargin:'100px'});visible.observe(plot);
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();lost=true;cancelAnimationFrame(raf);plot.classList.remove('glass-ready');},{signal});
 signal.addEventListener('abort',()=>{cancelAnimationFrame(raf);resize.disconnect();visible.disconnect();gl.deleteBuffer(buffer);gl.deleteProgram(program);shaders.forEach(s=>gl.deleteShader(s));gl.getExtension('WEBGL_lose_context')?.loseContext();},{once:true});size();
}
