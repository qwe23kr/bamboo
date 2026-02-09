# GitHub Pages 설정 가이드

## 1단계: GitHub 저장소 생성

1. **GitHub에 로그인**
   - https://github.com 접속 및 로그인

2. **새 저장소 생성**
   - 우측 상단 "+" 버튼 클릭 > "New repository"
   - Repository name 입력 (예: "bamboo")
   - Public 또는 Private 선택
   - "Add a README file" 체크 해제 (이미 있으므로)
   - "Create repository" 클릭

## 2단계: 로컬 프로젝트를 GitHub에 푸시

터미널에서 다음 명령어를 실행하세요:

```bash
# Git 초기화 (아직 안했다면)
git init

# 모든 파일 추가
git add .

# 첫 커밋
git commit -m "Initial commit: Firebase 연결 페이지"

# GitHub 저장소 연결 (YOUR_USERNAME과 YOUR_REPO_NAME을 실제 값으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 메인 브랜치로 푸시
git branch -M main
git push -u origin main
```

## 3단계: GitHub Pages 활성화

1. **GitHub 저장소 페이지로 이동**
   - 생성한 저장소 페이지 접속

2. **Settings 메뉴**
   - 저장소 상단의 "Settings" 탭 클릭

3. **Pages 설정**
   - 왼쪽 메뉴에서 "Pages" 선택
   - Source: "Deploy from a branch" 선택
   - Branch: "main" 선택
   - Folder: "/ (root)" 선택
   - "Save" 클릭

4. **배포 완료**
   - 몇 분 후 페이지가 배포됩니다
   - 배포된 URL은 `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/` 형식입니다
   - Settings > Pages에서 URL 확인 가능

## 4단계: 자동 배포 확인

- 코드를 수정하고 푸시하면 자동으로 GitHub Pages에 반영됩니다
- 보통 1-2분 정도 소요됩니다

