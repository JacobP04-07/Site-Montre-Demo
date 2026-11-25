const menuToggle=document.querySelector('.menu-toggle');
const mainNav=document.querySelector('#main-navigation');
function closeMenu(){menuToggle.setAttribute('aria-expanded','false');document.querySelector('.site-header').classList.remove('menu-open')}
menuToggle.addEventListener('click',()=>{const open=menuToggle.getAttribute('aria-expanded')!=='true';menuToggle.setAttribute('aria-expanded',String(open));document.querySelector('.site-header').classList.toggle('menu-open',open)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menuToggle.getAttribute('aria-expanded')==='true'){closeMenu();menuToggle.focus()}});
mainNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
matchMedia('(min-width:769px)').addEventListener('change',closeMenu);
const inquiry = document.querySelector('#inquiry');
document.querySelectorAll('[data-inquire]').forEach(button => button.addEventListener('click', () => inquiry.showModal()));
document.querySelectorAll('dialog').forEach(dialog => { dialog.querySelector('.close').addEventListener('click', () => dialog.close()); dialog.addEventListener('click', e => { if(e.target === dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();} }); });
const productImage = document.querySelector('#product-image');
let caption = 'La pièce · Photo fournie';
document.querySelectorAll('[data-image]').forEach(button => button.addEventListener('click', () => { document.querySelectorAll('[data-image]').forEach(b => {b.classList.remove('active');b.setAttribute('aria-pressed','false');}); button.classList.add('active');button.setAttribute('aria-pressed','true');productImage.src='/assets/'+button.dataset.image;productImage.alt=button.dataset.caption;caption=button.dataset.caption+(button.dataset.image==='original.webp'?' · Photo fournie':' · Interprétation générée par IA');const frame=document.querySelector('.main-photo');const rect=frame.getBoundingClientRect();if(rect.top<100||rect.bottom>innerHeight)frame.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}); }));
document.querySelector('#zoom')?.addEventListener('click', () => {const box=document.querySelector('#lightbox');box.querySelector('img').src=productImage.src;box.querySelector('img').alt=productImage.alt;document.querySelector('#lightbox-caption').textContent=caption;box.showModal();});
document.querySelector('#request-form').addEventListener('submit', e => {e.preventDefault();const data=new FormData(e.target);const body=['DEMANDE D’INFORMATIONS','Royal Oak Chronographe','', 'Nom : '+data.get('name'),'Courriel : '+data.get('email'),'',data.get('message'),'','Document préparé localement. Aucun message envoyé et aucune réservation effectuée.'].join('\n');const url=URL.createObjectURL(new Blob([body],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='demande-royal-oak.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);document.querySelector('#form-status').textContent='Votre demande est prête. Transmettez le fichier téléchargé au vendeur. Aucun message n’a été envoyé.';});

// The paused video is a seekable timeline. ScrollTrigger only updates the target;
// seeked coalesces rapid input so reverse scrolling never queues stale seeks.
(()=>{
const story=document.querySelector('.watch-story'),video=document.querySelector('#watch-film');
if(!story||!video)return;
const panels=[...document.querySelectorAll('.story-panel')],jumps=[...document.querySelectorAll('[data-jump]')];
const status=document.querySelector('#film-status'),toggle=document.querySelector('#motion-toggle');
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),mobile=matchMedia('(max-width:640px)');
let trigger,target=0,staticMode=reduced.matches,failed=false,ready=false,raf=0,lastFrame=-1,displayed=0,mediaPromise=null;
const clamp=v=>Math.max(0,Math.min(1,v));
const parts=document.querySelector('.parts-overlay');
const partItems=[...document.querySelectorAll('[data-part]')];
// Coordinates follow the supplied artistic explosion, not a technical drawing.
const partPositions=[[[.26,.51],[.18,.51],[.18,.79]],[[.35,.50],[.34,.49],[.35,.19]],[[.55,.51],[.55,.50],[.63,.81]],[[.79,.55],[.84,.55],[.87,.68]],[[.58,.16],[.62,.12],[.79,.17]]];
let geometry=null;
function measure(){const stage=story.querySelector('.story-stage').getBoundingClientRect(),r=video.getBoundingClientRect();geometry={stage,r};}
function revealParts(p){
 const visible=!staticMode&&!failed&&p>=.36&&p<=.75;
 story.classList.toggle('parts-visible',visible);parts.setAttribute('aria-hidden',String(!visible));
 if(!visible)return;
 if(!geometry)measure();const {stage,r}=geometry;
 const scale=Math.max(r.width/1280,r.height/720),w=1280*scale,h=720*scale;
 const left=r.left-stage.left-(w-r.width)*.68,top=r.top-stage.top-(h-r.height)*.5;
 const t=clamp((p-.4)/.35);
 partItems.forEach((item,i)=>{const [a,b,label]=partPositions[i];const x=Math.max(16,Math.min(stage.width-16,left+(a[0]+(b[0]-a[0])*t)*w));const y=top+(a[1]+(b[1]-a[1])*t)*h;
 const dot=item.querySelector('.part-dot');dot.style.left=x+'px';dot.style.top=y+'px';
 const tag=item.querySelector('.part-label'),line=item.querySelector('.part-line');
 if(!mobile.matches){const lx=label[0]*stage.width,ly=label[1]*stage.height;tag.style.left=lx+'px';tag.style.top=ly+'px';const dx=lx-x,dy=ly-y;line.style.left=x+'px';line.style.top=y+'px';line.style.width=Math.hypot(dx,dy)+'px';line.style.transform='rotate('+Math.atan2(dy,dx)+'rad)';}else{tag.style.left='';tag.style.top='';}
 });
}
new ResizeObserver(()=>{measure();revealParts(displayed)}).observe(story.querySelector('.story-stage'));
function reveal(p){
 revealParts(p);
 const index=Math.min(3,Math.floor(p*4));
 panels.forEach((panel,i)=>{const active=i===index||staticMode;panel.classList.toggle('is-current',active);panel.inert=!active;panel.setAttribute('aria-hidden',String(!active));
 if(!staticMode){const local=p*4-i;const edge=i===0?1:clamp(local/.16);const end=i===3?1:clamp((1-local)/.16);panel.style.opacity=active?Math.min(edge,end):0;panel.style.transform=mobile.matches?`translateY(${active?(1-edge)*16:16}px)`:`translateY(calc(-50% + ${active?(1-edge)*20:20}px))`;}
 else{panel.style.opacity='';panel.style.transform='';}});
 jumps.forEach((b,i)=>{if(i===index)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current')});
}
// Every frame is independently decodable. Only seek to a new source frame,
// keep at most one seek in flight, and stop all work when scrolling settles.
const fps=24;
function seek(){
 raf=0;if(!ready||staticMode||failed||video.seeking||document.hidden)return;
 const end=Math.max(0,video.duration-1/fps);
 const frame=Math.min(Math.floor(end*fps),Math.round(target*end*fps));
 if(frame===lastFrame)return;
 lastFrame=frame;
 try{video.currentTime=frame/fps;}catch{lastFrame=-1;}
}
function schedule(){if(!raf&&!staticMode&&!document.hidden)raf=requestAnimationFrame(seek);}
function configure(){
 trigger?.kill();trigger=null;
 story.classList.toggle('static-story',staticMode);toggle.setAttribute('aria-pressed',String(staticMode));toggle.textContent=staticMode?'Activer l’animation au défilement':'Vue sans animation';
 if(staticMode){if(!failed)status.textContent='';video.pause();if(raf)cancelAnimationFrame(raf);raf=0;reveal(0);}
 else if(window.ScrollTrigger&&window.gsap){gsap.registerPlugin(ScrollTrigger);trigger=ScrollTrigger.create({trigger:story,start:'top top',end:'bottom bottom',onUpdate:self=>{target=self.progress;schedule()},onRefresh:self=>{target=self.progress;measure();schedule()}});loadMedia();reveal(displayed);schedule();}
 else{staticMode=true;configure();status.textContent='Animation indisponible. Tous les détails restent accessibles.';}
 window.ScrollTrigger?.refresh();
}
video.addEventListener('loadeddata',()=>{ready=true;status.textContent='';schedule()});
video.addEventListener('seeked',()=>{displayed=clamp(video.currentTime/Math.max(.1,video.duration-1/fps));if(!staticMode)reveal(displayed);schedule()});
video.addEventListener('error',()=>{failed=true;staticMode=true;configure();status.textContent='La vidéo n’a pas pu se charger. Découvrez la pièce ci-dessous.';toggle.hidden=true;});
// Load once into a local media URL: seeking then works even when hosting
// serves MP4 with HTTP 200 instead of byte-range responses.
let mediaURL;
function loadMedia(){
 if(mediaPromise||failed)return mediaPromise;
 // Mobile / constrained devices avoid downloading and decoding a Full HD file.
 const compact=mobile.matches||navigator.connection?.saveData||(navigator.deviceMemory&&navigator.deviceMemory<=4);
 const source=compact?video.dataset.mobileSrc:video.dataset.src;
 const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),45000);
 status.textContent='Préparation de l’animation…';
 mediaPromise=fetch(source,{signal:controller.signal}).then(response=>{if(!response.ok)throw new Error('Video unavailable');return response.blob()}).then(blob=>{
  mediaURL=URL.createObjectURL(blob);video.src=mediaURL;video.preload='auto';video.load();
 }).catch(()=>video.dispatchEvent(new Event('error'))).finally(()=>clearTimeout(timer));
 return mediaPromise;
}
document.addEventListener('visibilitychange',()=>{if(document.hidden){if(raf)cancelAnimationFrame(raf);raf=0;}else schedule()});
window.addEventListener('pagehide',event=>{if(!event.persisted&&mediaURL)URL.revokeObjectURL(mediaURL)});
toggle.addEventListener('click',()=>{staticMode=!staticMode;configure();story.scrollIntoView({behavior:'instant',block:'start'})});
reduced.addEventListener('change',e=>{staticMode=e.matches;configure()});mobile.addEventListener('change',()=>{measure();reveal(displayed)});
jumps.forEach(button=>button.addEventListener('click',()=>{if(!trigger)return;window.scrollTo({top:trigger.start+Number(button.dataset.jump)*(trigger.end-trigger.start),behavior:reduced.matches?'instant':'smooth'})}));
configure();if(video.readyState>=2){ready=true;status.textContent='';schedule()}
window.addEventListener('pageshow',()=>{window.ScrollTrigger?.refresh();schedule()});
})();


// Mark the current section while navigating the single-page experience.
const journeySections=[...document.querySelectorAll('#experience,#histoire,#piece,#acquisition')];
const journeyLinks=[...document.querySelectorAll('#main-navigation a')];
const sectionObserver=new IntersectionObserver(entries=>{const active=entries.filter(e=>e.isIntersecting).at(-1);if(!active)return;journeyLinks.forEach(a=>{if(a.hash==='#'+active.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')});},{rootMargin:'-20% 0px -65% 0px',threshold:0});
journeySections.forEach(section=>sectionObserver.observe(section));
