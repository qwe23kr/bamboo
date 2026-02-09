# Firebase Functions 배포 권한 설정

## 문제
Functions 배포 시 IAM 권한이 필요합니다.

## 해결 방법

### 방법 1: Firebase Console에서 설정 (가장 간단)

1. Firebase Console 접속: https://console.firebase.google.com
2. 프로젝트 선택: `bamboo-5008c`
3. 왼쪽 메뉴에서 **Functions** 클릭
4. **권한** 또는 **IAM** 섹션 확인
5. 필요한 권한이 자동으로 설정될 수 있습니다

### 방법 2: gcloud 명령어로 설정

Google Cloud SDK가 설치되어 있다면:

```bash
gcloud projects add-iam-policy-binding bamboo-5008c --member=serviceAccount:service-51130215561@gcp-sa-pubsub.iam.gserviceaccount.com --role=roles/iam.serviceAccountTokenCreator

gcloud projects add-iam-policy-binding bamboo-5008c --member=serviceAccount:51130215561-compute@developer.gserviceaccount.com --role=roles/run.invoker

gcloud projects add-iam-policy-binding bamboo-5008c --member=serviceAccount:51130215561-compute@developer.gserviceaccount.com --role=roles/eventarc.eventReceiver
```

### 방법 3: 프로젝트 소유자 권한으로 재시도

Firebase 프로젝트의 소유자 권한이 있다면:
1. Firebase Console에서 프로젝트 설정 확인
2. 권한이 있다면 배포 명령어를 다시 실행

## 참고

- Blaze 플랜(종량제)으로 업그레이드해야 Functions를 사용할 수 있습니다
- 하지만 무료 할당량이 넉넉하므로 실제로는 거의 무료입니다

