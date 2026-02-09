# 🎋 Bamboo 프로젝트 - 단계별 가이드

## 전체 프로세스 개요

1. ✅ **기본 웹 페이지 생성** (완료)
2. 🔄 **Firebase 프로젝트 생성 및 설정**
3. 🔄 **GitHub 저장소 생성 및 푸시**
4. 🔄 **GitHub Pages 활성화**
5. 🔄 **Firebase 설정 연결**

---

## 📋 상세 단계

### ✅ 1단계: 기본 웹 페이지 생성 (완료)

이미 `index.html` 파일이 생성되었습니다. 이 파일에는:
- Firebase 연결 테스트 기능
- 데이터 읽기/쓰기 기능
- 현대적인 UI 디자인

이 포함되어 있습니다.

---

### 🔄 2단계: Firebase 프로젝트 생성

**자세한 내용은 `FIREBASE_SETUP.md` 파일을 참고하세요.**

#### 빠른 가이드:
1. https://console.firebase.google.com/ 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름 입력 후 생성
4. "Realtime Database" 활성화
5. 웹 앱 등록 (`</>` 아이콘 클릭)
6. **중요**: 표시되는 `firebaseConfig` 객체 복사!

#### 복사한 설정 예시:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.asia-northeast3.firebasedatabase.app",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

---

### 🔄 3단계: Firebase 설정을 index.html에 추가

1. `index.html` 파일을 열기
2. 123번째 줄 근처의 `firebaseConfig` 객체 찾기
3. 복사한 Firebase 설정 값으로 교체하기

**예시:**
```javascript
const firebaseConfig = {
    apiKey: "AIzaSy...",  // 복사한 값으로 교체
    authDomain: "your-project.firebaseapp.com",  // 복사한 값으로 교체
    databaseURL: "https://your-project-default-rtdb.asia-northeast3.firebasedatabase.app",  // 복사한 값으로 교체
    projectId: "your-project-id",  // 복사한 값으로 교체
    storageBucket: "your-project.appspot.com",  // 복사한 값으로 교체
    messagingSenderId: "123456789",  // 복사한 값으로 교체
    appId: "1:123456789:web:abcdef"  // 복사한 값으로 교체
};
```

---

### 🔄 4단계: GitHub 저장소 생성 및 푸시

**자세한 내용은 `GITHUB_PAGES_SETUP.md` 파일을 참고하세요.**

#### 빠른 가이드:

1. **GitHub 저장소 생성**
   - https://github.com 접속
   - 새 저장소 생성 (예: "bamboo")

2. **로컬에서 Git 초기화 및 푸시**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Firebase 연결 페이지"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

---

### 🔄 5단계: GitHub Pages 활성화

1. GitHub 저장소 페이지 접속
2. "Settings" 탭 클릭
3. 왼쪽 메뉴에서 "Pages" 선택
4. Source: "Deploy from a branch" 선택
5. Branch: "main" 선택
6. Folder: "/ (root)" 선택
7. "Save" 클릭

**배포 완료 후:**
- URL: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`
- 배포에는 1-2분 정도 소요됩니다

---

## 🧪 테스트 방법

1. **로컬 테스트**
   - `index.html` 파일을 브라우저에서 직접 열기
   - Firebase 설정이 올바르면 "✅ Firebase 연결됨" 표시

2. **GitHub Pages 테스트**
   - 배포된 URL 접속
   - "연결 테스트" 버튼 클릭
   - "데이터 쓰기" → "데이터 읽기" 순서로 테스트

---

## ❓ 문제 해결

### Firebase 연결이 안 될 때
- `index.html`의 `firebaseConfig` 값이 올바른지 확인
- Firebase Console에서 Realtime Database가 활성화되어 있는지 확인
- 브라우저 콘솔(F12)에서 오류 메시지 확인

### GitHub Pages가 작동하지 않을 때
- Settings > Pages에서 배포 상태 확인
- 저장소가 Public인지 확인 (Private은 유료 플랜 필요)
- 몇 분 기다린 후 다시 시도

---

## 📚 참고 문서

- `FIREBASE_SETUP.md` - Firebase 상세 설정 가이드
- `GITHUB_PAGES_SETUP.md` - GitHub Pages 상세 설정 가이드
- `README.md` - 프로젝트 개요

