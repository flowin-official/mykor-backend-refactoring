const {
  createPostLike,
  deletePostLike,
  findPostLike,
} = require("../repositories/postLikeRepository");
const {
  createCommentLike,
  deleteCommentLike,
  findCommentLike,
} = require("../repositories/commentLikeRepository");
const {
  findPostById,
  increasePostLike,
  decreasePostLike,
} = require("../repositories/postRepository");
const {
  findCommentById,
  increaseCommentLike,
  decreaseCommentLike,
} = require("../repositories/commentRepository");
const { findUserById } = require("../repositories/userRepository");
const {
  createNotification,
} = require("../repositories/notificationRepository");

async function likePost(postId, userId) {
  try {
    const post = await findPostById(postId);
    if (!post) {
      throw new Error("게시글이 존재하지 않습니다.");
    }
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("사용자가 존재하지 않습니다.");
    }

    let postLike = await findPostLike(post, user);
    if (postLike) {
      throw new Error("이미 좋아요한 게시글입니다.");
    } else {
      if (post.author !== null && post.author._id !== user._id) {
        // 탈퇴한 사용자의 게시물이 아닐 경우, 자신의 게시물이 아닐 경우에만 알림 생성
        await createNotification(user, post.author, post, null, "좋아요"); // 알림 생성
      }
      postLike = await createPostLike(post, user);
      await increasePostLike(post); // 게시글 좋아요 수 증가
    }

    return postLike;
  } catch (error) {
    throw error;
  }
}

async function dislikePost(postId, userId) {
  try {
    const post = await findPostById(postId);
    if (!post) {
      throw new Error("게시글이 존재하지 않습니다.");
    }
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("사용자가 존재하지 않습니다.");
    }

    const postLike = await findPostLike(post, user);
    if (!postLike) {
      throw new Error("좋아요하지 않은 게시글입니다.");
    } else {
      await decreasePostLike(post); // 게시글 좋아요 수 감소
      await deletePostLike(post, user);
    }
  } catch (error) {
    throw error;
  }
}

async function likeComment(commentId, userId) {
  try {
    const comment = await findCommentById(commentId);
    if (!comment) {
      throw new Error("댓글이 존재하지 않습니다.");
    }
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("사용자가 존재하지 않습니다.");
    }

    let commentLike = await findCommentLike(comment, user);
    if (commentLike) {
      throw new Error("이미 좋아요한 댓글입니다.");
    } else {
      if (comment.author !== null && comment.author._id !== user._id) {
        // 탈퇴한 사용자의 댓글이 아닐 경우 자신의 댓글이 아닐 경우에만 알림 생성
        await createNotification(
          user,
          comment.author,
          comment.post,
          comment,
          "좋아요"
        );
      } // 알림 생성
      commentLike = await createCommentLike(comment, user);
      await increaseCommentLike(comment); // 댓글 좋아요 수 증가
    }
    return commentLike;
  } catch (error) {
    throw error;
  }
}

async function dislikeComment(commentId, userId) {
  try {
    const comment = await findCommentById(commentId);
    if (!comment) {
      throw new Error("댓글이 존재하지 않습니다.");
    }
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("사용자가 존재하지 않습니다.");
    }

    const commentLike = await findCommentLike(comment, user);
    if (!commentLike) {
      throw new Error("좋아요하지 않은 댓글입니다.");
    } else {
      await decreaseCommentLike(comment); // 댓글 좋아요 수 감소
      await deleteCommentLike(comment, user);
    }
  } catch (error) {
    throw error;
  }
}

async function isLikedPost(postId, userId) {
  try {
    const post = await findPostById(postId);
    if (!post) {
      throw new Error("게시글이 존재하지 않습니다.");
    }
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("사용자가 존재하지 않습니다.");
    }

    const postLike = await findPostLike(post, user);
    if (postLike) return true;
    return false;
  } catch (error) {
    throw error;
  }
}

async function isLikedComment(commentId, userId) {
  try {
    const comment = await findCommentById(commentId);
    if (!comment) {
      throw new Error("댓글이 존재하지 않습니다.");
    }
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("사용자가 존재하지 않습니다.");
    }

    const commentLike = await findCommentLike(comment, user);
    if (commentLike) return true;
    return false;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  likePost,
  dislikePost,
  likeComment,
  dislikeComment,
  isLikedPost,
  isLikedComment,
};
