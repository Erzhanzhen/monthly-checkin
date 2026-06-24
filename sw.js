// Service Worker — v5 空壳
// 不拦截任何请求，仅占位防止注册失败报错
self.addEventListener('install', function(e) { self.skipWaiting(); });
self.addEventListener('activate', function(e) { e.waitUntil(self.clients.claim()); });
