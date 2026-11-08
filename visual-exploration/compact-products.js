function compactProductMarkup(id){
 const flexi=id==='flexi',title=flexi?'Flexi':'Abi';
 const image=(file,alt)=>`<figure><img src="assets/${id}/${file}" alt="${alt}" loading="lazy"><figcaption>${alt}</figcaption></figure>`;
 const photo=(n,alt)=>image(`${n}.jpg`,alt);
 const framed=(file,alt,cls='')=>`<figure class="${cls}"><div class="abi-media-frame"><img src="assets/${id}/${file}" alt="${alt}" loading="lazy"></div><figcaption>${alt}</figcaption></figure>`;
 const detail=(n,alt)=>image(`detail-${n}.png`,alt);
 const flow=items=>`<ol class="compact-flow">${items.map((s,i)=>`<li><span class="compact-number">0${i+1}</span><h3>${s[0]}</h3><p>${s[1]}</p></li>`).join('')}</ol>`;
 const section=(title,body)=>`<section><h2>${title}</h2>${body}</section>`;
 const pair=(...items)=>`<div class="product-pair product-group-${items.length}">${items.join('')}</div>`;
 let body;
 if(flexi){body=
 section('Why combine two cleaning tools?',`<p>The original market research highlighted a tension: demand for cleaning robots was softening while premium products continued to sell. Yet much of the technical evolution focused on navigation. A smarter robot still did not offer the flexibility of a conventional vacuum.</p>${flow([['Two devices, different jobs','Many households keep both a robot and a vacuum. Their use frequency and cleaning situations differ.'],['Automation has limits','Robots suit regular, open floor areas but can miss spots and cannot cover every surface.'],['A modular response','Bring automatic cleaning and targeted manual cleaning into one product system.']])}`)+
 section('One home, two modes',`<p>Flexi is designed around normal household floor cleaning: automatic coverage for routine work and directional cleaning when a person needs more control.</p>${flow([['Automatic mode','Let the robot clean regular, wide areas.'],['Manual mode','Switch to a conventional vacuum for missed spots and targeted work.'],['Shared base','Connect both modes through charging and storage.']])}${detail(7,'Home cleaning scenario')}${photo(1,'Conventional vacuum configuration')}`)+
 section('Controls and internal structure',`<p>The conventional configuration combines a motor, battery and charger with an easy-to-control handle. A three-setting switch and pull-out dust box support everyday operation and emptying.</p>${pair(detail(11,'Control and product detail'),detail(12,'Modular product detail'),detail(13,'Cleaning component detail'))}${photo(3,'Exploded view of the cleaning assembly')}<p>The robotic configuration includes LDS laser navigation, obstacle-avoidance and cliff sensors, a motor and battery, dust box, two brushes and wheels.</p>`)+
 section('A two-brush system',`<p>The two brushes change their relationship between modes. The proposal uses the same cleaning assembly for two different ways of working.</p>${flow([['Automatic','The brushes rotate in opposite directions, moving debris toward the dust box.'],['Manual','Both brushes rotate in the same direction; the second is connected to the pole.']])}${pair(photo(2,'Two-brush cleaning head'),detail(16,'Robot and base configuration'))}`)+
 section('Charging, storage and reaching missed spots',`<p>The base proposes wireless charging and connects the two modes. The manual configuration takes over where robotic cleaning leaves gaps. A slanted stand-by position is designed for stability and convenient storage.</p><div class="flexi-storage">${detail(20,'Stand-by configuration')}<div>${detail(21,'Cleaning around furniture')}${detail(22,'Reaching underneath furniture')}</div></div>`)+
 section('Tools for other surfaces',`<p>Interchangeable attachments extend the conventional vacuum beyond floor cleaning, bringing the flexibility of familiar vacuum tools into the modular system.</p>${pair(detail(24,'Mattress tool'),detail(25,'Combination tool'),detail(26,'Crevice tool'))}${photo(0,'Flexi product family')}<p class="product-note">Product concept · December 2022–January 2023. Further prototyping would need to evaluate switching between modes, handling, charging and cleaning performance.</p>`);
 }else{body=
 section('Why focus on young people?',`<p>The original research framed high blood pressure as a health issue that can remain unnoticed, including among young people. It cited the WHO’s 2023 report and news reports to question the assumption that blood pressure is only a concern later in life.</p><p>The project asks how a product could make awareness more immediate and support a routine before health management feels remote or overwhelming.</p><details class="product-evidence"><summary>Research references from the original project</summary><p>The original board cites a rise from 650 million people with hypertension in 1990 to 1.3 billion in 2019, and a BBC report from 2023 about approximately 170,000 people aged 16–24 with unrecognized high blood pressure. These are historical research references, not results of the Abi concept.</p>${pair(detail(1,'Original background research'),detail(2,'Original research reference'),detail(3,'Original research reference'),detail(4,'Original research reference'))}</details>`)+
 section('Knowing is not the same as keeping a routine',`<p>The research organized the challenge around three attitudes. Family history, lifestyle, existing conditions and social stereotypes may affect how a young person responds to health information.</p>${flow([['“Maybe later…”','Knowing about a possible risk does not necessarily make it feel urgent or personally relevant.'],['“Life-long treatment?”','The prospect of a lasting health routine can feel difficult to accept.'],['“I’m good enough!”','Once things seem better, it can be tempting to return to previous habits.']])}<details class="product-evidence"><summary>View the original audience framing</summary>${detail(11,'Original audience framing')}</details>`)+
 section('The design brief',`<p>Abi proposes a tool to increase blood pressure health awareness and encourage positive change in young people. Its design combines measurement, breathing guidance and changes in physical form.</p>${flow([['Measurement','Make health information visible through a wearable and companion app.'],['Breathing guide','Translate a guided routine into light and vibration cues.'],['Different forms','Explore how a physical object can communicate beyond an on-screen number.']])}<div class="abi-form-study">${framed('0.jpg','Abi wearable concept')}${framed('detail-16.png','Product form exploration','abi-form-variants')}</div>`)+
 section('Wearable and app work together',`<p>The proposed wearable records signals and passes them to the companion system. The app provides records and guidance; people without the wearable could register or synchronize blood pressure data in the app.</p>${flow([['Record','Collect or synchronize health data.'],['Guide','Offer breathing practice and timely notices.'],['Adapt','Use previous records to inform the next suggested practice.']])}<details class="product-evidence"><summary>View the complete app flow</summary>${photo(2,'Companion app structure and screen flow')}</details><div class="abi-phone-strip" tabindex="0" role="region" aria-label="Abi app screens; scroll horizontally">${detail(27,'01 / Measurement')}${detail(28,'02 / Current result')}${detail(29,'03 / Profile')}${detail(30,'04 / Breathing practice')}${detail(31,'05 / Trends')}</div>`)+
 section('Simple physical interactions',`<p>Pinching is the proposed input. A long press turns the device on or off; pinching twice starts a measurement. Integrated sensors, a loop string and attachment parts support the wearable form.</p>${photo(3,'Wearable form and attachment')}${abiSystemDiagram()}${flow([['Long press','Power on or off.'],['Pinch twice','Start a measurement in the proposed interaction.'],['Light + vibration','Combine visual and tactile cues to make feedback easier to notice.']])}`)+
 section('Biofeedback as an active practice',`<p>The concept explores PPG optical sensing as an input to a feedback system. PPG detects changes in light absorption associated with blood volume; any blood-pressure estimate would require a separately validated sensing and estimation approach.</p>${flow([['Positive feedback','Make changes in recorded signals visible so people can connect practice with feedback.'],['Guided practice','Use vibration and app instructions to support participation in a breathing routine.'],['Active improvement','Treat the routine as a skill learned through repeated practice, rather than passive monitoring.']])}<div class="abi-scenes" tabindex="0" role="region" aria-label="Abi use scenarios">${framed('1.jpg','Breathing practice scenario')}${framed('detail-25.png','Everyday use scenario')}${framed('detail-26.png','Wearable use scenario')}</div><div class="abi-construction">${framed('detail-37.png','Exploded view of the wearable')}${framed('detail-38.png','Optical sensing placement')}</div>${abiFeedbackDiagram()}<p class="product-note">Design concept · January–May 2023. The original proposal explores sensing and biofeedback; clinical accuracy, therapeutic effects and sustained behavior change are not established by this project.</p>`);
 }
 return `<article class="compact-product ${id}-product"><header><p class="compact-meta">Product Design · ${flexi?'December 2022–January 2023':'January–May 2023'}</p><h1>${title}</h1><p class="compact-lead">${flexi?'One-stop modular cleaning for the home.':'Making health awareness part of everyday life.'}</p><p>${flexi?'A modular product concept combining automatic floor cleaning with the flexibility of a conventional vacuum.':'A wearable and companion app concept exploring health awareness through tangible feedback and guided breathing.'}</p></header>${flexi?photo(0,'Flexi product family'):photo(3,'Abi wearable concept')}${body}</article>`;
}

function abiSystemIcon(kind){
 const paths={
  pulse:'M2 12h4l3-7 5 14 3-7h5',
  pill:'M8 3a5 5 0 0 1 7 0l6 6a5 5 0 0 1-7 7l-6-6a5 5 0 0 1 0-7Zm3 3 7 7',
  user:'M8 6a4 4 0 1 0 8 0 4 4 0 1 0-8 0M4 23v-4a8 8 0 0 1 16 0v4',
  doctor:'M8 6a4 4 0 1 0 8 0 4 4 0 1 0-8 0M4 23v-4a8 8 0 0 1 16 0v4M12 14v7M9 18h6',
  chart:'M3 3v18h19M6 16l5-6 4 3 6-8',
  report:'M6 2h9l4 4v16H6ZM10 9h5M10 13h5M10 17h3',
  breath:'M2 8h13a3 3 0 1 0-3-3M2 12h17a3 3 0 1 1-3 3M2 16h6',
  sensor:'M9 8a6 6 0 0 0 0 8M5 4a12 12 0 0 0 0 16M15 8a6 6 0 0 1 0 8M19 4a12 12 0 0 1 0 16M12 11v2',
  activity:'M3 8v8M6 5v14M6 12h12M18 5v14M21 8v8'
 };
 return `<svg class="abi-map-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[kind]||paths.pulse}"/></svg>`;
}
function abiSystemDiagram(){
 const item=(icon,text)=>`<li>${abiSystemIcon(icon)}<span>${text}</span></li>`;
 const card=(title,items)=>`<div class="abi-map-card"><div class="abi-map-card-title">${title}</div><ul>${items.map(([icon,text])=>item(icon,text)).join('')}</ul></div>`;
 return `<figure class="abi-architecture">
  <figcaption>System architecture <button type="button" data-abi-map-toggle aria-expanded="false" aria-controls="abi-system-viewport">Enlarge diagram</button></figcaption>
  <p class="abi-map-scroll-hint" id="abi-map-scroll-hint">Scroll across to explore the complete system <span aria-hidden="true">→</span></p>
  <div class="abi-map-viewport" id="abi-system-viewport" tabindex="-1" role="region" aria-label="Abi system architecture" aria-describedby="abi-map-scroll-hint">
   <div class="abi-map-canvas">
    <svg class="abi-map-connections" viewBox="0 0 1200 1130" aria-hidden="true">
     <defs><marker id="abi-map-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1 9 5 1 9Z"/></marker></defs>
     <g class="abi-map-loop-lines">
      <path d="M570 122C580 76 627 72 685 72"/>
      <path d="M915 72C1020 72 1030 96 1030 122"/>
      <path d="M1030 166C1030 218 970 222 910 222"/>
      <path d="M700 222C600 222 570 203 570 166"/>
     </g>
     <g class="abi-map-data-lines">
      <path d="M305 625H350V692H425"/>
      <path d="M305 770H350V692" class="abi-map-join"/>
      <path d="M540 540V465"/>
      <path d="M540 594V665"/>
      <path d="M655 692H790"/>
      <path d="M750 692V993H790"/>
      <path d="M790 1055H720"/>
      <path d="M435 1055H340"/>
      <path d="M190 1030V963"/>
      <path d="M200 915V840"/>
     </g>
    </svg>
    <div class="abi-map-loop" aria-label="Feedback cycle">
     <div class="abi-map-cycle-node abi-cycle-record">Blood pressure record</div>
     <div class="abi-map-cycle-node abi-cycle-analysis">Feedback and analysis</div>
     <div class="abi-map-cycle-node abi-cycle-recommend">Intelligent recommendation</div>
     <div class="abi-map-cycle-node abi-cycle-practice">Breathing training</div>
    </div>
    <div class="abi-map-module abi-map-feedback">
     <div class="abi-map-label">Information feedback module</div>
     <div class="abi-map-frame abi-map-feedback-grid">
      ${card('Wellness feedback',[['pulse','Current blood pressure result']])}
      ${card('Stage feedback',[['report','Periodic reporting output'],['chart','Periodic data visualization and updates']])}
     </div>
    </div>
    <div class="abi-map-module abi-map-acquisition">
     <div class="abi-map-label">Data acquisition module</div>
     <div class="abi-map-frame">
      ${card('Historical data collection',[['pulse','Blood pressure'],['pill','Medical treatment']])}
      ${card('Real-time data collection',[['user','Gender'],['activity','Physical data'],['pulse','Blood pressure']])}
     </div>
    </div>
    <div class="abi-map-process abi-map-history">History data analysis</div>
    <div class="abi-map-process abi-map-progress">Recovery progress</div>
    <div class="abi-map-module abi-map-users">
     <div class="abi-map-label">User</div>
     <div class="abi-map-frame"><div class="abi-map-user-pair"><div><span>Patient</span>${abiSystemIcon('user')}</div><div><span>Doctor</span>${abiSystemIcon('doctor')}</div></div></div>
    </div>
    <div class="abi-map-module abi-map-recommendation">
     <div class="abi-map-label">Intelligent recommendation module</div>
     <div class="abi-map-frame">
      ${card('Personal rehabilitation plan',[['activity','Lifestyle recommendations: exercise, diet, rest'],['breath','Gamified breathing training']])}
      ${card('Notification',[['breath','Gamified breathing training'],['pulse','Start a measurement'],['chart','Results: current and stage'],['pill','Treatment: digital and medical']])}
     </div>
    </div>
    <div class="abi-map-module abi-map-measuring">
     <div class="abi-map-label">Measuring module</div>
     <div class="abi-map-frame">${card('Biofeedback measuring treatment',[['sensor','Light and vibration guide'],['pulse','Positive and appropriate feedback']])}</div>
    </div>
    <div class="abi-map-process abi-map-analysis">Data analysis</div>
    <div class="abi-map-process abi-map-processing">Data collection and processing</div>
    <div class="abi-map-process abi-map-guidance">Abi-assisted guidance</div>
   </div>
  </div>
  <details class="abi-map-original"><summary>View the original system diagram</summary><img src="assets/abi/detail-33.png" alt="Original Abi system diagram with data acquisition, feedback, recommendation and measuring modules" loading="lazy"></details>
 </figure>`;
}
function abiFeedbackDiagram(){
 return `<figure class="abi-feedback"><figcaption>A wearable feedback loop</figcaption><ol><li><span>01 / Sense</span><h3>Optical signals</h3><p>PPG sensing collects a changing physiological signal.</p></li><li><span>02 / Process</span><h3>Interpret the signal</h3><p>The proposed system processes the input to inform feedback.</p></li><li><span>03 / Respond</span><h3>Light + vibration</h3><p>The wearable gives a tangible cue for the user to follow.</p></li></ol><div class="abi-return"><span aria-hidden="true">↶</span> The user responds; the next signal closes the loop.</div><p class="abi-system-caption">The on-device interaction is intended to work without looking at another screen. The companion app holds records and longer-term context.</p><details><summary>Original feedback diagram</summary><img src="assets/abi/detail-39.png" alt="Original information and feedback loop" loading="lazy"></details></figure>`;
}

// Keep the overview compact; expand the same live diagram when detail is needed.
document.addEventListener('click',event=>{
 const button=event.target.closest('[data-abi-map-toggle]');
 if(!button)return;
 const figure=button.closest('.abi-architecture');
 const expanded=figure.classList.toggle('is-expanded');
 button.setAttribute('aria-expanded',String(expanded));
 button.textContent=expanded?'Reduce diagram':'Enlarge diagram';
 const viewport=figure.querySelector('.abi-map-viewport');
 viewport.tabIndex=expanded?0:-1;
 if(!expanded)viewport.scrollLeft=0;
});
