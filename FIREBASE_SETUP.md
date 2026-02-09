# Firebase 설정 가이드

## 1단계: Firebase 프로젝트 생성

1. **Firebase Console 접속**
   - https://console.firebase.google.com/ 접속
   - Google 계정으로 로그인

2. **새 프로젝트 추가**
   - "프로젝트 추가" 또는 "Add project" 클릭
   - 프로젝트 이름 입력 (예: "bamboo-project")
   - Google Analytics 설정 (선택사항)
   - "프로젝트 만들기" 클릭

3. **Realtime Database 활성화**
   - 왼쪽 메뉴에서 "Realtime Database" 선택
   - "데이터베이스 만들기" 클릭
   - 위치 선택 (asia-northeast3 - 서울 권장)
   - 보안 규칙: "테스트 모드에서 시작" 선택 (나중에 보안 규칙 수정 필요)
   - "완료" 클릭

4. **웹 앱 등록**
   - 프로젝트 개요 페이지에서 `</>` (웹) 아이콘 클릭
   - 앱 닉네임 입력 (예: "bamboo-web")
   - "앱 등록" 클릭
   - **중요**: 표시되는 `firebaseConfig` 객체를 복사해두세요!

## 2단계: Firebase 설정 정보 확인

복사한 설정 정보는 다음과 같은 형태입니다:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.asia-northeast3.firebasedatabase.app",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

이 정보를 `index.html` 파일에 추가해야 합니다.

