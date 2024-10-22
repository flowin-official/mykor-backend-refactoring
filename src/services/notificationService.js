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
  // 게시글에 댓글 달리면: type댓글, postId있음, commentId널, content있음
  // 댓글에 대댓글이 달리면: type댓글, postId있음, commentId있음, content있음
  // 게시글에 좋아요 달리면: type좋아요, postId있음, commentId널, content널
  // 댓글에 좋아요 달리면: type좋아요, postId없음, commentId있음, content널
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    let title = "";
    let body = "";
    let token = "";
    let parentPostId = "";

    if (type === "댓글") {
      const post = await findPostById(postId);
      if (!post) {
        throw new Error("Post not found");
      }

      if (commentId) {
        // 대댓글인 경우
        title = `${user.nickname}님이 대댓글을 달았어요`;
        body = content;

        const comment = findCommentById(commentId);
        if (!comment) {
          throw new Error("Comment not found");
        }
        const user = findUserById(comment.author);
        if (!user) {
          throw new Error("User not found");
        }

        token = user.fcmToken;
        parentPostId = post.id;
      } else {
        // 게시물에 달린 댓글인 경우
        title = `${user.nickname}님이 댓글을 달았어요`;
        body = content;
        token = post.author.fcmToken;
        parentPostId = post.id;
      }
    } else if (type === "좋아요") {
      if (commentId) {
        // 댓글 좋아요인 경우
        title = `${user.nickname}님이 좋아요를 눌렀어요`;
        body = "클릭해서 확인해보세요";

        const comment = findCommentById(commentId);
        if (!comment) {
          throw new Error("Comment not found");
        }

        token = comment.author.fcmToken;
        parentPostId = comment.post.id; // 댓글 좋아요 시에 댓글이 달린 게시글로 이동
      } else {
        // 게시글 좋아요인 경우
        title = `${user.nickname}님이 좋아요를 눌렀어요`;
        body = "클릭해서 확인해보세요";

        const post = findPostById(postId);
        if (!post) {
          throw new Error("Post not found");
        }

        token = post.author.fcmToken;
        parentPostId = post.id;
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
      token: token,
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
