// Bump VERSION whenever you replace any file, so phones pick up the update.
// Keep it the same as APP_VERSION in index.html.
const VERSION = 'v3';
const CACHE = 'quran-viewer-' + VERSION;
const CORE = ['./', 'index.html', 'manifest.webmanifest', 'pdf.min.js', 'pdf.worker.min.js',
              'icon-192.png', 'icon-512.png', 'icon-maskable-512.png'];
const BIG = ['quran_pages_1-604.pdf'];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    // Each file is cached on its own, so one failure can never block the service worker installing
    await Promise.all(CORE.map(f => c.add(f).catch(err => console.warn('cache miss', f, err))));
    await Promise.all(BIG.map(f => c.add(f).catch(err => console.warn('cache miss', f, err))));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => {
      if (hit) return hit;
      return fetch(req).then(res => {
        if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return res;
      }).catch(() => req.mode === 'navigate' ? caches.match('index.html') : Response.error());
    })
  );
});
