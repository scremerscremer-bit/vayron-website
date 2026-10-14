(function(){
  const $=s=>document.querySelector(s);
  // Meni
  const mb=$('#menuBtn'),links=$('#links');
  mb.addEventListener('click',()=>{const o=links.classList.toggle('open');mb.setAttribute('aria-expanded',o)});
  links.addEventListener('click',e=>{if(e.target.tagName==='A'){links.classList.remove('open');mb.setAttribute('aria-expanded','false')}});

  // Hero video
  const hv=$('#heroVid'),vb=$('#vidBtn');
  function setVid(play){if(play){const p=hv.play();if(p&&p.catch)p.catch(()=>{});}else hv.pause();vb.textContent=play?'❚❚ Pauza':'▶ Pusti';vb.setAttribute('aria-pressed',String(!play))}
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){hv.removeAttribute('autoplay');setVid(false)}
  vb.onclick=()=>setVid(hv.paused);
  hv.addEventListener('error',()=>{hv.style.display='none'});

  // Tipovi slova
  const TYPES=[
    {id:'front',cls:'g-front',name:'Svijetli lice',en:'Frontlit',desc:'Najčešći tip. Lice od opal pleksija svijetli, bok je neproziran.',depth:'50–100 mm',led:'LED moduli 12 V',use:'Fasade, lokali',dd:70},
    {id:'halo',cls:'g-halo',name:'Halo (backlit)',en:'Backlit',desc:'Lice je zatvoreno, svjetlo izlazi pozadi i pravi oreol na zidu. Elegantan, premium izgled.',depth:'40–60 mm + distanceri',led:'LED moduli 12 V',use:'Uredi, hoteli, saloni',dd:50},
    {id:'full',cls:'g-full',name:'Lice + bok',en:'Front & side-lit',desc:'Svijetli i lice i bok. Maksimalna vidljivost noću i sa strane.',depth:'50–80 mm',led:'LED moduli 12 V',use:'Prometne lokacije',dd:60},
    {id:'side',cls:'g-side',name:'Svijetli bok',en:'Side-lit',desc:'Lice ostaje u boji ili crno, svijetli samo bok. Efekat linije svjetla oko slova.',depth:'40–70 mm',led:'LED traka 12 V',use:'Enterijeri, brendovi',dd:55},
    {id:'none',cls:'g-none',name:'Nesvjetleća 3D slova',en:'Non-illuminated',desc:'Puna 3D slova bez rasvjete, u boji ili s efektom metala. Najpovoljnija opcija.',depth:'10–50 mm',led:'Bez LED-a',use:'Recepcije, unutrašnji natpisi',dd:20},
    {id:'gold',cls:'g-gold',name:'Metalik efekat',en:'Metal finish',desc:'Nesvjetleća slova s lakiranim zlatnim, srebrnim ili bakarnim završetkom.',depth:'10–40 mm',led:'Bez LED-a ili halo',use:'Luksuzni enterijeri',dd:20},
  ];
  const cat=$('#catalog');

  // Konfigurator stanje
  const FACES=[{n:'Bijela',c:'#FFF8EC'},{n:'Crna',c:'#1a1a1a'},{n:'Zlatna',c:'#D4AF63'},{n:'Crvena',c:'#D7263D'},{n:'Plava',c:'#2D6CDF'},{n:'Zelena',c:'#2E9E5B'}];
  const LIGHTS=[{n:'Topla 3000K',c:'255,214,150'},{n:'Neutralna 4000K',c:'255,238,210'},{n:'Hladna 6500K',c:'215,232,255'}];
  const WALLS=[{id:'beton',n:'Beton'},{id:'crna',n:'Crni panel'},{id:'drvo',n:'Drvo'}];
  const st={type:'front',face:0,light:0,wall:'beton',day:false};

  function seg(container,items,key,label,val){
    const c=$(container);c.innerHTML='';
    items.forEach((it,i)=>{const b=document.createElement('button');b.type='button';b.textContent=label(it);
      const v=val(it,i);b.setAttribute('aria-pressed',String(st[key]===v));
      b.onclick=()=>{st[key]=v;seg(container,items,key,label,val);render()};c.appendChild(b)});
  }
  function swatches(){
    const c=$('#c-face');c.innerHTML='';
    FACES.forEach((f,i)=>{const b=document.createElement('button');b.type='button';b.className='sw';b.style.background=f.c;b.title=f.n;b.setAttribute('aria-label',f.n);
      b.setAttribute('aria-pressed',String(st.face===i));b.onclick=()=>{st.face=i;swatches();render()};c.appendChild(b)});
  }
  function shade(hex,amt){const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;
    r=Math.max(0,Math.min(255,Math.round(r*amt)));g=Math.max(0,Math.min(255,Math.round(g*amt)));b=Math.max(0,Math.min(255,Math.round(b*amt)));return `rgb(${r},${g},${b})`}
  function extrude(col,steps,amt){let s=[];for(let i=1;i<=steps;i++)s.push(`${i}px ${i}px 0 ${shade(col,amt-(i*0.04))}`);return s}

  const pv=$('#preview'),stage=$('#stage');
  function render(){
    const txt=($('#c-text').value||'VAYRON').trim()||'VAYRON';
    pv.textContent=txt;
    pv.style.fontFamily=$('#c-font').value;
    const face=FACES[st.face].c,L=LIGHTS[st.light].c;
    const lit=`rgba(${L},1)`,litA=a=>`rgba(${L},${a})`;
    const night=!st.day;
    let color=face,shadow=[],bg='none',clip='';
    pv.style.background='none';pv.style.webkitBackgroundClip='';pv.style.backgroundClip='';pv.style.filter='';
    switch(st.type){
      case 'front':{
        color=night?(st.face===1?'#2a2a2a':`color-mix(in srgb, ${face} 55%, rgb(${L}))`):face;
        shadow=extrude('#3a3630',5,1);
        if(night&&st.face!==1)shadow.unshift(`0 0 8px ${litA(.85)}`,`0 0 28px ${litA(.45)}`);
        break}
      case 'halo':{
        color=face;shadow=extrude(face,3,.55);
        if(night)shadow.push(`0 0 14px ${litA(.95)}`,`0 0 36px ${litA(.6)}`,`0 0 70px ${litA(.3)}`);
        else shadow.push('4px 6px 10px rgba(0,0,0,.5)');
        break}
      case 'full':{
        color=night?`color-mix(in srgb, ${face} 45%, rgb(${L}))`:face;
        const side=night?'#'+L.split(',').map(x=>(+x).toString(16).padStart(2,'0')).join(''):'#bdb6a8';
        shadow=extrude(side,6,1.0);
        if(night)shadow.push(`0 0 30px ${litA(.6)}`);
        break}
      case 'side':{
        color=face;
        const side=night?'#'+L.split(',').map(x=>(+x).toString(16).padStart(2,'0')).join(''):'#9c958a';
        shadow=extrude(side,6,1.0);if(night)shadow.push(`0 0 24px ${litA(.5)}`);
        break}
      case 'none':{color=face;shadow=extrude(face,5,.72);shadow.push('7px 10px 12px rgba(0,0,0,.55)');break}
      case 'gold':{
        color='transparent';pv.style.background='linear-gradient(180deg,#F7E2AE,#C9A45C 55%,#8F7238)';pv.style.webkitBackgroundClip='text';pv.style.backgroundClip='text';
        pv.style.filter='drop-shadow(1px 1px 0 #5d4920) drop-shadow(2px 2px 0 #4a3a1a) drop-shadow(5px 8px 10px rgba(0,0,0,.6))';shadow=[];break}
    }
    pv.style.color=color;pv.style.textShadow=shadow.join(',');
    stage.className='stage wall-'+st.wall+(st.day?' day':'');
    // veličina prikaza prema dužini teksta
    const len=txt.length;pv.style.fontSize=`clamp(28px, ${Math.max(3.2,Math.min(9,62/len))}vw, ${Math.max(40,Math.min(110,900/len))}px)`;
    // procjene
    const h=+$('#c-h').value;$('#c-hv').textContent=h+' cm';
    const n=txt.replace(/\s/g,'').length;
    const fontF={'"Archivo Black",sans-serif':.78,'"Montserrat",sans-serif':.74,'"Bebas Neue",sans-serif':.45,'"Playfair Display",serif':.66,'"Michroma",sans-serif':.95}[$('#c-font').value]||.7;
    const spaces=(txt.match(/\s/g)||[]).length;
    const w=Math.round(h*(fontF*n+.35*spaces)+h*.08*(n-1));
    const t=TYPES.find(x=>x.id===st.type);
    const wTxt=w>=100?(w/100).toFixed(2).replace('.',',')+' m':w+' cm';
    $('#s-n').textContent=n;$('#s-w').textContent=wTxt;
    $('#s-d').textContent=(h<15?Math.min(t.dd,30):t.dd)+' mm';
    const lit2=!['none','gold'].includes(st.type);
    const watts=lit2?Math.max(6,Math.round(n*h*h*0.0045+n*1.5)):0;
    $('#s-p').textContent=lit2?`12 V · ≈${watts} W`:'—';
    $('#d-left').innerHTML=`VISINA <b>${h} cm</b>`;$('#d-right').innerHTML=`ŠIRINA ≈ <b>${wTxt}</b>`;
    return {txt,h,wTxt,t,n};
  }
  seg('#c-type',TYPES,'type',t=>t.name,t=>t.id);
  seg('#c-light',LIGHTS,'light',l=>l.n,(l,i)=>i);
  seg('#c-wall',WALLS,'wall',w=>w.n,w=>w.id);
  swatches();
  ['#c-text','#c-font','#c-h','#c-mount'].forEach(s=>$(s).addEventListener('input',render));
  $('#dayBtn').onclick=function(){st.day=!st.day;this.setAttribute('aria-pressed',st.day);this.textContent=st.day?'Noć':'Dan';render()};
  render();

  cat.addEventListener('click',e=>{const id=e.target.dataset&&e.target.dataset.try;if(!id)return;
    st.type=id;seg('#c-type',TYPES,'type',t=>t.name,t=>t.id);render();
    document.getElementById('konfigurator').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})});

  $('#cfgSend').addEventListener('click',()=>{
    const r=render();
    $('#i-tekst').value=r.txt;
    $('#i-konf').value=`${r.t.name} · visina ${r.h} cm · širina ≈ ${r.wTxt} · lice ${FACES[st.face].n.toLowerCase()} · ${LIGHTS[st.light].n} · ${$('#c-mount').value} · font ${$('#c-font').selectedOptions[0].text.split(' (')[0]}`;
    $('#i-mont').checked=$('#c-mount').value!=='Bez montaže, samo slova';
  });


  // Podstranice modela (#svjetleca, #nesvjetleca)
  const MP={
    svjetleca:{title:'Svjetleća 3D slova',eyebrow:'Tip 01 · s LED rasvjetom',img:'assets/img/svjetleca.jpg',alt:'Svjetleća 3D slova VAYRON s halo LED osvjetljenjem',
      lead:'Slova s ugrađenom LED rasvjetom, vidljiva danju i noću. Modeli se razlikuju po tome odakle svjetlo izlazi: kroz lice, kroz bok ili iza slova.',
      h2:'Šest načina da natpis svijetli',wall:'dark',other:['nesvjetleca','Nesvjetleća 3D slova →'],
      models:[
        {code:'S1L',n:'Svjetleće lice',cls:'g-s1l',cfg:'front',
          d:'Osvijetljeno lice naglašava oblik i boju logotipa, dok nesvjetleći bok daje natpisu jasno definisanu dubinu. Boje i završne obrade prilagođavaju se vizuelnom identitetu brenda.',
          sp:[['Osvjetljenje','kroz lice'],['Lice','plexiglass 3 mm'],['Dubina','50–100 mm'],['LED','3000 / 4000 / 6500 K']],
          details:{tag:'Vaš identitet, istaknut svjetlom.',spec:[['Osvjetljenje','kroz lice slova'],['Lice','plexiglass 3 mm, u boji prema zahtjevu klijenta'],['Bočne stranice','nesvjetleći PETG ili akril'],['Boja boka','sve boje iz RAL Design palete'],['Završna obrada boka','mat ili sjaj'],['Poleđina','pjenasti PVC debljine 10 mm'],['Izvor svjetlosti','SM LED modules / nano-cut LED strip'],['Temperatura svjetlosti','3000K / 4000K / 6500K'],['Dubina','50–100 mm']]}},
        {n:'Halo (backlit)',cls:'g-halo',cfg:'halo',d:'Lice i bok su zatvoreni, a svjetlo izlazi pozadi i pravi oreol na zidu. Elegantan, premium izgled.',sp:[['Dubina','40–60 mm'],['Montaža','Distanceri 20–40 mm'],['Za','Uredi, hoteli, saloni']]},
        {n:'Lice + bok',cls:'g-full',cfg:'full',d:'Svijetle i lice i bok. Natpis je vidljiv i kad mu se prilazi sa strane.',sp:[['Dubina','50–80 mm'],['Bok','Opal, propušta svjetlo'],['Za','Prometne lokacije']]},
        {n:'Svijetli bok',cls:'g-side',cfg:'side',d:'Lice ostaje u boji ili crno, svijetli samo bok. Daje efekat linije svjetla oko slova.',sp:[['Dubina','40–70 mm'],['Rasvjeta','LED traka'],['Za','Enterijeri, brendovi']]},
        {n:'Lice + halo',cls:'g-combo',cfg:null,d:'Kombinacija svjetlećeg lica i oreola iza slova. Najviše svjetla i najjači utisak noću.',sp:[['Dubina','60–100 mm'],['Montaža','Distanceri 20–40 mm'],['Za','Fasade, izlozi']]},
        {n:'Svijetli lice, metalik bok',cls:'g-frontmetal',cfg:null,d:'Svjetleće lice uokvireno bokom u zlatnoj, srebrnoj ili bakarnoj završnoj obradi.',sp:[['Dubina','40–80 mm'],['Bok','Metalik lak'],['Za','Luksuzni brendovi']]}
      ]},
    nesvjetleca:{title:'Nesvjetleća 3D slova',eyebrow:'Tip 02 · bez rasvjete',img:'assets/img/nesvjetleca.jpg',alt:'Nesvjetleća crna 3D slova VAYRON na betonskoj ploči',
      lead:'Puna 3D slova bez rasvjete. Dubina, boja i završna obrada daju natpisu prisustvo i bez svjetla, idealno za enterijere i dobro osvijetljene prostore.',
      h2:'Modeli bez rasvjete',wall:'light',other:['svjetleca','Svjetleća 3D slova →'],
      models:[
        {n:'Puna slova u boji',cls:'g-color',cfg:'none',d:'Lice i bok u jednoj boji po vašem izboru, prema RAL ili Pantone paleti.',sp:[['Dubina','10–50 mm'],['Boja','RAL / Pantone'],['Za','Recepcije, uredi']]},
        {n:'Crna mat',cls:'g-black',cfg:'none',d:'Klasičan, nenametljiv izgled koji odlično stoji na svijetlim i betonskim zidovima.',sp:[['Dubina','10–50 mm'],['Završetak','Mat crni lak'],['Za','Moderni enterijeri']]},
        {n:'Metalik efekat',cls:'g-gold',cfg:'gold',d:'Lakirani zlatni, srebrni ili bakarni završetak koji daje izgled metala uz manju težinu.',sp:[['Dubina','10–40 mm'],['Završetak','Zlato, srebro, bakar'],['Za','Luksuzni enterijeri']]},
        {n:'Na distancerima',cls:'g-float',cfg:'none',d:'Slova odmaknuta od zida pa „lebde“ i bacaju sjenu. Više dubine bez rasvjete.',sp:[['Dubina','20–40 mm'],['Odmak','15–40 mm'],['Za','Fasade, holovi']]},
        {n:'Dvobojna slova',cls:'g-duo',cfg:'none',d:'Lice i bok u različitim bojama, npr. bijelo lice i zlatni bok.',sp:[['Dubina','20–50 mm'],['Boje','Lice i bok odvojeno'],['Za','Brendirani prostori']]},
        {n:'Tanka slova (slim)',cls:'g-slim',cfg:'none',d:'Lagana slova male dubine za unutrašnje natpise, vrata i zidove u uredima.',sp:[['Dubina','5–10 mm'],['Montaža','Ljepljiva traka'],['Za','Uredi, vrata, zidovi']]}
      ]}
  };
  const mainEl=$('#top'),mpEl=$('#models');
  function renderMP(key){
    const p=MP[key];
    $('#mp-crumb').textContent=p.title;$('#mp-eyebrow').textContent=p.eyebrow;$('#mp-title').textContent=p.title;$('#mp-lead').textContent=p.lead;$('#mp-h2').textContent=p.h2;
    const im=$('#mp-img');im.src=p.img;im.alt=p.alt;
    document.querySelectorAll('.mp-tabs a').forEach(a=>{if(a.dataset.tab===key)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
    const o=$('#mp-other');o.href='#'+p.other[0];o.textContent=p.other[1];
    const grid=$('#mp-models');grid.classList.toggle('mc-grid',key==='svjetleca');
    grid.innerHTML=key==='svjetleca'?p.models.map((m,i)=>mcCard(p,m,i)).join(''):p.models.map((m,i)=>`<article class="model">
      <div class="mv ${p.wall}"><span class="mno">${String(i+1).padStart(2,'0')}</span><span class="glyph ${m.cls}">Aa</span></div>
      <div class="body"><h3>${m.n}</h3><p>${m.d}</p>
      <dl class="specs">${m.sp.map(x=>`<dt>${x[0]}</dt><dd>${x[1]}</dd>`).join('')}</dl>
      <div class="acts"><a class="btn btn-gold" href="#upit" data-quote="${p.title} · ${m.n}">Zatraži ponudu</a><a class="try" href="#konfigurator" data-cfg="${m.cfg}">Isprobaj u konfiguratoru</a></div></div></article>`).join('');
  }
  // Kartica modela (katalog svjetlećih slova)
  function mcCard(p,m,i){
    const id='mc-'+(m.code||('m'+(i+1))).toLowerCase();
    const quote=m.code?`Model ${m.code} · ${m.n}`:`${p.title} · ${m.n}`;
    return `<article class="mc" aria-labelledby="${id}-t">
      <div class="mc-vis"><span class="glyph ${m.cls}" aria-hidden="true">Aa</span><span class="mc-ill">Ilustracija efekta</span></div>
      <div class="mc-body">
        <p class="mc-code${m.code?'':' is-pending'}">${m.code||'Model '+String(i+1).padStart(2,'0')}</p>
        <h3 class="mc-name" id="${id}-t">${m.n}</h3>
        ${m.tag?`<p class="mc-tag">${m.tag}</p>`:''}
        <p class="mc-desc">${m.d}</p>
        <dl class="mc-specs">${m.sp.map(x=>`<div><dt>${x[0]}</dt><dd>${x[1]}</dd></div>`).join('')}</dl>
        <div class="mc-acts">
          <a class="btn btn-gold" href="#upit" data-quote="${quote}">Zatraži ponudu</a>
          ${m.details?`<button type="button" class="btn btn-line" data-details="${i}" aria-haspopup="dialog">Detalji modela</button>`:''}
          ${m.cfg?`<a class="mc-try" href="#konfigurator" data-cfg="${m.cfg}">Isprobaj u konfiguratoru</a>`:'<span class="mc-try is-empty" aria-hidden="true">&nbsp;</span>'}
        </div>
      </div>
    </article>`;
  }
  // Modal s detaljima modela
  const dlg=$('#mcDialog');let dlgOpener=null,dlgModel=null;
  function openDetails(m,opener){
    dlgOpener=opener;dlgModel=m;
    $('#mcd-code').textContent=m.code;$('#mcd-title').textContent=m.n;const tg=m.details.tag||m.tag||'';$('#mcd-tag').textContent=tg;$('#mcd-tag').hidden=!tg;$('#mcd-desc').textContent=m.d;
    $('#mcd-spec').innerHTML=m.details.spec.map(r=>`<tr><th scope="row">${r[0]}</th><td>${r[1]}</td></tr>`).join('');
    const nt=$('#mcd-note');nt.textContent=m.details.note||'';nt.hidden=!m.details.note;
    $('#mcd-quote').dataset.quote=`Model ${m.code} · ${m.n}`;
    if(dlg.showModal)dlg.showModal();else dlg.setAttribute('open','');
    document.documentElement.classList.add('mc-lock');
    $('#mcd-close').focus();
  }
  function closeDetails(){if(dlg.open){dlg.close?dlg.close():dlg.removeAttribute('open')}}
  dlg.addEventListener('close',()=>{document.documentElement.classList.remove('mc-lock');if(dlgOpener&&document.contains(dlgOpener)&&!mpEl.hidden)dlgOpener.focus();dlgOpener=null});
  dlg.addEventListener('cancel',e=>{e.preventDefault();closeDetails()});
  dlg.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();closeDetails()}});
  dlg.addEventListener('click',e=>{if(e.target===dlg)closeDetails()});
  $('#mcd-close').addEventListener('click',closeDetails);
  $('#mcd-quote').addEventListener('click',e=>{$('#i-konf').value=e.currentTarget.dataset.quote;dlgOpener=null;closeDetails()});
  $('#mp-models').addEventListener('click',e=>{
    const q=e.target.closest('[data-quote]'),c=e.target.closest('[data-cfg]'),dt=e.target.closest('[data-details]');
    if(dt){const m=MP.svjetleca.models[+dt.dataset.details];if(m&&m.details)openDetails(m,dt);return}
    if(q){$('#i-konf').value=q.dataset.quote.startsWith('Model ')?q.dataset.quote:'Model: '+q.dataset.quote}
    if(c){st.type=c.dataset.cfg;seg('#c-type',TYPES,'type',t=>t.name,t=>t.id);render()}
  });
  let lastPage=null;
  function route(){
    if(dlg.open){dlgOpener=null;closeDetails()}
    const h=decodeURIComponent(location.hash.slice(1));
    if(MP[h]){if(lastPage!==h){renderMP(h);lastPage=h}mainEl.hidden=true;mpEl.hidden=false;window.scrollTo(0,0);document.title=MP[h].title+' · Vayron';return}
    const wasModels=!mpEl.hidden;mpEl.hidden=true;mainEl.hidden=false;document.title='Vayron Visual Technologies';
    if(h){const t=document.getElementById(h==='top'?'top':h);if(t)requestAnimationFrame(()=>t.scrollIntoView({behavior:wasModels?'auto':'smooth'}))}else if(wasModels)window.scrollTo(0,0);
  }
  window.addEventListener('hashchange',route);
  route();

  // Ko šalje upit
  document.querySelectorAll('.who button').forEach(b=>b.onclick=()=>{
    document.querySelectorAll('.who button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
    const firma=b.dataset.who==='firma';$('#i-firma-l').textContent=firma?'Firma':'Naziv objekta (opcionalno)';
  });

  // Forme
  function handle(formId,errId,okId,req,msg){
    $(formId).addEventListener('submit',e=>{
      e.preventDefault();
      const missing=req.filter(id=>!$(id).value.trim());
      const em=req.find(id=>$(id).type==='email');
      if(missing.length){$(errId).textContent='Popunite obavezna polja: '+missing.map(id=>document.querySelector(`label[for="${id.slice(1)}"]`).textContent).join(', ')+'.';$(missing[0]).focus();return}
      if(em&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test($(em).value)){$(errId).textContent='Email adresa nije ispravna. Provjerite da sadrži @ i domen.';$(em).focus();return}
      $(errId).textContent='';const ok=$(okId);ok.innerHTML=msg();ok.classList.add('show');
    });
  }
  handle('#partnerForm','#p-err','#p-ok',['#p-firma','#p-grad','#p-ime','#p-tel','#p-email'],
    ()=>`<b>Prijava je spremna.</b> Javit ćemo se firmi ${$('#p-firma').value.replace(/[<>&]/g,'')} u roku od jednog radnog dana. <br><small style="color:var(--muted)">Slanje forme se aktivira kada stranica bude postavljena na hosting.</small>`);
  handle('#inqForm','#i-err','#i-ok',['#i-ime','#i-email'],
    ()=>`<b>Upit je spreman.</b> Ponudu šaljemo na ${$('#i-email').value.replace(/[<>&]/g,'')} u roku od 24 sata. <br><small style="color:var(--muted)">Slanje forme se aktivira kada stranica bude postavljena na hosting.</small>`);

  // Kopiranje
  document.querySelectorAll('.copy').forEach(b=>b.addEventListener('click',()=>{
    const v=b.dataset.copy;
    const done=()=>{b.textContent='Kopirano';setTimeout(()=>b.textContent='Kopiraj',1500)};
    try{navigator.clipboard.writeText(v).then(done,()=>sel(b))}catch(e){sel(b)}
    function sel(btn){const dd=btn.previousElementSibling;const r=document.createRange();r.selectNodeContents(dd);const s=getSelection();s.removeAllRanges();s.addRange(r)}
  }));
})();
