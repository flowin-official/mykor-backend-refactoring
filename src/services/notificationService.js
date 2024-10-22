const {
  findCommentById,
  findCommentsByPostId,
} = require("../repositories/commentRepository");
const { findPostById } = require("../repositories/postRepository");
const {
  findNotificationsByUserId,
  modifyNotificationsToReadByUserId,
  findUnreadNotificationsByUserId,
} = require("../repositories/notificationRepository");
const { findUserById } = require("../repositories/userRepository");
const admin = require("../config/firebase");

async function myNotifications(userId) {
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    await modifyNotificationsToReadByUserId(user); // 전부 읽음 처리
    const notifications = await findNotificationsByUserId(user);
    return notifications;
  } catch (error) {
    throw error;
  }
}

async function unreadNotifications(userId) {
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const notifications = await findUnreadNotificationsByUserId(user);
    return notifications;
  } catch (error) {
    throw error;
  }
}

async function sendPushNotification(userId, type, postId, commentId, content) {
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // const post = await findPostById(postId);
    // if (!post) {
    //   throw new Error("Post not found");
    // }

    let title = "";
    let body = "";
    let fcmToken = "";
    let parentPostId = "";

    if (type === "댓글") {
      if (commentId) {
        title = `${user.nickname}님이 대댓글을 달았어요`;
        body = content;
        const comment = findCommentById(commentId);
        fcmToken = comment.author.fcmToken;
        parentPostId = postId;
      } else {
        title = `${user.nickname}님이 댓글을 달았어요`;
        body = content;
        const post = findPostById(postId);
        fcmToken = post.author.fcmToken;
        parentPostId = postId;
      }
    } else if (type === "좋아요") {
      if (commentId) {
        title = `${user.nickname}님이 좋아요를 눌렀어요`;
        body = "클릭해서 확인해보세요";
        const comment = findCommentById(commentId);
        fcmToken = comment.author.fcmToken;
        parentPostId = comment.post.id; // 댓글 좋아요 시에 댓글이 달린 게시글로 이동
      } else {
        title = `${user.nickname}님이 좋아요를 눌렀어요`;
        body = "클릭해서 확인해보세요";
        const post = findPostById(postId);
        fcmToken = post.author.fcmToken;
        parentPostId = postId;
      }
    }

    const message = {
      notification: {
        title: title,
        body: body,
      },
      data: {
        postId: parentPostId,
      },
      token: fcmToken,
    };

    // 시간정보가 들어가는지 확인해보고 넣어야함
    await admin.messaging().send(message);
  } catch (error) {
    throw error;
  }
}

module.exports = {
  myNotifications,
  unreadNotifications,
  sendPushNotification,
};
