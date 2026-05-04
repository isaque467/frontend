// PWA Service Worker F1
const CACHE_NAME = 'f1-v1';
const urlsToCache = [
  '/',
  '/pages/dashboard.html',
  '/pages/podio.html',
  '/style.css',
  '/podium.css'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request)
      .then(response => response || fetch(e.request))
  );
});

