const CACHE_NAME = 'renkar-v5';
const OFFLINE_PAGE = '/offline.html';

// Core assets that must be cached immediately
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',
  '/offline.html',
  '/assets/logo/opa.png',
  '/js/pwa.js',
  '/js/nav.js'
];

// Install event: cache core assets
self.addEventListener('install', event => {
  console.log('✅ Service worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Caching core assets');
        // Cache core assets and don't fail if some are missing
        return Promise.allSettled(
          CORE_ASSETS.map(url => 
            cache.add(url).catch(err => {
              console.warn(`⚠️ Failed to cache ${url}:`, err);
              return null;
            })
          )
        );
      })
      .then(() => {
        console.log('✅ All core assets cached');
        return self.skipWaiting();
      })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  console.log('🔄 Service worker activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Clearing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => self.clients.claim())
  );
  return self.clients.claim();
});

// Listen for messages from the page
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Helper function to check if request is for an asset file
function isAssetFile(url) {
  return url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|json)$/i);
}

// Fetch event: implement cache strategy
self.addEventListener('fetch', event => {
  // Skip non-GET requests and external URLs
  if (event.request.method !== 'GET' || 
      event.request.url.startsWith('chrome-extension://') ||
      !event.request.url.startsWith('http')) {
    return;
  }

  // Skip non-http(s) requests
  const url = new URL(event.request.url);
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  event.respondWith(
    (async () => {
      try {
        const cachedResponse = await caches.match(event.request);
        
        // If it's a navigation (HTML page) - try network first
        if (event.request.mode === 'navigate') {
          try {
            const networkResponse = await fetch(event.request);
            // Cache the successful response
            if (networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              const cache = await caches.open(CACHE_NAME);
              cache.put(event.request, responseClone);
            }
            return networkResponse;
          } catch (networkError) {
            // Network failed - try cache
            if (cachedResponse) {
              return cachedResponse;
            }
            // No cache - show offline page
            return caches.match(OFFLINE_PAGE);
          }
        }
        
        // For assets: Cache first, then network
        if (isAssetFile(url)) {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          try {
            const networkResponse = await fetch(event.request);
            // Cache successful responses
            if (networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              const cache = await caches.open(CACHE_NAME);
              cache.put(event.request, responseClone);
            }
            return networkResponse;
          } catch (networkError) {
            return new Response('', { status: 503, statusText: 'Offline' });
          }
        }
        
        // Default: Network first, fallback to cache
        try {
          const networkResponse = await fetch(event.request);
          if (networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            const cache = await caches.open(CACHE_NAME);
            cache.put(event.request, responseClone);
          }
          return networkResponse;
        } catch (networkError) {
          if (cachedResponse) {
            return cachedResponse;
          }
          return caches.match(OFFLINE_PAGE);
        }
      } catch (error) {
        console.error('❌ Fetch error:', error);
        return new Response('', { status: 503, statusText: 'Service Unavailable' });
      }
    })()
  );
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    console.log('🔄 Background sync triggered');
    event.waitUntil(
      // Handle offline actions here
      Promise.resolve()
    );
  }
});

// Push notification handler
self.addEventListener('push', event => {
  if (event.data) {
    try {
      const data = event.data.json();
      const title = data.title || 'Renkar';
      const options = {
        body: data.body,
        icon: '/assets/logo/opa.png',
        badge: '/assets/logo/opa.png',
        vibrate: [200, 100, 200]
      };
      
      event.waitUntil(
        self.registration.showNotification(title, options)
      );
    } catch (error) {
      console.error('❌ Push notification error:', error);
    }
  }
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
