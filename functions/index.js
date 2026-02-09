/**
 * Firebase Cloud Functions for Bamboo App
 * 글 작성 및 일정 추가 시 푸시 알림 전송
 */

const {onValueCreated} = require("firebase-functions/v2/database");
const {setGlobalOptions} = require("firebase-functions/v2");
const admin = require("firebase-admin");

admin.initializeApp();

// 글로벌 옵션 설정
setGlobalOptions({maxInstances: 10});

// 탭 이름 매핑
const tabNames = {
  "praise": "칭찬하기",
  "complaint": "민원제기",
  "daily": "일상로그",
};

/**
 * 글 작성 시 알림 전송
 */
exports.onPostCreated = onValueCreated(
    {
      ref: "/posts/{tabName}/{postId}",
    },
    async (event) => {
      const post = event.data.val();
      const {tabName, postId} = event.params;

      // 작성자 본인은 제외
      const author = post.author;
      if (!author) return null;

      try {
        // 모든 사용자의 FCM 토큰 가져오기
        const usersSnapshot = await admin
            .database()
            .ref("users")
            .once("value");
        const users = usersSnapshot.val();

        if (!users) return null;

        const messages = [];

        // 각 사용자에게 알림 메시지 생성
        for (const [userId, user] of Object.entries(users)) {
          // 본인, 승인되지 않은 사용자, FCM 토큰이 없는 사용자는 제외
          if (user.name === author) {
            console.log(`작성자 본인 제외: ${user.name}`);
            continue;
          }
          if (!user.approved) {
            console.log(`승인되지 않은 사용자 제외: ${user.name} (userId: ${userId})`);
            continue;
          }
          if (!user.fcmToken) {
            console.log(`FCM 토큰이 없는 사용자 제외: ${user.name} (userId: ${userId})`);
            continue;
          }

          messages.push({
            token: user.fcmToken,
            notification: {
              title: "새 글이 등록되었습니다",
              body: `${author}님이 ${tabNames[tabName] || tabName}에 새 글을 작성했습니다.`,
            },
            data: {
              type: "post",
              tab: tabName,
              postId: postId,
            },
            webpush: {
              notification: {
                icon: "/bamboo/icon-192.png",
                badge: "/bamboo/icon-192.png",
              },
            },
          });
        }

        // 알림 전송 (100개씩 배치로 전송)
        if (messages.length > 0) {
          console.log(`총 ${messages.length}명에게 알림 전송 시작`);
          const batchSize = 100;
          for (let i = 0; i < messages.length; i += batchSize) {
            const batch = messages.slice(i, i + batchSize);
            const result = await admin.messaging().sendEach(batch);
            const batchNum = i / batchSize + 1;
            console.log(
                `배치 ${batchNum} 전송 완료: ` +
                `성공 ${result.successCount}개, 실패 ${result.failureCount}개`,
            );
            if (result.failureCount > 0) {
              result.responses.forEach((resp, idx) => {
                if (!resp.success) {
                  console.error(`알림 전송 실패 (인덱스 ${idx}):`, resp.error);
                }
              });
            }
          }
          console.log(`✅ 총 ${messages.length}명에게 알림 전송 완료`);
        } else {
          console.log("⚠️ 알림을 받을 사용자가 없습니다.");
        }

        return null;
      } catch (error) {
        console.error("알림 전송 오류:", error);
        return null;
      }
    },
);

/**
 * 일정 추가 시 알림 전송
 */
exports.onEventCreated = onValueCreated(
    {
      ref: "/events/{eventId}",
    },
    async (event) => {
      const eventData = event.data.val();
      const {eventId} = event.params;

      // 작성자 본인은 제외
      const author = eventData.author;
      if (!author) return null;

      try {
        // 모든 사용자의 FCM 토큰 가져오기
        const usersSnapshot = await admin
            .database()
            .ref("users")
            .once("value");
        const users = usersSnapshot.val();

        if (!users) return null;

        const messages = [];

        // 각 사용자에게 알림 메시지 생성
        for (const [userId, user] of Object.entries(users)) {
          // 본인, 승인되지 않은 사용자, FCM 토큰이 없는 사용자는 제외
          if (user.name === author) {
            console.log(`작성자 본인 제외: ${user.name}`);
            continue;
          }
          if (!user.approved) {
            console.log(`승인되지 않은 사용자 제외: ${user.name} (userId: ${userId})`);
            continue;
          }
          if (!user.fcmToken) {
            console.log(`FCM 토큰이 없는 사용자 제외: ${user.name} (userId: ${userId})`);
            continue;
          }

          messages.push({
            token: user.fcmToken,
            notification: {
              title: "새 일정이 등록되었습니다",
              body: `${author}님이 "${eventData.title}" 일정을 추가했습니다.`,
            },
            data: {
              type: "event",
              eventId: eventId,
            },
            webpush: {
              notification: {
                icon: "/bamboo/icon-192.png",
                badge: "/bamboo/icon-192.png",
              },
            },
          });
        }

        // 알림 전송 (100개씩 배치로 전송)
        if (messages.length > 0) {
          console.log(`총 ${messages.length}명에게 알림 전송 시작`);
          const batchSize = 100;
          for (let i = 0; i < messages.length; i += batchSize) {
            const batch = messages.slice(i, i + batchSize);
            const result = await admin.messaging().sendEach(batch);
            const batchNum = i / batchSize + 1;
            console.log(
                `배치 ${batchNum} 전송 완료: ` +
                `성공 ${result.successCount}개, 실패 ${result.failureCount}개`,
            );
            if (result.failureCount > 0) {
              result.responses.forEach((resp, idx) => {
                if (!resp.success) {
                  console.error(`알림 전송 실패 (인덱스 ${idx}):`, resp.error);
                }
              });
            }
          }
          console.log(`✅ 총 ${messages.length}명에게 알림 전송 완료`);
        } else {
          console.log("⚠️ 알림을 받을 사용자가 없습니다.");
        }

        return null;
      } catch (error) {
        console.error("알림 전송 오류:", error);
        return null;
      }
    },
);
