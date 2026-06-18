// Service Worker — 已禁用，不再拦截任何请求
self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    self.clients.claim().then(() => {
      // 通知所有客户端刷新
      return self.clients.matchAll().then(clients => {
        clients.forEach(client => client.navigate(client.url));
      });
    })
  );
});

self.addEventListener('fetch', event => {
  // 完全不拦截，让浏览器正常处理
  return;
});
