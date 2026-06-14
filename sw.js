// Service Worker — 每次打开强制从网络拉取最新版本
const CACHE_NAME = 'monthly-checkin-v3';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// 完全跳过缓存，始终走网络
self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request));
});
