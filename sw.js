// Cache only the small launcher. The game still needs an internet connection.
const CACHE = 'court-chaos-launcher-v6';
const SHELL = ['./', './index.html', './launcher.css?v=6', './launcher.js?v=6',
  './icon-192.png', './icon-512.png', './manifest.webmanifest', './manifest.zh.webmanifest', './locale.js?v=6',
  './launcher-art/hero.png', './launcher-art/bat.png', './launcher-art/slime.png', './launcher-art/demon.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys
    .filter(key => key.startsWith('court-chaos-launcher-') && key !== CACHE)
    .map(key => caches.delete(key)))));
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;
  const base = new URL('./', self.location.href);
  const home = url.pathname === base.pathname || url.pathname === base.pathname + 'index.html';
  const shell = SHELL.some(path => new URL(path, base).href === url.href);
  if (!home && !shell) return;
  event.respondWith(fetch(event.request).then(response => {
    if (response.ok) {
      const copy = response.clone();
      event.waitUntil(caches.open(CACHE).then(cache => cache.put(home ? base.href : event.request, copy)));
    }
    return response;
  }).catch(() => caches.match(home ? base.href : event.request)));
});
