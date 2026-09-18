'use strict';
(() => {
const $=s=>document.querySelector(s),all=s=>[...document.querySelectorAll(s)];
const starts=[0,.29,.52,.88,1.46,1.98,2.43,2.88,3.33];
const maxProgress=3.5;
const destinationIds=['services','research','about','contact'];
const journey=$('#journey'),chapters=all('.chapter'),expertise=$('#expertise');
const menu=$('#mobile-menu'),menuToggle=$('#menu-toggle');
const reducedMotion=()=>document.documentElement.classList.contains('motion-off')||matchMedia('(prefers-reduced-motion: reduce)').matches;

function closeMenu(){menu.hidden=true;menuToggle.setAttribute('aria-expanded','false');}
menuToggle.addEventListener('click',()=>{menu.hidden=!menu.hidden;menuToggle.setAttribute('aria-expanded',String(!menu.hidden));});
all('#mobile-menu a').forEach(el=>el.addEventListener('click',closeMenu));

function destinationIndex(id){
 const destination=document.getElementById(id);
 return destination?.matches('.destination')?Number(destination.dataset.destination):-1;
}
function hashFor(index){
 if(index===0)return '';
 if(index===4)return '#expertise';
 if(index>=5&&destinationIds[index-5])return '#'+destinationIds[index-5];
 return '#journey';
}
function destinationTarget(index){return index>=5?document.getElementById(destinationIds[index-5]):index===4?expertise:chapters[index];}
function scrollTopFor(index){
 const range=Math.max(0,journey.offsetHeight-innerHeight);
 return Math.max(0,scrollY+journey.getBoundingClientRect().top+range*starts[index]/maxProgress);
}

let focusToken=0;
function focusWhenAvailable(target){
 if(!target)return;
 const token=++focusToken;
 let timer;
 const clean=()=>{window.removeEventListener('scene-frame',attempt);clearTimeout(timer);};
 const attempt=()=>{
  if(token!==focusToken||!target.isConnected){clean();return;}
  if(!target.inert&&target.getAttribute('aria-hidden')!=='true'&&getComputedStyle(target).visibility!=='hidden'){
   target.focus({preventScroll:true});clean();
  }
 };
 window.addEventListener('scene-frame',attempt);
 timer=setTimeout(clean,15000);
 requestAnimationFrame(attempt);
}
function closeOpenDialogs(){
 const openDialogs=all('dialog[open]');
 openDialogs.forEach(dialog=>{dialog.dataset.skipReturnFocus='true';dialog.close();});
 if(!document.querySelector('dialog[open]'))document.body.style.overflow='';
 return openDialogs.length>0;
}
function navigate(index,updateHistory=true){
 const target=destinationTarget(index);if(!target)return;
 closeOpenDialogs();closeMenu();
 const hash=hashFor(index);
 if(updateHistory&&location.hash!==hash)history.pushState(null,'',location.pathname+location.search+hash);
 if(document.documentElement.classList.contains('no-webgl')){
  target.scrollIntoView({behavior:reducedMotion()?'instant':'smooth',block:'start'});
 }else scrollTo({top:scrollTopFor(index),behavior:reducedMotion()?'instant':'smooth'});
 focusWhenAvailable(target);
}
function navigateFlow(id,updateHistory=true){
 const index=destinationIndex(id),target=document.getElementById(id);
 if(index<5||!target)return;
 closeOpenDialogs();closeMenu();
 const hash='#'+id;
 if(updateHistory&&location.hash!==hash)history.pushState(null,'',location.pathname+location.search+hash);
 if(document.documentElement.classList.contains('no-webgl')){
  target.scrollIntoView({behavior:reducedMotion()?'instant':'smooth',block:'start'});
 }else scrollTo({top:scrollTopFor(index),behavior:reducedMotion()?'instant':'smooth'});
 focusWhenAvailable(target);
}

// Same-document destination links are handled here so the one canvas remains
// mounted. Rail links carry data-chapter and are handled by navigate below.
all('a[href^="#"]').filter(el=>destinationIds.includes(el.hash.slice(1))&&!el.hasAttribute('data-chapter')).forEach(el=>el.addEventListener('click',e=>{
 e.preventDefault();
 const service=el.dataset.contactService,form=$('#contact-form');
 if(service&&form)form.elements.service.value=service;
 navigateFlow(el.hash.slice(1));
}));
all('a[data-chapter]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();navigate(Number(el.dataset.chapter));}));
all('a[href="#expertise"]:not([data-chapter])').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();navigate(4);}));

const capabilityTabs=all('[data-capability]');
function selectCapability(index,focus=false){
 capabilityTabs.forEach((tab,i)=>{const active=i===index;tab.classList.toggle('selected',active);tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;$('#capability-'+i).hidden=!active;if(active&&focus)tab.focus();});
 window.BlueDotScene?.setCapability(index);
}
capabilityTabs.forEach((tab,i)=>{
 tab.addEventListener('click',()=>selectCapability(i));
 tab.addEventListener('keydown',e=>{let n=i;if(e.key==='ArrowRight'||e.key==='ArrowDown')n=(i+1)%3;else if(e.key==='ArrowLeft'||e.key==='ArrowUp')n=(i+2)%3;else if(e.key==='Home')n=0;else if(e.key==='End')n=2;else return;e.preventDefault();selectCapability(n,true);});
});

let previousFocus=null;
function openDialog(dialog){previousFocus=document.activeElement;focusToken++;closeMenu();dialog.showModal();document.body.style.overflow='hidden';}
all('[data-destination-dialog]').forEach(button=>button.addEventListener('click',()=>{
 const dialog=document.getElementById(`${button.dataset.destinationDialog}-dialog`);
 if(dialog)openDialog(dialog);
}));
all('dialog').forEach(dialog=>{
 dialog.addEventListener('close',()=>{
  document.body.style.overflow=document.querySelector('dialog[open]')?'hidden':'';
  const skipReturnFocus=dialog.dataset.skipReturnFocus==='true';delete dialog.dataset.skipReturnFocus;
  if(!document.querySelector('dialog[open]')&&!skipReturnFocus&&previousFocus?.isConnected&&!previousFocus.inert)previousFocus.focus({preventScroll:true});
 });
 dialog.querySelector('.close')?.addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))dialog.close();});
});

function restoreLocation(){
 const id=location.hash.slice(1);
 if(destinationIds.includes(id))navigateFlow(id,false);
 else if(location.hash==='#expertise')navigate(4,false);
}
addEventListener('hashchange',restoreLocation);
addEventListener('popstate',()=>{
 const modalWasOpen=closeOpenDialogs();
 closeMenu();restoreLocation();
 if(modalWasOpen&&!destinationIds.includes(location.hash.slice(1))&&location.hash!=='#expertise')$('.brand')?.focus({preventScroll:true});
});
addEventListener('pageshow',restoreLocation);
window.addEventListener('scene-ready',restoreLocation,{once:true});
if(window.BlueDotScene?.ready())restoreLocation();
if(document.documentElement.classList.contains('no-webgl')){
 all('.chapter,.expertise,.destination').forEach(el=>{el.inert=false;el.removeAttribute('aria-hidden');});
 restoreLocation();
}
// Destination dialogs are open in the no-JavaScript reading fallback. The
// interactive experience closes them before the renderer takes over.
all('.destination-dialog').forEach(dialog=>{if(dialog.open)dialog.close();dialog.dataset.initialized='true';});

document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
const serviceData=[
 {name:'Security & Defense',title:'Find the weak spots before someone else does.',body:'Security doesn\'t have to be complicated or overwhelming. I inspect your web apps, servers, and code to find vulnerabilities—then give you a clear, prioritized list of what to fix.',detail:'Application security reviews, server hardening, code inspection, and practical fix plans. Testing always starts with agreed-upon boundaries and explicit authorization.'},
 {name:'Automating the Busywork',title:'Stop doing by hand what code can do in seconds.',body:'If your team spends hours each week retyping data across apps, emailing spreadsheets, or running repetitive tasks, I can build reliable automations that take care of it in the background.',detail:'Custom workflow integrations (Slack, email, CRMs, spreadsheets), custom AI tools where you stay in control, and automated pipelines that don\'t randomly fail.'},
 {name:'Custom Software',title:'Built specifically for how your team works.',body:'When off-the-shelf software doesn\'t fit your business or forces you into awkward workarounds, I can build a tailored web app, dashboard, or tool that does exactly what you need.',detail:'Full-stack web applications, modern APIs, backend services, and internal tools. Clean TypeScript and Python code, thorough testing, clear documentation, and full source code handoff so you actually own what you paid for.'}
];
all('[data-service]').forEach(button=>button.addEventListener('click',()=>{let s=serviceData[Number(button.dataset.service)];$('#service-label').textContent=s.name;$('#service-title').textContent=s.title;$('#service-body').textContent=s.body;$('#service-detail').textContent=s.detail;$('#service-contact').href='#contact';$('#service-contact').dataset.contactService=['security','automation','software'][Number(button.dataset.service)];openDialog($('#service-dialog'));}));
all('[data-brief]').forEach(b=>b.addEventListener('click',()=>{if($('#service-dialog').open)$('#service-dialog').close();openDialog($('#brief-dialog'));}));
let briefText='';$('#brief-form').addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.target);briefText=`BlueDot IT | Project brief\n\nName: ${String(f.get('name')).trim()}\nEmail: ${String(f.get('email')).trim()}\nService: ${f.get('service')}\n\n${String(f.get('message')).trim()}`;$('#brief-output').textContent=briefText;$('#brief-form').hidden=true;$('#brief-result').hidden=false;$('#copy-brief').focus();});
$('#edit-brief').addEventListener('click',()=>{$('#brief-result').hidden=true;$('#brief-form').hidden=false;$('#name').focus();});
let toastTimer;function toast(msg){$('#toast').textContent=msg;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),3000);}
$('#copy-brief').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(briefText);toast('Brief copied. Nothing has been sent.');}catch{const r=document.createRange();r.selectNodeContents($('#brief-output'));const s=window.getSelection();s.removeAllRanges();s.addRange(r);toast('Brief selected. Use your copy command.');}});
$('#save-brief').addEventListener('click',()=>{const u=URL.createObjectURL(new Blob([briefText],{type:'text/plain'})),a=document.createElement('a');a.href=u;a.download='BlueDot-project-brief.txt';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);});
})();
