// Service Worker for PWA
const CACHE_NAME = 'bamboo-v1';
// GitHub Pages 경로에 맞게 동적으로 설정
const basePath = self.location.pathname.split('/sw.js')[0] || '/bamboo';
const urlsToCache = [
  basePath + '/',
  basePath + '/index.html',
  basePath + '/login.html'
];

// 설치 이벤트
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// 활성화 이벤트
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// fetch 이벤트 (오프라인 지원)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 캐시에 있으면 캐시 반환, 없으면 네트워크 요청
        return response || fetch(event.request);
      })
  );
});

// 푸시 알림 수신
self.addEventListener('push', (event) => {
  
  const iconPath = basePath + '/icon-192.png';
  let notificationData = {
    title: '밤부',
    body: '새로운 알림이 있습니다.',
    icon: iconPath,
    badge: iconPath,
    tag: 'bamboo-notification',
    data: {}
  };
  
  if (event.data) {
    try {
      const payload = event.data.json();
      
      // Firebase Messaging 형식 처리
      if (payload.notification) {
        notificationData = {
          title: payload.notification.title || notificationData.title,
          body: payload.notification.body || notificationData.body,
          icon: payload.notification.icon || iconPath,
          badge: payload.notification.badge || iconPath,
          tag: payload.data?.type || 'bamboo-notification',
          data: payload.data || {}
        };
      } else if (payload.title || payload.body) {
        // 직접 notification 필드가 있는 경우
        notificationData = {
          title: payload.title || notificationData.title,
          body: payload.body || notificationData.body,
          icon: payload.icon || iconPath,
          badge: payload.badge || iconPath,
          tag: payload.tag || 'bamboo-notification',
          data: payload.data || {}
        };
      } else {
        notificationData.body = event.data.text() || notificationData.body;
      }
    } catch (e) {
      notificationData.body = event.data.text() || notificationData.body;
    }
  }
  
  
  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      data: notificationData.data,
      requireInteraction: false,
      silent: false
    })
  );
});

// 알림 클릭 이벤트
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // 이미 열려있는 창이 있으면 포커스
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url.includes('/bamboo/') && 'focus' in client) {
            if (event.notification.data && event.notification.data.tab) {
              client.navigate(`/bamboo/index.html#${event.notification.data.tab}`);
            }
            return client.focus();
          }
        }
        // 없으면 새 창 열기
        if (clients.openWindow) {
          const basePath = self.location.pathname.split('/sw.js')[0] || '/bamboo';
          let url = basePath + '/';
          if (event.notification.data && event.notification.data.tab) {
            url += `index.html#${event.notification.data.tab}`;
          }
          return clients.openWindow(url);
        }
      })
  );
});

