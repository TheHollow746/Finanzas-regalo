const CACHE_VERSION = 'v8';
const CACHE_NAME = 'finanzas-soles-' + CACHE_VERSION;
const APP_SHELL = ['./', './index.html', './manifest.json', './icon.svg', './icon-192.png', './icon-512.png'];
// Opcional: si el archivo aún no existe, la instalación NO falla.
const OPCIONAL = ['./intro.mpeg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL).then(() =>
        Promise.all(OPCIONAL.map((u) => cache.add(u).catch(() => {})))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// El audio se pide con cabecera Range: hay que responder 206 desde la copia en caché.
async function responderAudio(req) {
  const cache = await caches.open(CACHE_NAME);
  let res = await cache.match('./intro.mpeg');
  if (!res) {
    try {
      const net = await fetch('./intro.mpeg');
      if (!net.ok) return net;                       // aún no existe: se deja pasar el 404
      await cache.put('./intro.mpeg', net.clone());
      res = net;
    } catch { return Response.error(); }
  }
  const range = req.headers.get('range');
  const buf = await res.arrayBuffer();
  const total = buf.byteLength;
  const tipo = 'audio/mpeg'; // algunos servidores sirven .mpeg como video/mpeg
  const m = range && /bytes=(\d*)-(\d*)/.exec(range);
  if (!m) return new Response(buf, { status: 200, headers: { 'Content-Type': tipo, 'Content-Length': String(total) } });
  let start, end;
  if (m[1] === '') { start = Math.max(0, total - parseInt(m[2], 10)); end = total - 1; }
  else { start = parseInt(m[1], 10); end = m[2] === '' ? total - 1 : Math.min(parseInt(m[2], 10), total - 1); }
  if (start >= total || start > end) {
    return new Response(null, { status: 416, headers: { 'Content-Range': 'bytes */' + total } });
  }
  return new Response(buf.slice(start, end + 1), {
    status: 206,
    headers: {
      'Content-Type': tipo,
      'Content-Range': `bytes ${start}-${end}/${total}`,
      'Content-Length': String(end - start + 1)
    }
  });
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).pathname.endsWith('/intro.mpeg')) {
    event.respondWith(responderAudio(req));
    return;
  }
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          // Cachea también respuestas opacas de CDN (Tailwind, Chart.js)
          if (res && (res.ok || res.type === 'opaque') && res.status !== 206) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => (req.mode === 'navigate' ? caches.match('./index.html') : undefined));
    })
  );
});
