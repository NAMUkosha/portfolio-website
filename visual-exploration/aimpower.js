function aimpowerMarkup(){
 const prototype='https://www.figma.com/proto/dHdZFztEINqndC8BCXBruA/SELF-Temp-for-AImPower-Prototype--Copy-?page-id=983%3A20101&node-id=983-25523&starting-point-node-id=983%3A25523&scaling=scale-down&content-scaling=fixed';
 const source='https://www.figma.com/design/o41gKUr8VhjGa4pDe7xg7A/26SP_Portfolio?node-id=378-8810';
 const fig=(page,name,alt,caption='')=>{const a=aimpowerAssets.find(a=>a.page===`378:${page}`&&a.variable===name);if(!a)return '';return `<figure class="aim-figure" data-figma-node="${a.node||a.page}"><button class="aim-image-open" data-aim-image aria-label="Enlarge: ${alt}"><img src="assets/aimpower/process/${a.display}" alt="${alt}" width="${a.width}" height="${a.height}" loading="lazy" decoding="async"></button>${caption?`<figcaption>${caption}</figcaption>`:''}</figure>`;};
 const group=(body,cls='')=>`<div class="aim-grid ${cls}">${body}</div>`;
 const heading=(num,title,desc='')=>`<header class="aim-chapter-heading"><p class="small">${num}</p><h2>${title}</h2>${desc?`<p>${desc}</p>`:''}</header>`;
 const card=(title,text)=>`<div class="aim-card"><h3>${title}</h3><p>${text}</p></div>`;
 const tabs=(id,items)=>`<div class="aim-tabs" data-aim-tabs><div class="aim-tab-list" role="tablist" aria-label="${id.replaceAll('-',' ')}">${items.map((item,i)=>`<button role="tab" id="${id}-tab-${i}" aria-controls="${id}-panel-${i}" aria-selected="${i===0}" tabindex="${i===0?0:-1}">${item.label}</button>`).join('')}</div>${items.map((item,i)=>`<div class="aim-tab-panel" role="tabpanel" id="${id}-panel-${i}" aria-labelledby="${id}-tab-${i}" ${i?'hidden':''}>${item.content}</div>`).join('')}</div>`;
 return `<article class="aimpower-case" data-edge-glass="off">
 <section id="aim-overview" data-project-index="Overview">
 <header class="aimpower-header"><p class="small">Design Lead · Accessibility · AImpower.org · 2025–2026</p><h1>A Zoom + Web System for Stutter-Affirming Progress</h1><p class="aimpower-subtitle">Helping people feel confident<br>in the conversations that matter.</p><p class="aim-lead">I led design for a Zoom + web system that connects in-meeting support with reflection and therapy goals.</p><a class="inline-link" href="${prototype}" target="_blank" rel="noopener noreferrer">Try the prototype ↗</a></header>
 <figure class="aimpower-figure aimpower-hero"><img src="assets/aimpower/cover.webp" alt="AImpower Zoom plugin alongside a live conversation" width="1920" height="1080" fetchpriority="high" decoding="async"></figure>
 <dl class="aimpower-meta"><div><dt>My role</dt><dd>Design lead<br>System, components & cross-platform UX</dd></div><div><dt>Team</dt><dd>3 designers<br>4 researchers</dd></div><div><dt>Scope</dt><dd>5 months · 50+ screens<br>Zoom plugin + two web experiences</dd></div></dl>
 <div class="aim-reading"><p class="aim-kicker">The problem</p><h2>Therapy ends.<br>Real conversations continue.</h2><p>People who stutter needed support in live meetings. Their therapists needed context between sessions. Existing tools focused on fluency; the brief centered confidence, agency and participation.</p><p class="aim-kicker">What I owned</p><p>I guided key design decisions, established the shared component system and coordinated feature ownership across the design team.</p></div>
 </section>
 <section class="aim-chapter" id="aim-research" data-project-index="Research → decisions">
 ${heading('01','Research changed what we measured.','We interviewed and co-designed with dual-role experts: clinicians who also stutter. Three findings shaped the direction.')}
 ${tabs('research-decisions',[
 {label:'01 · Confidence',content:`<div class="aim-decision"><div class="aim-signal"><strong>86<span>%</span></strong><div class="aim-bar"><i style="width:86%"></i></div><p>Defined progress as confidence, not fluency.</p></div><div><p class="aim-kicker">Design response</p><h3>Make confidence visible.</h3><p>Our goals and progress views track confidence and participation, so improvement is not reduced to a stutter count.</p><a class="inline-link" href="#project/aimpower" data-aim-jump="aim-pws">See the progress experience ↓</a></div></div>`},
 {label:'02 · Agency',content:`<div class="aim-decision"><div class="aim-signal"><strong>71<span>%</span></strong><div class="aim-bar"><i style="width:71%"></i></div><p>Avoided speaking because of judgment or time pressure.</p></div><div><p class="aim-kicker">Design response</p><h3>Let people choose how to be seen.</h3><p>We paired quick signals with optional self-disclosure and affirmations. Support stays close without taking over the meeting.</p><a class="inline-link" href="#project/aimpower" data-aim-jump="aim-zoom">See the Zoom toolbox ↓</a></div></div>`},
 {label:'03 · Continuity',content:`<div class="aim-decision"><div class="aim-signal"><strong>57<span>%</span></strong><div class="aim-bar"><i style="width:57%"></i></div><p>Wanted clinic practice to transfer into daily life.</p></div><div><p class="aim-kicker">Design response</p><h3>Connect the moments between sessions.</h3><p>Lightweight meeting logs become reflections and clinician context. That led us from a standalone plugin to a connected system.</p><a class="inline-link" href="#project/aimpower" data-aim-jump="aim-strategy">Follow the support loop ↓</a></div></div>`}
 ])}
 <p class="aim-note">Directional findings from 7 dual-role experts, as reported in the project research.</p>
 <details class="aim-detail"><summary>Behind the decisions · co-design & synthesis</summary><div class="aim-reading"><p>30+ minute interviews and hour-long workshops produced 162+ quotes. The research team coded them into themes; co-design sessions explored which kinds of support felt useful.</p></div>${group(fig(9049,'imgImage61','Participants’ concept prioritization','Prioritizing concepts together.')+fig(9049,'imgImage62','Participants’ meeting-support sketches','Sketching support in real moments.'))}${fig(9049,'imgImage60','Thematic analysis of participant quotes','The six-bucket codebook behind the themes.')}</details>
 </section>
 <section class="aim-chapter" id="aim-strategy" data-project-index="Connected experience">
 ${heading('02','One loop, across three moments.','We connected live support to reflection, then brought that context back into the next therapy goal.')}
 ${tabs('support-loop',[
 {label:'Before a meeting',content:`<div class="aim-flow"><div><span>SLP · Web</span><h3>Set a meaningful goal</h3><p>Choose a goal and a metric with the client.</p></div><span class="aim-flow-arrow" aria-hidden="true">→</span><div><span>PWS · Zoom</span><h3>Bring it into the meeting</h3><p>A small challenge stays available in the side panel.</p></div></div>`},
 {label:'During a meeting',content:`<div class="aim-flow"><div><span>PWS · Zoom</span><h3>Participate with support</h3><p>Signal, disclose or use an affirmation when it helps.</p></div><span class="aim-flow-arrow" aria-hidden="true">→</span><div><span>PWS · Zoom</span><h3>Capture a micro-moment</h3><p>A rating, count, word or short note keeps the task light.</p></div></div>`},
 {label:'After a meeting',content:`<div class="aim-flow"><div><span>PWS · Web</span><h3>Reflect while it is fresh</h3><p>Connect an entry to a meeting and choose what to share.</p></div><span class="aim-flow-arrow" aria-hidden="true">→</span><div><span>SLP · Web</span><h3>Use context in the next goal</h3><p>Review patterns and support the next conversation.</p></div></div>`}
 ])}
 <details class="aim-detail"><summary>View the end-to-end workflow</summary>${fig(9296,'imgImage65','PWS–SLP swimlane diagram','Before, during and after the meeting. Click to enlarge.')}</details>
 </section>
 <section class="aim-chapter" id="aim-iteration" data-project-index="Design iteration">
 ${heading('03','From a plugin to a shared experience.','The project started with a mid-fi Zoom plugin. I helped shape the cross-platform experience and the system that keeps it consistent.')}
 ${tabs('design-evolution',[
 {label:'Starting point',content:`${fig(9313,'img202510071734391','Original mid-fidelity Zoom plugin')}<p class="aim-caption">An existing plugin, with the connected web experience still to be defined.</p>`},
 {label:'Exploration',content:`${group(fig(9313,'imgImg3235','Cross-platform sketch, first sheet')+fig(9313,'imgImg3233','Cross-platform sketch, second sheet')+fig(9313,'imgImg31211','Cross-platform sketch, third sheet'),'aim-three')}<p class="aim-caption">I worked with another designer to explore how the services fit together.</p>`},
 {label:'Iteration',content:`${group(fig(9313,'imgImage149','Earlier web prototype')+fig(9313,'imgImage150','Refined web prototype'))}<p class="aim-caption">Internal flow comparisons and stakeholder feedback informed the clickable prototype.</p>`}
 ])}
 </section>
 <section class="aim-chapter" id="aim-zoom" data-project-index="Zoom plugin">
 ${heading('04','Support that stays beside the conversation.','The plugin uses the side panel so help is accessible without competing with the call. Logging stays lightweight.')}
 ${tabs('zoom-design',[{label:'Meeting layout',content:` ${fig(9353,'imgImage68','Zoom meeting with AImpower side panel','A nine-column grid aligns the main Zoom canvas and the right-side plugin.')}
${fig(9353,'imgImage69','Zoom plugin layout reference','Plugin controls remain within reach of the live conversation.')}`},{label:'In-meeting logging',content:` <div class="aimpower-section"><h3>A small input, in the moment</h3><div class="aimpower-body"><p>SLPs set goals and micro-challenges tailored to the client’s week. PWS can log a feared word, rate confidence, count speaking moments or write a one-line reflection during the meeting.</p></div></div>
 ${group(fig(10581,'imgImage74','Default Zoom plugin dashboard')+`<div class="aim-grid aim-two">${fig(10581,'imgImage79','Feared-word check-in')}${fig(10581,'imgImage80','Confidence check-in')}${fig(10581,'imgImage81','Participation check-in')}${fig(10581,'imgImage75','Brief reflection input')}${fig(10581,'imgImage76','In-meeting tracking control')}${fig(10581,'imgImage77','In-meeting task card')}${fig(10581,'imgImage82','Goal tracking panel')}${fig(10581,'imgImage78','Reflection task')}</div>`,'aim-plugin-grid')}
`},{label:'Quick toolbox',content:` <h3 class="aim-subheading">A quick toolbox for communication</h3>
 ${group(`<div><h4>Wave hand · Signal quickly</h4>${fig(10550,'imgImage91','Wave-hand tool')}${fig(10550,'imgImage94','Wave-hand feedback')}</div><div><h4>Affirmative message · A confidence-first reminder</h4>${fig(10550,'imgImage93','Affirmative-message tool')}${fig(10550,'imgImage95','Affirmation message')}${fig(10550,'imgImage96','Affirmation notification')}</div><div><h4>Self-disclosure · Let the room know how to support you</h4>${group(fig(10550,'imgImage85','Self-disclosure panel')+fig(10550,'imgImage86','Disclosure settings')+fig(10550,'imgImage87','Disclosure message preview'),'aim-three')}${group(fig(10550,'imgImage88','Disclosure control')+fig(10550,'imgImage89','Disclosure option')+fig(10550,'imgImage90','Disclosure message'),'aim-three')}</div>`,'aim-toolbox')}
 `}])}
 </section>
 <section class="aim-chapter" id="aim-pws" data-project-index="Web · PWS">
 ${heading('05','Make reflection easier to begin.','A clear title, a small input and a sharing choice turn a vague “How did it go?” into a usable reflection.')}
 ${tabs('pws-design',[{label:'Dashboard',content:` ${fig(10700,'imgImage104','PWS dashboard: goals, reflection, therapist contact and recent meeting')}
 ${group(card('Goals & progress','Review confidence-based goals, participation and personal progress.')+card('A quick reflection','Capture a post-meeting note while the experience is still fresh.')+card('Context & contact','Review the latest meeting or contact the SLP directly.'),'aim-three')}
<details class="aim-detail"><summary>Recent meeting card</summary>${fig(10700,'imgImage106','Recent meeting context')}</details>`},{label:'Reflection flow',content:` <h3 class="aim-subheading">Create reflection</h3><p class="aim-copy">The mental model follows a simple creation journey: start with a clear label, choose the type of entry, add a lightweight input and finish with a shareable reflection.</p>
 <ol class="aim-timeline"><li><span>01 · Name</span><p>A clear entry title</p></li><li><span>02 · Choose</span><p>General or meeting-linked</p></li><li><span>03 · Capture</span><p>Survey or journal</p></li><li><span>04 · Review</span><p>Confirm and choose sharing</p></li></ol>
 ${group(fig(10781,'imgImage109','Create reflection: name the entry','Start with a clear title.')+fig(10828,'imgImage111','Create reflection: general or meeting-linked entry','Log how you feel anytime, or connect the entry to a meeting.'))}
 ${group(fig(10815,'imgImage112','Reflection survey','Complete quantitative check-ins in the platform, without external survey tools.')+fig(10879,'imgImage119','Journal reflection','Capture qualitative notes, thoughts and other progress.'))}
 ${group(fig(10854,'imgImage113','Reflection survey input')+fig(10857,'imgImage114','Reflection survey rating')+fig(10860,'imgImage115','Reflection survey question')+fig(10863,'imgImage116','Reflection survey response'),'aim-four')}
 ${fig(10879,'imgImage121','Review and submit an entry','Confirm your entry and decide whether to share it with your SLP.')}
<h4>Meeting-linked reflection</h4>${group(fig(10840,'reflectionState','Reflection: the latest meeting')+fig(10843,'reflectionState','Reflection: choose a meeting')+fig(10837,'reflectionState','Reflection: selected meeting')+fig(10847,'reflectionState','Reflection: quick review'),'aim-four')}`},{label:'Insights',content:` <h3 class="aim-subheading">Insights</h3>${group(fig(10904,'imgImage122','Confidence-based progress over time','Simple charts and trends make progress visible.')+fig(10904,'imgImage110','Reflection history','Keep entries in one place.'))}
`}])} <blockquote class="aim-quote">“It turns ‘how did it go?’ into something I can answer clearly.”<cite>Usability test participant · PWS</cite></blockquote>
 
 </section>
 <section class="aim-chapter" id="aim-slp" data-project-index="Web · SLP">
 ${heading('06','Give therapists context, not more admin.','The clinician experience connects clients, reflections and goal-setting so between-session moments can inform care.')}
 ${tabs('slp-design',[{label:'Dashboard',content:` ${fig(10741,'imgImage123','SLP dashboard: summary, client reflections and recent updates')}
`},{label:'Clients & progress',content:` <h3 class="aim-subheading">From all clients to one person</h3><p class="aim-copy">Manage all clients in one place, identify who needs support and enter a profile to review progress, reflections and notes.</p>
 ${group(fig(10770,'imgImage124','SLP client list')+fig(10770,'imgImage125','Detailed client profile'),'aim-client-grid')}
`},{label:'Goal creation',content:` <h3 class="aim-subheading">Set a new goal</h3><p class="aim-copy">Templates provide a reference, a step-by-step flow makes progress clear, and a live preview keeps the client’s context visible.</p>
 ${group(fig(10631,'imgImage125','Goal creation: name a goal','01 · Name a goal')+fig(10631,'imgImage126','Goal creation: choose a metric','02 · Choose a metric')+fig(10631,'imgImage127','Goal creation: preview','03 · Preview'),'aim-three')}
 ${group(fig(10664,'imgImage132','Client overview and support signals')+fig(10664,'imgImage133','Client progress summary')+fig(10664,'imgImage131','Client insights and goals'),'aim-three')}
`}])} <blockquote class="aim-quote">“It makes goal-setting easier because I can track patterns across meetings.”<cite>Usability test participant · SLP</cite></blockquote>
 
 </section>
 <section class="aim-chapter" id="aim-system" data-project-index="Design system">
 ${heading('07','Consistency was part of my role.','I established and maintained the shared system, managed core components and aligned patterns across the plugin and both web experiences.')}
  <div class="aim-system"><div class="aim-swatches">${[['Accent','#2D6A4F'],['AIm background','#F0F6F8'],['Secondary','#FFE1E1'],['Warm accent','#C9926B'],['Action','#D94D20'],['Blue action','#0D6BDE'],['Subtext','#64748B'],['Neutral','#DFE3E8']].map(([n,c])=>`<div><span style="background:${c}"></span><p>${n}<small>${c}</small></p></div>`).join('')}</div><div><h3>Poppins · Medium</h3><dl class="aim-type"><div><dt>Header 1</dt><dd>32</dd></div><div><dt>Header 2</dt><dd>24</dd></div><div><dt>Header 3</dt><dd>20</dd></div><div><dt>Subtext</dt><dd>18</dd></div><div><dt>Body</dt><dd>16</dd></div><div><dt>Sidebar</dt><dd>14</dd></div><div><dt>Microtext</dt><dd>10</dd></div></dl></div></div>
<details class="aim-detail"><summary>Explore the component library</summary> ${group(fig(9408,'imgImage134','Design system calendar')+fig(9408,'imgImage136','Design system card')+fig(9408,'imgImage140','Design system navigation')+fig(9408,'imgImage145','Design system panel')+fig(9408,'imgImage143','Design system button')+fig(9408,'imgImage146','Design system control')+fig(9408,'imgFrame','Design system icon')+fig(9408,'imgImage144','Design system input')+fig(9408,'imgImage141','Design system selector')+fig(9408,'imgImage139','Design system components'),'aim-components')}
 </details>
 </section>
 <section class="aim-chapter" id="aim-evaluation" data-project-index="Validation & next">
 ${heading('08','Test the loop, then take it into real use.')}
 <div class="aim-reading"><p class="aim-kicker">What we tested</p><p>Internal A/B testing compared goal-setting, in-meeting logging and data review. Three external SLP/PWS stakeholders then walked through the prototype using think-aloud and SUS.</p><p class="aim-kicker">What we learned</p><p>Participants described the tone and step-by-step flows as calming and supportive. In-meeting tracking felt meaningful.</p><p class="aim-kicker">What comes next</p><p>The roadmap moves from design testing to an alpha build and beta pilot, followed by multi-platform expansion.</p></div>
 <blockquote class="aim-quote">“This feels like a complete workflow, not a feature.”<cite>Shaomei Wu · Founder and CEO of AImpower.org</cite></blockquote>
 <footer class="aimpower-links"><a class="inline-link" href="${prototype}" target="_blank" rel="noopener noreferrer">Try the prototype ↗</a><a class="inline-link" href="${source}" target="_blank" rel="noopener noreferrer">Full Figma case study ↗</a></footer>
 </section>
 <dialog class="aim-image-dialog" aria-label="Enlarged project image"><button class="aim-image-close" aria-label="Close enlarged image">Close ×</button><img alt=""><p></p></dialog>
 </article>`;
}
function startAimpowerInteractions(){
 const root=document.querySelector('.aimpower-case');if(!root)return;
 const dialog=root.querySelector('.aim-image-dialog'),image=dialog.querySelector('img');
 const selectTab=tab=>{const owner=tab.closest('[data-aim-tabs]');owner.querySelectorAll('[role="tab"]').forEach(button=>{const active=button===tab;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;document.getElementById(button.getAttribute('aria-controls')).hidden=!active;});window.dispatchEvent(new Event('scroll'));};
 root.addEventListener('click',event=>{
  const tab=event.target.closest('[role="tab"]');if(tab){selectTab(tab);return;}
  const jump=event.target.closest('[data-aim-jump]');if(jump){event.preventDefault();document.getElementById(jump.dataset.aimJump)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});return;}
  const trigger=event.target.closest('[data-aim-image]');if(!trigger)return;const source=trigger.querySelector('img');image.src=source.currentSrc;image.alt=source.alt;dialog.querySelector('p').textContent=trigger.closest('figure').querySelector('figcaption')?.textContent||source.alt;dialog.showModal();
 });
 root.addEventListener('keydown',event=>{const tab=event.target.closest('[role="tab"]');if(!tab||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const tabs=[...tab.parentElement.querySelectorAll('[role="tab"]')];let i=tabs.indexOf(tab);i=event.key==='Home'?0:event.key==='End'?tabs.length-1:(i+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;selectTab(tabs[i]);tabs[i].focus();});
 dialog.querySelector('button').onclick=()=>dialog.close();dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
}
