// Bump VERSION whenever you replace any file, so phones pick up the update.
const VERSION = 'v1';
const CACHE = 'quran-viewer-' + VERSION;
const FILES = [
  './', 'index.html', 'manifest.webmanifest',
  'pdf.min.js', 'pdf.worker.min.js', 'quran_pages_1-604.pdf',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
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
      if (hit) return hit;                                   // cache-first = fully offline
      return fetch(req).catch(() =>
        req.mode === 'navigate' ? caches.match('index.html') : Response.error());
    })
  );
});
