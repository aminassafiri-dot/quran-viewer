// Bump VERSION whenever you replace any app file, so phones pick up the update.
// Keep it the same as APP_VERSION in index.html.
const VERSION = 'v7';
const CACHE = 'quran-viewer-' + VERSION;

// The PDF has its own cache so a new app version does not download the 6 MB file again.
// Change PDF_VERSION only when the PDF itself is replaced.
const PDF_VERSION = 'v1';
const PDF_CACHE = 'quran-pdf-' + PDF_VERSION;
const PDF = 'quran_pages_1-604.pdf';

const CORE = ['./', 'index.html', 'manifest.webmanifest', 'pdf.min.js', 'pdf.worker.min.js',
              'icon-192.png', 'icon-512.png', 'icon-maskable-512.png'];

self.addEventListener('install', e => {
  // No skipWaiting here: a new version waits until the reader taps "Update available".
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    // Each file is cached on its own, so one failure can never block the service worker installing
    // cache:'reload' skips the browser's own HTTP cache, so a new version is never filled with stale copies
    await Promise.all(CORE.map(f => c.add(new Request(f, { cache: 'reload' })).catch(err => console.warn('cache miss', f, err))));
    try {
      const pc = await caches.open(PDF_CACHE);
      if (!(await pc.match(PDF))) {
        const old = await caches.match(PDF);                 // reuse a copy saved by an older version
        if (old) await pc.put(PDF, old);
        else { const r = await fetch(PDF); if (r.ok) await pc.put(PDF, r); }
      }
    } catch (err) { console.warn('pdf cache miss', err); }
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== PDF_CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

async function fromCache(req) {
  const opts = { ignoreSearch: true };
  const a = await (await caches.open(CACHE)).match(req, opts);
  return a || (await (await caches.open(PDF_CACHE)).match(req, opts));
}

self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(
    fromCache(req).then(hit => {
      if (hit) return hit;
      return fetch(req).then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          const name = url.pathname.endsWith(PDF) ? PDF_CACHE : CACHE;
          caches.open(name).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => req.mode === 'navigate' ? fromCache('index.html') : Response.error());
    })
  );
});
