// Service Worker — 自毁版本
// 不拦截任何请求，不缓存任何内容，激活后立即注销自己
self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  // 清除所有缓存
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.registration.unregister())
      .then(() => {
        // 通知所有客户端刷新
        self.clients.matchAll({ type: 'window' }).then(clients => {
          clients.forEach(client => client.navigate(client.url));
        });
      })
  );
});

// 完全不拦截 fetch — 让浏览器直接处理所有请求
