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
        // 댓글에 대댓글이 달린 경우
        const comment = await findCommentById(commentId);
        if (!comment) {
          throw new Error("Comment not found");
        }
        const commentAuthor = await findUserById(comment.author);
        if (!commentAuthor) {
          throw new Error("User not found");
        }

        title = `${user.nickname}님이 댓글에 답글을 남겼습니다`;
        body = content;
        token = commentAuthor.fcmToken;
        parentPostId = post.id;
      } else {
        // 게시글에 댓글이 달린 경우
        const postAuthor = await findUserById(post.author);
        if (!postAuthor) {
          throw new Error("User not found");
        }

        title = `${user.nickname}님이 게시글에 댓글을 남겼습니다`;
        body = content;
        token = postAuthor.fcmToken;
        parentPostId = post.id;
      }
    } else if (type === "좋아요") {
      if (commentId) {
        // 댓글에 좋아요가 달린 경우
        const comment = await findCommentById(commentId);
        if (!comment) {
          throw new Error("Comment not found");
        }
        const commentAuthor = await findUserById(comment.author);
        if (!commentAuthor) {
          throw new Error("User not found");
        }

        title = `${user.nickname}님이 댓글에 좋아요를 눌렀습니다`;
        body = "댓글을 확인해보세요!";
        token = commentAuthor.fcmToken;
        parentPostId = comment.post.id;
      } else {
        // 게시글에 좋아요가 달린 경우
        const post = await findPostById(postId);
        if (!post) {
          throw new Error("Post not found");
        }
        const postAuthor = await findUserById(post.author);
        if (!postAuthor) {
          throw new Error("User not found");
        }

        title = `${user.nickname}님이 게시글에 좋아요를 눌렀습니다`;
        body = "게시글을 확인해보세요!";
        token = postAuthor.fcmToken;
        parentPostId = post.id;
      }
    } else if (type === "채팅") {
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
