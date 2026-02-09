// Firebase Cloud Messaging Service Worker for iOS
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyCx92CLNVBaHLKNxaaY5Ydnrm8HksNapnw",
  authDomain: "bamboo-5008c.firebaseapp.com",
  databaseURL: "https://bamboo-5008c-default-rtdb.firebaseio.com",
  projectId: "bamboo-5008c",
  storageBucket: "bamboo-5008c.firebasestorage.app",
  messagingSenderId: "51130215561",
  appId: "1:51130215561:web:8f8922b2b0b95852946a58",
  measurementId: "G-WFSV2Q6B3D"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// 백그라운드 메시지 수신 (iOS Safari 지원)
messaging.onBackgroundMessage((payload) => {
  const basePath = self.location.pathname.split('/firebase-messaging-sw.js')[0] || '/bamboo';
  const iconPath = basePath + '/icon-192.png';
  
  const notificationTitle = payload.notification?.title || '밤부';
  const notificationOptions = {
    body: payload.notification?.body || '새로운 알림이 있습니다.',
    icon: iconPath,
    badge: iconPath,
    tag: payload.data?.type || 'bamboo-notification',
    data: payload.data || {},
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// 알림 클릭 이벤트
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const basePath = self.location.pathname.split('/firebase-messaging-sw.js')[0] || '/bamboo';
  let targetUrl = basePath + '/index.html';
  
  if (event.notification.data && event.notification.data.tab) {
    targetUrl += `#${event.notification.data.tab}`;
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.includes('/bamboo/') && 'focus' in client) {
          if (client.url !== targetUrl) {
            client.navigate(targetUrl);
          }
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

