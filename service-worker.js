const CACHE_NAME = "fuel-calculator-v2";

const CACHE_FILES = [
  "/",
  "/index.html",
  "/manifest.json",
  "/main.js",
  "/icon-192.png",
  "/icon-512.png"
];

// 📦 安裝：快取靜態資源
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CACHE_FILES))
  );
});

// 🔁 啟用：刪掉舊 cache
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 🚀 fetch 攔截策略（核心）
self.addEventListener("fetch", event => {

  const url = event.request.url;

  // ❌ 永遠不 cache：油價 JSON（關鍵）
  if (url.includes("oilprice.json")) {
    event.respondWith(fetch(event.request));
    return;
  }

  // 🌐 HTML：優先 cache，沒有就網路
  if (event.request.mode === "navigate") {
    event.respondWith(
      caches.match("/index.html").then(res => res || fetch(event.request))
    );
    return;
  }

  // 📦 其他靜態資源
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});
