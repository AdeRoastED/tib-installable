/* Adeba Studio: offline shell, scoped versioned cache. No background network services. */
const PREFIX='adeba-tib-shell-'+encodeURIComponent(self.registration.scope)+'-', CACHE=PREFIX+'v43-temporal';
const INDEX=new URL('index.html',self.registration.scope).href;
const ROOT=new URL('./',self.registration.scope).href;
self.addEventListener('install',event=>event.waitUntil((async()=>{const response=await fetch(INDEX,{cache:'reload'});if(!response.ok)throw new Error('Game shell unavailable');const cache=await caches.open(CACHE);await cache.put(INDEX,response);})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const name of await caches.keys())if(name.startsWith(PREFIX)&&name!==CACHE)await caches.delete(name);await self.clients.claim();})()));
self.addEventListener('fetch',event=>{const req=event.request;if(req.method!=='GET'||req.mode!=='navigate')return;const url=new URL(req.url);url.hash='';url.search='';if(url.href!==INDEX&&url.href!==ROOT)return;if(new URL(req.url).searchParams.has('test'))return;event.respondWith((async()=>{const saved=await caches.match(INDEX,{cacheName:CACHE});if(saved)return saved;try{const response=await fetch(req);if(response.ok)return response;}catch{}return new Response('Game unavailable offline. Open it online once first.',{status:503,headers:{'Content-Type':'text/plain'}});})());});
