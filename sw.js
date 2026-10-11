const CACHE='sf-access-2026-10-11-v1';
const BASE=new URL('./',self.location.href);
const CORE=['index.html','pastertia.html','install.css','install.js','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png'].map(p=>new URL(p,BASE).href);
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('sf-access-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==BASE.origin||!url.pathname.startsWith(BASE.pathname)||event.request.headers.has('range'))return;
 if(!CORE.includes(url.origin+url.pathname)&&event.request.mode!=='navigate')return;
 event.respondWith(fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(c=>c.put(event.request,copy)))}return response}).catch(async()=>{
  const cached=await caches.match(event.request,{ignoreSearch:true});if(cached)return cached;
  return new Response('Lidhja me internetin mungon. Provo përsëri kur të kesh internet.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
 }));
});
