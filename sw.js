// Service Worker for PWA (버전 올리면 캐시 갱신 → 새 코드 적용)
const CACHE_NAME = 'bamboo-v2';
// GitHub Pages 경로에 맞게 동적으로 설정
const basePath = self.location.pathname.split('/sw.js')[0] || '/bamboo';
const urlsToCache = [
  basePath + '/',
  basePath + '/index.html',
  basePath + '/login.html'
];

// 설치 이벤트 (모바일 PWA: 새 버전이 있으면 바로 활성화되도록 skipWaiting)
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// 활성화 이벤트 (열려 있는 PWA 창도 즉시 새 SW가 제어하도록 claim)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) return caches.delete(cacheName);
          })
        );
      }),
      self.clients.claim()
    ])
  );
});

// fetch 이벤트 (오프라인 지원)
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const isIndex = url.pathname.endsWith('/') || url.pathname.endsWith('/index.html');
  // index.html은 먼저 네트워크 요청 → 실패 시 캐시 (배포 후 바로 새 코드 적용)
  if (isIndex) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
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

