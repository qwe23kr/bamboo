// Firebase Cloud Messaging Service Worker
// 이 파일은 Firebase Messaging이 자동으로 찾는 기본 Service Worker입니다.
// 우리의 커스텀 Service Worker (sw.js)를 import합니다.

importScripts('/bamboo/sw.js');

// Firebase Messaging 백그라운드 메시지 수신
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

