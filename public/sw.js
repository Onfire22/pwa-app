/* eslint-disable no-restricted-globals */

const STATIC_CACHE = 's-cache-v1'; // статические данные
const DYNAMIC_CACHE = 'd-cache-v1'; // динамические данные

const URLS = ['/src', '/public/icons', '/public/index.html'];

const getCacheFirst = async (req) => {
  const cached = await caches.match(req);
  return cached ?? await fetch(req);
};

const getFetchFirst = async (request) => {
  const cache = await caches.open(DYNAMIC_CACHE);
  try {
    const response = await fetch(request);
    await cache.put(request, response.clone());
    return response;
  } catch (e) {
    console.error('Fetch failed, no cache available:', e);
    const cached = await cache.match(request);
    return cached ?? new Response('offline', { status: 200, statusText: 'OK' });
  }
};

self.addEventListener('install', async () => {
  const cache = await caches.open(STATIC_CACHE);
  await cache.addAll(URLS);
});

// сервисворкер для уведомлений
self.addEventListener("message", async (e) => {
  if (e.data.type === "SHOW_NOTIFICATION") {
    try {
      await self.registration.showNotification(e.data.title, {
        body: e.data.body,
        icon: e.data.icon,
        vibrate: [200, 100, 200],
      });
    } catch (error) {
      console.log('error')
    }
  } else {
    console.warn("Неизвестный тип сообщения:", e.data.type);
  }
});

// сервисворкер для кеширования
self.addEventListener('fetch', (e) => {
  const { request } = e;
  const url = new URL(request.url);
  if (url.origin === location.origin) {
    e.respondWith(getCacheFirst(request));
  } else {
    e.respondWith(getFetchFirst(request));
  }
})

// сервисворкеры для фоновой загрузки
self.addEventListener('backgroundfetchsuccess', async (event) => {
  const cache = await caches.open('background-fetch-cache');
  const records = await event.registration.matchAll();

  for (const record of records) {
      const response = await record.responseReady;
      await cache.put(record.request, response);
  }

  event.waitUntil(
      self.registration.showNotification('Загрузка завершена', {
          body: 'Ваши файлы загружены!',
          icon: '/icon.png'
      })
  );
});

self.addEventListener('backgroundfetchfail', (event) => {
  console.log('Фоновая загрузка не удалась:', event.registration.id);
});
