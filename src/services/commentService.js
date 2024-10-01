const {
  createComment,
  updateComment,
  deleteComment,

  findCommentsByPostId,
  findCommentById,
  findCommentsByUserId,
} = require("../repositories/commentRepository");
const {
  increasePostComment,
  decreasePostComment,

  findPostById,
} = require("../repositories/postRepository");
const { findUserById } = require("../repositories/userRepository");
const {
  createNotification,
} = require("../repositories/notificationRepository");

async function newComment(userId, postId, content) {
  try {
    // 유저 및 게시글 검증
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("유저를 찾을 수 없습니다");
    }
    const post = await findPostById(postId);
    if (!post) {
      throw new Error("게시물을 찾을 수 없습니다");
    }

    const comment = await createComment(user, post, content); // 댓글 생성
    await increasePostComment(post._id); // 게시글의 댓글 카운트 증가

    // notification 생성
    await createNotification(user, post.author, post, comment, "댓글");

    return comment;
  } catch (error) {
    throw error;
  }
}

async function modifyMyComment(commentId, content, userId) {
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    let comment = await findCommentById(commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    // 댓글 작성자 확인
    if (comment.author._id.toString() !== user._id.toString()) {
      throw new Error("댓글 작성자가 아닙니다");
    } else {
      comment = await updateComment(comment, content);
      return comment;
    }
  } catch (error) {
    throw error;
  }
}

async function removeMyComment(commentId, userId) {
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    let comment = await findCommentById(commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    // 댓글 작성자 확인
    if (comment.author._id.toString() !== user._id.toString()) {
      throw new Error("댓글 작성자가 아닙니다");
    } else {
      await decreasePostComment(comment.post); // 게시글의 댓글 카운트 감소
      comment = await deleteComment(comment);
    }
  } catch (error) {
    throw error;
  }
}

async function commentsOnThisPost(postId) {
  try {
    const post = await findPostById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    const comments = await findCommentsByPostId(post, []); // 차단없이
    return comments;
  } catch (error) {
    throw error;
  }
}

async function commentsOnThisPostWithBlock(postId, userId) {
  try {
    const post = await findPostById(postId);
    if (!post) {
      throw new Error("Post not found");
    }
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const comments = await findCommentsByPostId(post, user.blockedUsers); // 차단 적용
    return comments;
  } catch (error) {
    throw error;
  }
}

async function myComments(userId, lastCommentId, size) {
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const comments = await findCommentsByUserId(user, lastCommentId, size);
    return comments;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  newComment,
  modifyMyComment,
  removeMyComment,
  myComments,

  commentsOnThisPost,
  commentsOnThisPostWithBlock,
};
