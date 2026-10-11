(() => {
 let pending=null,banner,button,help;
 const standalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
 const stored=(key)=>{try{return localStorage.getItem(key)}catch(_){return null}};
 const remember=(key,val)=>{try{localStorage.setItem(key,val)}catch(_){}};
 window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();pending=event;if(button)button.textContent='Vendose si ikonë'});
 window.addEventListener('appinstalled',()=>{remember('sf_installed','1');banner?.remove();pending=null});
 const ready=()=>{
  if('serviceWorker' in navigator&&location.protocol!=='file:')navigator.serviceWorker.register('./sw.js').catch(()=>{});
  if(standalone()||stored('sf_installed')==='1')return;
  if(Date.now()-Number(stored('sf_install_later')||0)<86400000)return;
  banner=document.createElement('aside');banner.className='sf-install';banner.setAttribute('aria-label','Qasje më e lehtë në libër');
  const msg=document.createElement('p');msg.textContent='Dëshiron qasje më të lehtë në libër? Vendose Serinë e Fikhut si ikonë në telefon ose kompjuter.';
  const actions=document.createElement('div');button=document.createElement('button');button.textContent='Vendose si ikonë';const later=document.createElement('button');later.textContent='Më vonë';
  help=document.createElement('p');help.hidden=true;help.setAttribute('role','status');
  later.onclick=()=>{remember('sf_install_later',String(Date.now()));banner.remove()};
  button.onclick=async()=>{
   if(pending){const event=pending;pending=null;try{await event.prompt();const choice=await event.userChoice;if(choice.outcome==='accepted'){banner.remove();return}}catch(_){} }
   const ios=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
   help.textContent=ios?'Në iPhone/iPad: hape këtë lidhje në Safari, shtyp “Share” (Ndaj), pastaj “Add to Home Screen” (Shto në ekranin kryesor) dhe “Add” (Shto).':'Hape faqen në Chrome ose Edge. Në menynë ⋮ / … zgjidh “Install app” / “Instalo aplikacionin” ose “Add to Home screen” / “Shto në ekranin kryesor”. Në kompjuter mund të shfaqet edhe ikona e instalimit pranë adresës. Nëse je brenda një aplikacioni mesazhesh, hape lidhjen në shfletues.';
   help.hidden=false;
  };
  actions.append(button,later);banner.append(msg,actions,help);document.body.append(banner);
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready);else ready();
})();
