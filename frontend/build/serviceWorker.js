// This is the service worker for the Agridrone application
// It enables offline functionality and faster loading times

/* eslint-disable no-restricted-globals */
// The above disables eslint warnings about using self and addEventListener in service workers

const CACHE_NAME = 'agridrone-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/main.chunk.js',
  '/static/js/0.chunk.js',
  '/static/js/bundle.js',
  '/static/css/main.chunk.css',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap'
];

// Install a service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Cache and return requests
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then(response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                // Don't cache API calls
                if (!event.request.url.includes('/api/')) {
                  cache.put(event.request, responseToCache);
                }
              });

            return response;
          });
      })
  );
});

// Update the service worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
          return Promise.resolve(); // Return a value to fix the map() lint error
        })
      );
    })
  );
});

// Handle offline fallbacks
self.addEventListener('fetch', event => {
  // Skip this handler if we already handled this event
  if (event.request.mode !== 'navigate' && 
      !(event.request.method === 'GET' && 
        event.request.headers.get('accept').includes('text/html'))) {
    return;
  }
  
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match('/index.html');
    })
  );
});
