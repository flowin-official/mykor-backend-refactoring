const { findCommentById } = require("../repositories/commentRepository");
const { findPostById } = require("../repositories/postRepository");
const {
  findNotificationsByUserId,
  modifyNotificationsToReadByUserId,
  findUnreadNotificationsByUserId,
} = require("../repositories/notificationRepository");
const { findUserById } = require("../repositories/userRepository");
const {
  findUserInActiveRoom,
  findRoomByParticipants,
  findUserInBlockRoom,
} = require("../repositories/firebaseRepository");
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

async function sendCommentPush(userId, postId, commentId, content) {
  // 게시글에 댓글 달리면: postId있음, commentId널, content있음
  // 댓글에 대댓글이 달리면: postId있음, commentId있음, content있음
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

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
        throw new Error("CommentAuthor not found");
      }

      const message = {
        notification: {
          title: `${user.nickname}님이 댓글에 답글을 남겼습니다`,
          body: content,
        },
        data: {
          postId: post.id,
          // messageType: "comment",
        },
        token: commentAuthor.fcmToken,
      };

      if (commentAuthor._id.toString() !== userId) {
        // 자신이 댓글에 대댓글을 달았을 경우 푸시알림을 보내지 않음
        await admin.messaging().send(message);
      }
    } else {
      // 게시글에 댓글이 달린 경우
      const postAuthor = await findUserById(post.author);
      if (!postAuthor) {
        throw new Error("User not found");
      }

      const message = {
        notification: {
          title: `${user.nickname}님이 게시글에 댓글을 남겼습니다`,
          body: content,
        },
        data: {
          postId: post.id,
          // messageType: "comment",
        },
        token: postAuthor.fcmToken,
      };

      if (commentAuthor._id.toString() !== userId) {
        // 자신이 게시글에 댓글을 달았을 경우 푸시알림을 보내지 않음
        await admin.messaging().send(message);
      }
    }
  } catch (error) {
    throw error;
  }
}

async function sendLikePush(userId, postId, commentId) {
  // 게시글에 좋아요 달리면: postId있음, commentId널
  // 댓글에 좋아요 달리면: postId없음, commentId있음
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (commentId && !postId) {
      // 댓글에 좋아요가 달린 경우
      const comment = await findCommentById(commentId);
      if (!comment) {
        throw new Error("Comment not found");
      }
      const commentAuthor = await findUserById(comment.author);
      if (!commentAuthor) {
        throw new Error("CommentAuthor not found");
      }

      const message = {
        notification: {
          title: `${user.nickname}님이 댓글에 좋아요를 눌렀습니다`,
          body: "댓글을 확인해보세요!",
        },
        data: {
          postId: comment.post.id,
          // messageType: "like",
        },
        token: commentAuthor.fcmToken,
      };

      if (commentAuthor._id.toString() !== userId) {
        // 자신이 댓글에 좋아요를 눌렀을 경우 푸시알림을 보내지 않음
        await admin.messaging().send(message);
      }
    } else {
      // 게시글에 좋아요가 달린 경우
      const post = await findPostById(postId);
      if (!post) {
        throw new Error("Post not found");
      }
      const postAuthor = await findUserById(post.author);
      if (!postAuthor) {
        throw new Error("PostAuthor not found");
      }

      const message = {
        notification: {
          title: `${user.nickname}님이 게시글에 좋아요를 눌렀습니다`,
          body: "게시글을 확인해보세요!",
        },
        data: {
          postId: post.id,
          // messageType: "like",
        },
        token: postAuthor.fcmToken,
      };

      if (postAuthor._id.toString() !== userId) {
        // 자신이 게시글에 좋아요를 눌렀을 경우 푸시알림을 보내지 않음
        await admin.messaging().send(message);
      }
    }
  } catch (error) {
    throw error;
  }
}

async function sendChatPush(userId, opponentUserId, content) {
  // 상대방 유저의 채팅방 차단 여부, 접속 여부를 확인
  try {
    // 유저 유효성 검사
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const opponent = await findUserById(opponentUserId);
    if (!opponent) {
      throw new Error("Opponent not found");
    }

    // 상대방이 나를 차단했는지 확인
    const isOpponentBlockMe = opponent.blockedUsers.includes(userId)
      ? true
      : false;

    // 상대방과 내가 모두 참여 중인 채팅방이 있는지 확인 (없으면 에러반환)
    const roomId = await findRoomByParticipants(userId, opponentUserId);
    if (!roomId) {
      throw new Error("Chat room not found");
    }

    // 상대방이 채팅방 알림을 끈지 확인
    const isOpponentBlockTheRoom = await findUserInBlockRoom(
      opponentUserId,
      roomId
    );

    // 상대방이 채팅방에 접속중인지 확인
    const isOpponentInRoom = await findUserInActiveRoom(opponentUserId, roomId);

    if (!isOpponentInRoom && !isOpponentBlockTheRoom && !isOpponentBlockMe) {
      // 상대방이 알림을 켜놨고, 채팅방에 없는 경우, 나를 차단하지 않았을 경우 푸시알림을 보냄
      const title = `${user.nickname}님이 채팅을 보냈습니다`;
      const body = content;
      const token = opponent.fcmToken;

      const message = {
        notification: {
          title: title,
          body: body,
        },
        data: {
          roomId: roomId,
          messageType: "chat",
          userId: userId,
        },
        token: token,
      };

      await admin.messaging().send(message);
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  myNotifications,
  unreadNotifications,

  sendCommentPush,
  sendLikePush,
  sendChatPush,
};
