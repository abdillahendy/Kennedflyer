const CACHE='kenned-flyer-v1';
self.addEventListener('install',e=>{self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(self.clients.claim());});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    try{
      const res=await fetch(e.request);
      if(res&&(res.ok||res.type==='opaque'))cache.put(e.request,res.clone());
      return res;
    }catch(err){
      const hit=await cache.match(e.request);
      if(hit)return hit;
      if(e.request.mode==='navigate'){
        const root=await cache.match('./');
        if(root)return root;
      }
      throw err;
    }
  })());
});