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
      region: "us-central1",
    },
    async (event) => {
      const post = event.data.val();
      const {tabName, postId} = event.params;

      // 작성자 본인은 제외
      const author = post.author;
      if (!author) {
        console.log("⚠️ 작성자 정보가 없습니다.");
        return null;
      }

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
          // 본인 제외
          if (user.name === author) {
            continue;
          }

          // admin 사용자는 자동으로 승인된 것으로 처리
          const isApproved = user.approved === true ||
            userId === "admin" ||
            user.name === "admin";
          if (!isApproved) {
            continue;
          }

          if (!user.fcmToken) {
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
                title: "새 글이 등록되었습니다",
                body: `${author}님이 ` +
                  `${tabNames[tabName] || tabName}에 새 글을 작성했습니다.`,
                icon: "/bamboo/icon-192.png",
                badge: "/bamboo/icon-192.png",
                requireInteraction: false,
              },
              fcmOptions: {
                link: `/bamboo/index.html#${tabName}`,
              },
            },
          });
        }

        // 알림 전송 (100개씩 배치로 전송)
        if (messages.length > 0) {
          const batchSize = 100;
          for (let i = 0; i < messages.length; i += batchSize) {
            const batch = messages.slice(i, i + batchSize);
            const result = await admin.messaging().sendEach(batch);
            if (result.failureCount > 0) {
              const failedTokens = [];
              result.responses.forEach((resp, idx) => {
                if (!resp.success) {
                  // 만료된 토큰 처리
                  const errorCode = resp.error && resp.error.code;
                  const invalidCodes = [
                    "messaging/registration-token-not-registered",
                    "messaging/invalid-registration-token",
                    "messaging/invalid-argument",
                  ];
                  const isInvalidToken = errorCode &&
                    invalidCodes.includes(errorCode);
                  if (isInvalidToken) {
                    failedTokens.push(batch[idx].token);
                  }
                }
              });

              // 만료된 토큰 삭제
              if (failedTokens.length > 0) {
                try {
                  const usersSnapshot = await admin
                      .database()
                      .ref("users")
                      .once("value");
                  const users = usersSnapshot.val();

                  if (users) {
                    for (const [userId, user] of Object.entries(users)) {
                      if (user.fcmToken &&
                          failedTokens.includes(user.fcmToken)) {
                        await admin
                            .database()
                            .ref(`users/${userId}/fcmToken`)
                            .remove();
                      }
                    }
                  }
                } catch (deleteError) {
                  // 토큰 삭제 오류 무시
                }
              }
            }
          }
        }

        return null;
      } catch (error) {
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
      region: "us-central1",
    },
    async (event) => {
      const eventData = event.data.val();
      const {eventId} = event.params;

      // 작성자 본인은 제외
      const author = eventData.author;
      if (!author) {
        console.log("⚠️ 작성자 정보가 없습니다.");
        return null;
      }

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
          // 본인 제외
          if (user.name === author) {
            continue;
          }

          // admin 사용자는 자동으로 승인된 것으로 처리
          const isApproved = user.approved === true ||
            userId === "admin" ||
            user.name === "admin";
          if (!isApproved) {
            continue;
          }

          if (!user.fcmToken) {
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
          const batchSize = 100;
          for (let i = 0; i < messages.length; i += batchSize) {
            const batch = messages.slice(i, i + batchSize);
            const result = await admin.messaging().sendEach(batch);
            if (result.failureCount > 0) {
              const failedTokens = [];
              result.responses.forEach((resp, idx) => {
                if (!resp.success) {
                  // 만료된 토큰 처리
                  const errorCode = resp.error && resp.error.code;
                  const invalidCodes = [
                    "messaging/registration-token-not-registered",
                    "messaging/invalid-registration-token",
                    "messaging/invalid-argument",
                  ];
                  const isInvalidToken = errorCode &&
                    invalidCodes.includes(errorCode);
                  if (isInvalidToken) {
                    failedTokens.push(batch[idx].token);
                  }
                }
              });

              // 만료된 토큰 삭제
              if (failedTokens.length > 0) {
                try {
                  const usersSnapshot = await admin
                      .database()
                      .ref("users")
                      .once("value");
                  const users = usersSnapshot.val();

                  if (users) {
                    for (const [userId, user] of Object.entries(users)) {
                      if (user.fcmToken &&
                          failedTokens.includes(user.fcmToken)) {
                        await admin
                            .database()
                            .ref(`users/${userId}/fcmToken`)
                            .remove();
                      }
                    }
                  }
                } catch (deleteError) {
                  // 토큰 삭제 오류 무시
                }
              }
            }
          }
        }

        return null;
      } catch (error) {
        return null;
      }
    },
);
