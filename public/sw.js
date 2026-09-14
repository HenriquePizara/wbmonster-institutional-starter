// WbMonster Universal PWA Service Worker v1.0 — ADR-0123
// Aplicação: WbMonster Starter — Portal Institucional
const CACHE_NAME = 'wbmonster-pwa-starter-v1.0';

const PRECACHE_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/offline.html',
  '/favicon.svg',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg'
];

// 1. Instalação: Cache preemptivo do App Shell e tela offline
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('⚡ [WbMonster PWA] Pré-carregando App Shell offline:', CACHE_NAME);
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('⚠️ [WbMonster PWA] Aviso no pré-cache parcial:', err.message);
      });
    }).then(() => self.skipWaiting())
  );
});

// 2. Ativação: Limpeza atômica de versões antigas de cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key.startsWith('wbmonster-pwa-') && key !== CACHE_NAME) {
            console.log('🧹 [WbMonster PWA] Removendo cache obsoleto:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Interceptação de Requisições: Stale-While-Revalidate + Network-First
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Apenas requisições GET
  if (req.method !== 'GET') {
    return;
  }

  // APIs Dinâmicas: Network-First com fallback de status offline gracioso
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(req).catch(() => {
        return new Response(
          JSON.stringify({
            offline: true,
            message: 'Você está no modo offline. As alterações serão sincronizadas quando houver conexão.'
          }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      })
    );
    return;
  }

  // Navegação de Páginas HTML: Stale-While-Revalidate com fallback para offline.html
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cached = await caches.match(req);
          if (cached) return cached;
          const offlinePage = await caches.match('/offline.html');
          return offlinePage || new Response('Modo Offline WbMonster', { headers: { 'Content-Type': 'text/html' } });
        })
    );
    return;
  }

  // Assets Estáticos (CSS, JS, Fontes, SVGs, Imagens): Stale-While-Revalidate
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      const fetchPromise = fetch(req).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        }
        return networkResponse;
      }).catch(() => null);

      return cachedResponse || fetchPromise;
    })
  );
});
